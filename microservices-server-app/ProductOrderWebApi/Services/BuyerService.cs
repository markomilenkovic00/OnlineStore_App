using AutoMapper;
using ProductOrderWebApi.Dto;
using ProductOrderWebApi.Infrastructure;
using ProductOrderWebApi.Interfaces;
using ProductOrderWebApi.Models;
using server_app.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text.Json;
using System.Threading.Tasks;

namespace server_app.Services
{
    public class BuyerService : IBuyerService
    {
        private readonly IMapper _mapper;
        private readonly OrdersRepository _ordersRepository;
        private readonly OrderedProductsRepository _orderedProductsRepository;
        private readonly ProductsRepository _productsRepository;
        private readonly HttpClient httpClient;
        public BuyerService(IMapper mapper, ProductOrderDbContext dbContext, HttpClient httpClient)
        {
            _mapper = mapper;
            _ordersRepository = new OrdersRepository(dbContext);
            _orderedProductsRepository = new OrderedProductsRepository(dbContext);
            _productsRepository = new ProductsRepository(dbContext);
            this.httpClient = httpClient;
        }

        public async Task<GetOrderDto> CancelOrder(long orderId, long buyerId)
        {
            Order o = await _ordersRepository.GetOrderById(orderId);
            if (o == null)
                throw new Exception("Error: The order does not exist in database");
            if (o.BuyerId != buyerId)
                throw new Exception("Error: You can't cancel someone other's order.");
            TimeSpan timeDifference = DateTime.Now - o.OrderPlacedOn;
            if (timeDifference.TotalHours <= 1)
                throw new Exception("Error: You can't cancel an order until an hour has passed.");
            o.Canceled = true;
            await _ordersRepository.UpdateOrder(o);
            List<OrderedProduct> listaop = await _orderedProductsRepository.GetAllOrderedProducts();
            listaop = listaop.Where(o => o.OrderId == orderId).ToList();
            foreach (OrderedProduct op in listaop)
            {
                Product p = await _productsRepository.GetProductById(op.ProductId);
                p.Quantity += op.OrderedQuantity;
                await _productsRepository.UpdateProduct(p);
            }
            await _ordersRepository.SaveChangesAsync();
            return _mapper.Map<GetOrderDto>(o);
        }

        public async Task<GetOrderDto> CreateOrder(CreateOrderDto createOrderDto)
        {
            Order o = _mapper.Map<Order>(createOrderDto);
            o.OrderPlacedOn = DateTime.Now;
            Random random = new Random();
            o.DeliveryTime = random.Next(2, 100);
            o.DeliveryDateTime = (o.OrderPlacedOn).AddHours(o.DeliveryTime);

            GetUserProfileDto buyer;
            var response = await httpClient.GetAsync($"/api/userprofile/getprofile/{createOrderDto.BuyerId}");
            var content = await response.Content.ReadAsStringAsync();
            if (response.IsSuccessStatusCode)
            {
                buyer = JsonSerializer.Deserialize<GetUserProfileDto>(content);
            }
            else
            {
                throw new Exception("Error :" + content);
            }

            if (string.IsNullOrEmpty(o.Comment) || string.IsNullOrEmpty(o.Address))
                throw new Exception("Error. There are empty fields.");
            if (createOrderDto.ProductList.Count == 0)
                throw new Exception("Error. Product list is empty.");
            float priceTest = 0;
            HashSet<string> uniqueSellers = new HashSet<string>();
            foreach (ProductItem pi in createOrderDto.ProductList)
            {
                Product p = await _productsRepository.GetProductById(pi.ProductId);
                if (p == null)
                    throw new Exception("Error. There is a product in cart that does not exist in database.");
                if (pi.OrderedQuantity < 1)
                    throw new Exception("Error. Ordered quantity of a product cannot be less than 1.");
                if (pi.OrderedQuantity > p.Quantity)
                    throw new Exception("Error. For product: " + p.Name + " you tried to order " + pi.OrderedQuantity + " pieces, but there are only " + p.Quantity + " available on stock.");
                priceTest += p.Price * pi.OrderedQuantity;
                uniqueSellers.Add(p.UserId.ToString());
            }
            if (priceTest != o.ProductsPrice)
                throw new Exception("Error. Products total price does not match the actual total price from cart.");
            if ((uniqueSellers.Count * 300) != o.DeliveryPrice)
                throw new Exception("Error. Delivery prices does not match.");
            if (priceTest + (uniqueSellers.Count * 300) != o.TotalPrice)
                throw new Exception("Error. Order price does not match total products price from cart.");
            await _ordersRepository.AddOrder(o);
            await _ordersRepository.SaveChangesAsync();

            foreach (ProductItem item in createOrderDto.ProductList)
            {
                Product p = await _productsRepository.GetProductById(item.ProductId);
                p.Quantity -= item.OrderedQuantity;
                await _productsRepository.UpdateProduct(p);
                OrderedProduct op = new OrderedProduct();
                op.ProductId = p.Id;
                op.OrderedQuantity = item.OrderedQuantity;
                op.OrderId = o.Id;
                await _orderedProductsRepository.AddOrderedProduct(op);
            }
            await _ordersRepository.SaveChangesAsync();

            GetOrderDto getOrderDto = _mapper.Map<GetOrderDto>(o);
            getOrderDto.Buyer = _mapper.Map<UserInfoDto>(buyer);
            
            return getOrderDto;
        }

