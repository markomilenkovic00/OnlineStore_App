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
    [Route("api/userprofile")]
    [ApiController]
    public class UserProfileController : ControllerBase
    {
        private readonly IUserProfileService _userProfileService;

        public UserProfileController(IUserProfileService userProfileService)
        {
            _userProfileService = userProfileService;
        }

        [HttpGet("getprofile/{id}")]
        public async Task<IActionResult> GetUserProfile(long id)
        {
            try
            {
                return Ok(await _userProfileService.GetUserProfile(id));
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [HttpPut("updateprofile")]
        public async Task<IActionResult> UpdateUserProfile([FromForm] UpdateUserProfileDto userProfileDto)
        {
            try
            {
                return Ok(await _userProfileService.UpdateUserProfile(userProfileDto));
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }
    }
}
