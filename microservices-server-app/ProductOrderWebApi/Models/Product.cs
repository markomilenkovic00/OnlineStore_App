using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ProductOrderWebApi.Models
{
    public class Product
    {
        public long Id { get; set; }
        public string Name { get; set; }
        public float Price { get; set; } 
        public int Quantity { get; set; }
        public string Description { get; set; }
        public byte[] Picture { get; set; }
        public long UserId { get; set; }
        public List<OrderedProduct> OrderedProducts { get; set; }
    }
}