        public async Task<List<GetProductDto>> GetAllProducts()
        {
            List<GetProductDto> lista = new List<GetProductDto>();
            List<Product> products = await _productsRepository.GetAllProducts();
            foreach (Product p in products)
            {
                GetProductDto getProductDto = _mapper.Map<GetProductDto>(p);
                var response = await httpClient.GetAsync($"/api/userprofile/getprofile/{getProductDto.UserId}");
                var content = await response.Content.ReadAsStringAsync();
                if (response.IsSuccessStatusCode)
                {
                    var responseObject = JsonSerializer.Deserialize<GetUserProfileDto>(content);
                    getProductDto.Seller = _mapper.Map<UserInfoDto>(responseObject);
                    lista.Add(getProductDto);
                }
                else
                {
                    throw new Exception("Error :" + content);
                }
            }
            return lista;
        }

        public async Task<List<GetOrderDto>> GetMyOrders(long userId)
        {
            List<GetOrderDto> lista = new List<GetOrderDto>();
            List<Order> orders = await _ordersRepository.GetAllOrders();
            orders = orders.Where(o => o.BuyerId == userId && o.Canceled == false).ToList();
            foreach (Order o in orders)
            {
                GetOrderDto getOrderDto = _mapper.Map<GetOrderDto>(o);
                var response = await httpClient.GetAsync($"/api/userprofile/getprofile/{getOrderDto.BuyerId}");
                var content = await response.Content.ReadAsStringAsync();
                if (response.IsSuccessStatusCode)
                {
                    var responseObject = JsonSerializer.Deserialize<GetUserProfileDto>(content);
                    getOrderDto.Buyer = _mapper.Map<UserInfoDto>(responseObject);
                    lista.Add(getOrderDto);
                }
                else
                {
                    throw new Exception("Error :" + content);
                }
            }

            var orderIds = orders.Select(o => o.Id);
            List<OrderedProduct> orderedProducts = await _orderedProductsRepository.GetAllOrderedProducts();
            orderedProducts = orderedProducts.Where(o => orderIds.Contains(o.OrderId)).ToList();

            foreach (GetOrderDto getOrderDto in lista)
            {
                getOrderDto.ProductList = new List<GetProductDto>();
                foreach (OrderedProduct op in orderedProducts)
                {
                    if (op.OrderId == getOrderDto.Id)
                    {
                        GetProductDto getProductDto = _mapper.Map<GetProductDto>(await _productsRepository.GetProductById(op.ProductId));
                        getProductDto.OrderedQuantity = op.OrderedQuantity;
                        var response = await httpClient.GetAsync($"/api/userprofile/getprofile/{getProductDto.UserId}");
                        var content = await response.Content.ReadAsStringAsync();
                        if (response.IsSuccessStatusCode)
                        {
                            var responseObject = JsonSerializer.Deserialize<GetUserProfileDto>(content);
                            getProductDto.Seller = _mapper.Map<UserInfoDto>(responseObject);
                            getOrderDto.ProductList.Add(getProductDto);
                        }
                        else
                        {
                            throw new Exception("Error :" + content);
                        }
                    }
                }
            }
            return lista;
        }
    }
}
