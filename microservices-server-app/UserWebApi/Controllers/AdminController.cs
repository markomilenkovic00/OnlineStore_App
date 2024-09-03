using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using UserWebApi.Interfaces;

namespace UserWebApi.Controllers
{
    [Route("api/admin")]
    [ApiController]
    public class AdminController : ControllerBase
    {
        private readonly IAdminService _adminService;

        public AdminController(IAdminService adminService)
        {
            _adminService = adminService;
        }

        [HttpGet("getsellers")]
        [Authorize(Policy = "AdminOnly")]
        public async Task<IActionResult> GetSellers()
        {
            try
            {
                return Ok(await _adminService.GetSellers());
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [HttpPut("{id}/{verified}")]
        [Authorize(Policy = "AdminOnly")]
        public async Task<IActionResult> DoVerifySeller(long id, bool verified)
        {
            try
            {
                return Ok(await _adminService.DoVerifySeller(id, verified));
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }
    }
}
