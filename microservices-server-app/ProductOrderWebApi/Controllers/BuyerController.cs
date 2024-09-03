using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ProductOrderWebApi.Dto;
using ProductOrderWebApi.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ProductOrderWebApi.Controllers
{
    [Route("api/buyer")]
    [ApiController]
    public class BuyerController : ControllerBase
    {
        private readonly IBuyerService _buyerService;

        public BuyerController(IBuyerService buyerService)
        {
            _buyerService = buyerService;
        }

        [HttpGet("getproducts")]
        [Authorize(Policy = "BuyerOnly")]
        public async Task<IActionResult> GetProducts()
        {
            try
            {
                return Ok(await _buyerService.GetAllProducts());
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [HttpPost("createorder")]
        [Authorize(Policy = "BuyerOnly")]
        public async Task<IActionResult> CreateOrder([FromBody] CreateOrderDto orderDto)
        {
            try
            {
                return Ok(await _buyerService.CreateOrder(orderDto));
            }
            catch(Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [HttpGet("getmyorders/{userId}")]
        [Authorize(Policy = "BuyerOnly")]
        public async Task<IActionResult> GetMyOrders(long userId)
        {
            try
            {
                return Ok(await _buyerService.GetMyOrders(userId));
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [HttpPut("cancelorder/{orderId}/{buyerId}")]
        [Authorize(Policy = "BuyerOnly")]
        public async Task<IActionResult> CancelOrder(long orderId, long buyerId)
        {
            try
            {
                return Ok(await _buyerService.CancelOrder(orderId, buyerId));
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }
    }
}
