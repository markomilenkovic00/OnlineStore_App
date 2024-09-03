using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using UserWebApi.Dto;
using UserWebApi.Models;

namespace UserWebApi.Interfaces
{
    public interface IUserProfileService
    {
        Task<GetUserProfileDto> GetUserProfile(long Id);
        Task<GetUserProfileDto> UpdateUserProfile(UpdateUserProfileDto userProfileDto);
    }
}
