using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ProductOrderWebApi.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ProductOrderWebApi.Controllers
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

        [HttpGet("getordershistory")]
        [Authorize(Policy = "AdminOnly")]
        public async Task<IActionResult> GetOrdersHistory()
        {
            try
            {
                return Ok(await _adminService.GetOrdersHistory());
            }
            catch(Exception e)
            {
                return BadRequest(e.Message);
            }
        }
    }
}
