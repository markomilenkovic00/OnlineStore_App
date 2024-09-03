using AutoMapper;
using ProductOrderWebApi.Dto;
using ProductOrderWebApi.Infrastructure;
using ProductOrderWebApi.Interfaces;
using ProductOrderWebApi.Models;
using server_app.Repositories;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Text.Json;
using System.Threading.Tasks;

namespace server_app.Services
{
    public class SellerService : ISellerService
    {
        private readonly IMapper _mapper;
        private readonly OrdersRepository _ordersRepository;
        private readonly OrderedProductsRepository _orderedProductsRepository;
        private readonly ProductsRepository _productsRepository;
        private readonly HttpClient httpClient;
        public SellerService(IMapper mapper, ProductOrderDbContext dbContext, HttpClient httpClient)
        {
            _mapper = mapper;
            _ordersRepository = new OrdersRepository(dbContext);
            _orderedProductsRepository = new OrderedProductsRepository(dbContext);
            _productsRepository = new ProductsRepository(dbContext);
            this.httpClient = httpClient;
        }

        public async Task<GetProductDto> AddProduct(ProductDto product)
        {
            var response = await httpClient.GetAsync($"/api/userprofile/getprofile/{product.UserId}");
            if (!response.IsSuccessStatusCode)
            {
                var content = await response.Content.ReadAsStringAsync();
                throw new Exception("Error :" + content);
            }                  
            
            Product p = _mapper.Map<Product>(product);
            p.UserId = product.UserId;
            if (string.IsNullOrEmpty(p.Name) || string.IsNullOrEmpty(p.Description) || p.Price == 0 || p.Quantity == 0 || product.PictureFromForm == null)
                throw new Exception("Error. Data inputs cannot be empty.");

            using (var memoryStream = new MemoryStream())
            {
                await product.PictureFromForm.CopyToAsync(memoryStream);
                p.Picture = memoryStream.ToArray();
            }
            await _productsRepository.AddProduct(p);
            await _productsRepository.SaveChangesASync();
            GetProductDto getProductDto = _mapper.Map<GetProductDto>(product);
            getProductDto.Picture = p.Picture;
            getProductDto.Id = p.Id;
            return getProductDto;
        }

        public async Task<bool> DeleteProduct(long Id)
        {
            Product p = await _productsRepository.GetProductById(Id);
            if (p == null)
                throw new Exception("Error. The product does not exist in database.");

            await _productsRepository.DeleteProduct(p);
            await _productsRepository.SaveChangesASync();
            return true;
        }

