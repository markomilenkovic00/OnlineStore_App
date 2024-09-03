using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using UserWebApi.Dto;
using UserWebApi.Interfaces;

namespace UserWebApi.Controllers
{
    [Route("api/auth")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> RegisterUser([FromForm] RegisterUserDto newUser)
        {
            try
            {
                return Ok(await _authService.RegisterUser(newUser));
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }
        [HttpPost("login")]
        public async Task<IActionResult> LoginUser([FromBody] LoginUserDto user)
        {
            try
            {
                return Ok(await _authService.LoginUser(user));
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [HttpPost("googleregister")]
        public async Task<IActionResult> RegisterGoogle([FromForm] GoogleRegisterUserDto newUser)
        {
            try
            {
                return Ok(await _authService.RegisterUserViaGoogle(newUser));
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [HttpPost("googlelogin")]
        public async Task<IActionResult> LoginGoogle([FromBody] GoogleLoginUserDto googleLoginUserDto)
        {
            try
            {
                return Ok(await _authService.LoginUserViaGoogle(googleLoginUserDto));
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }
    }
}
