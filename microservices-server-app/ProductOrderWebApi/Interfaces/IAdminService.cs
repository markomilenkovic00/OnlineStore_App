using ProductOrderWebApi.Dto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ProductOrderWebApi.Interfaces
{
    public interface IAdminService
    {
        Task<List<GetOrderDto>> GetOrdersHistory();
    }
}