        public async Task<List<GetOrderDto>> GetNewOrders(long userId)
        {
            List<Product> products = await _productsRepository.GetAllProducts();
            products = products.Where(o => o.UserId == userId).ToList();
            List<Order> orders = await _ordersRepository.GetAllOrders();
            orders = orders.Where(o => o.Canceled == false && DateTime.Now < o.DeliveryDateTime).ToList();
            var productIds = products.Select(o => o.Id);
            var orderIds = orders.Select(o => o.Id);

            List<OrderedProduct> orderedProducts = await _orderedProductsRepository.GetAllOrderedProducts();
            orderedProducts = orderedProducts.Where(o => productIds.Contains(o.ProductId) && orderIds.Contains(o.OrderId)).ToList();

            List<GetOrderDto> lista = new List<GetOrderDto>();
            foreach (Order o in orders)
            {
                List<GetProductDto> ordProducts = new List<GetProductDto>();
                foreach (OrderedProduct op in orderedProducts)
                {
                    if (op.OrderId == o.Id)
                    {
                        GetProductDto getProductDto = _mapper.Map<GetProductDto>(products.Find(o => op.ProductId == o.Id));
                        getProductDto.OrderedQuantity = op.OrderedQuantity;
                        var response = await httpClient.GetAsync($"/api/userprofile/getprofile/{getProductDto.UserId}");
                        var content = await response.Content.ReadAsStringAsync();
                        if (response.IsSuccessStatusCode)
                        {
                            var responseObject = JsonSerializer.Deserialize<GetUserProfileDto>(content);
                            getProductDto.Seller = _mapper.Map<UserInfoDto>(responseObject);
                            ordProducts.Add(getProductDto);
                        }
                        else
                        {
                            throw new Exception("Error :" + content);
                        }
                    }
                }
                if (ordProducts.Count > 0)
                {
                    GetOrderDto getOrderDto = _mapper.Map<GetOrderDto>(o);
                    getOrderDto.ProductList = ordProducts;
                    var response = await httpClient.GetAsync($"/api/userprofile/getprofile/{o.BuyerId}");
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
            }
            return lista;
        }

        public async Task<List<GetOrderDto>> GetOrderHistory(long userId)
        {
            List<Product> products = await _productsRepository.GetAllProducts();
            products = products.Where(o => o.UserId == userId).ToList();
            List<Order> orders = await _ordersRepository.GetAllOrders();
            orders = orders.Where(o => DateTime.Now > o.DeliveryDateTime).ToList();
            var productIds = products.Select(o => o.Id);
            var orderIds = orders.Select(o => o.Id);

            List<OrderedProduct> orderedProducts = await _orderedProductsRepository.GetAllOrderedProducts();
            orderedProducts = orderedProducts.Where(o => productIds.Contains(o.ProductId) && orderIds.Contains(o.OrderId)).ToList();

            List<GetOrderDto> lista = new List<GetOrderDto>();
            foreach (Order o in orders)
            {
                List<GetProductDto> ordProducts = new List<GetProductDto>();
                foreach (OrderedProduct op in orderedProducts)
                {
                    if (op.OrderId == o.Id)
                    {
                        GetProductDto getProductDto = _mapper.Map<GetProductDto>(products.Find(o => op.ProductId == o.Id));
                        getProductDto.OrderedQuantity = op.OrderedQuantity;
                        var response = await httpClient.GetAsync($"/api/userprofile/getprofile/{getProductDto.UserId}");
                        var content = await response.Content.ReadAsStringAsync();
                        if (response.IsSuccessStatusCode)
                        {
                            var responseObject = JsonSerializer.Deserialize<GetUserProfileDto>(content);
                            getProductDto.Seller = _mapper.Map<UserInfoDto>(responseObject);
                            ordProducts.Add(getProductDto);
                        }
                        else
                        {
                            throw new Exception("Error :" + content);
                        }
                    }
                }
                if (ordProducts.Count > 0)
                {
                    GetOrderDto getOrderDto = _mapper.Map<GetOrderDto>(o);
                    getOrderDto.ProductList = ordProducts;
                    var response = await httpClient.GetAsync($"/api/userprofile/getprofile/{o.BuyerId}");
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
            }
            return lista;
        }

        public async Task<List<GetProductDto>> GetProducts(long Id)
        {
            List<GetProductDto> lista = new List<GetProductDto>();
            foreach (Product p in await _productsRepository.GetAllProducts())
                if (p.UserId == Id)
                    lista.Add(_mapper.Map<GetProductDto>(p));
            return lista;
        }

        public async Task<GetProductDto> UpdateProduct(ProductDto product)
        {
            if (product.Price <= 0)
                throw new Exception("Error. Price cannot be less than 1.");
            if (product.Quantity < 0)
                throw new Exception("Error. Quantity cannot be less than 0.");
            if (string.IsNullOrEmpty(product.Name))
                throw new Exception("Error. Product name cannot be empty.");
            if (string.IsNullOrEmpty(product.Description))
                throw new Exception("Error. Product description cannot be empty.");


            Product p = await _productsRepository.GetProductById(product.Id);
            if (p == null)
                throw new Exception("Error. Product does not exist in database.");

            p.Name = product.Name;
            p.Price = product.Price;
            p.Description = product.Description;
            p.Quantity = product.Quantity;
            if (product.PictureFromForm != null)
            {
                using (var memoryStream = new MemoryStream())
                {
                    await product.PictureFromForm.CopyToAsync(memoryStream);
                    p.Picture = memoryStream.ToArray();
                }
            }
            await _productsRepository.SaveChangesASync();
            GetProductDto getProductDto = _mapper.Map<GetProductDto>(product);
            getProductDto.Picture = p.Picture;
            getProductDto.Id = p.Id;
            return getProductDto;
        }
    }
}
