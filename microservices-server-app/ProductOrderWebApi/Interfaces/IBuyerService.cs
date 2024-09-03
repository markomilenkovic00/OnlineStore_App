using ProductOrderWebApi.Dto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ProductOrderWebApi.Interfaces
{
    public interface IBuyerService
    {
        Task<List<GetProductDto>> GetAllProducts();
        Task<GetOrderDto> CreateOrder(CreateOrderDto createOrderDto);
        Task<List<GetOrderDto>> GetMyOrders(long userId);
        Task<GetOrderDto> CancelOrder(long orderId, long buyerId);
    }
}
