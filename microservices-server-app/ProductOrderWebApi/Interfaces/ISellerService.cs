using ProductOrderWebApi.Dto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ProductOrderWebApi.Interfaces
{
    public interface ISellerService
    {
        Task<GetProductDto> AddProduct(ProductDto product);
        Task<GetProductDto> UpdateProduct(ProductDto product);
        Task<bool> DeleteProduct(long Id);
        Task<List<GetProductDto>> GetProducts(long Id);
        Task<List<GetOrderDto>> GetNewOrders(long userId);
        Task<List<GetOrderDto>> GetOrderHistory(long userId);
    }
}
