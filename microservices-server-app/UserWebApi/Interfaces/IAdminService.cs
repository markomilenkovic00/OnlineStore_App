using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using UserWebApi.Dto;

namespace UserWebApi.Interfaces
{
    public interface IAdminService
    {
        Task<List<GetUserProfileDto>> GetSellers();
        Task<string> DoVerifySeller(long Id, bool verified);
    }
}
