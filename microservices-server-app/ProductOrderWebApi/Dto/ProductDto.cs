using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ProductOrderWebApi.Dto
{
    public class ProductDto
    {
        public long Id { get; set; }
        public string Name { get; set; }
        public float Price { get; set; }
        public int Quantity { get; set; }
        public string Description { get; set; }
        public IFormFile PictureFromForm { get; set; }
        public long UserId { get; set; }
    }
}
