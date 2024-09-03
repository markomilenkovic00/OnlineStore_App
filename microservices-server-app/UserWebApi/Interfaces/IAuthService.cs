using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using UserWebApi.Dto;

namespace UserWebApi.Interfaces
{
    public interface IAuthService
    {
        Task<RegisterUserDto> RegisterUser(RegisterUserDto newUser);
        Task<string> LoginUser(LoginUserDto loginUserDto);
        Task<RegisterUserDto> RegisterUserViaGoogle(GoogleRegisterUserDto newUser);
        Task<string> LoginUserViaGoogle(GoogleLoginUserDto googleLoginUserDto);
    }
}
