using AutoMapper;
using ProductOrderWebApi.Dto;
using ProductOrderWebApi.Infrastructure;
using ProductOrderWebApi.Interfaces;
using ProductOrderWebApi.Models;
using server_app.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Mail;
using System.Text.Json;
using System.Threading.Tasks;

namespace server_app.Services
{
    public class AdminService : IAdminService
    {
        private readonly IMapper _mapper;
        private readonly OrdersRepository _ordersRepository;
        private readonly OrderedProductsRepository _orderedProductsRepository;
        private readonly ProductsRepository _productsRepository;
        private readonly HttpClient httpClient;
        public AdminService(IMapper mapper, ProductOrderDbContext dbContext, HttpClient httpClient)
        {
            _mapper = mapper;
            _ordersRepository = new OrdersRepository(dbContext);
            _orderedProductsRepository = new OrderedProductsRepository(dbContext);
            _productsRepository = new ProductsRepository(dbContext);
            this.httpClient = httpClient;
        }

        public async Task<List<GetOrderDto>> GetOrdersHistory()
        {
            List<GetOrderDto> lista = new List<GetOrderDto>();
            List<Order> orders = await _ordersRepository.GetAllOrders();
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
