using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ProductOrderWebApi.Dto;
using ProductOrderWebApi.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace server_app.Controllers
{
    [Route("api/seller")]
    [ApiController]
    public class SellerController : ControllerBase
    {
        private readonly ISellerService _sellerService;

        public SellerController(ISellerService sellerService)
        {
            _sellerService = sellerService;
        }

        [HttpGet("getproducts/{id}")]
        [Authorize(Policy = "SellerOnly")]
        public async Task<IActionResult> GetProducts(long Id)
        {
            try
            {
                return Ok(await _sellerService.GetProducts(Id));
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [HttpPost("addproduct")]
        [Authorize(Policy = "SellerOnly")]
        public async Task<IActionResult> AddProduct([FromForm] ProductDto product)
        {
            try
            {
                return Ok(await _sellerService.AddProduct(product));
            }
            catch(Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [HttpPut("updateproduct")]
        [Authorize(Policy = "SellerOnly")]
        public async Task<IActionResult> UpdateProduct([FromForm] ProductDto productDto)
        {
            try
            {
                return Ok(await _sellerService.UpdateProduct(productDto));
            }
            catch(Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [HttpDelete("deleteproduct/{id}")]
        [Authorize(Policy = "SellerOnly")]
        public async Task<IActionResult> DeleteProduct(long Id)
        {
            try
            {
                return Ok(await _sellerService.DeleteProduct(Id));
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [HttpGet("getneworders/{id}")]
        [Authorize(Policy = "SellerOnly")]
        public async Task<IActionResult> GetNewOrders(long Id)
        {
            try
            {
                return Ok(await _sellerService.GetNewOrders(Id));
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [HttpGet("getordershistory/{id}")]
        [Authorize(Policy = "SellerOnly")]
        public async Task<IActionResult> GetOrdersHistory(long Id)
        {
            try
            {
                return Ok(await _sellerService.GetOrderHistory(Id));
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }
    }
}
