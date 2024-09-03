using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ProductOrderWebApi.Models
{
    public class OrderedProduct
    {
        public long Id { get; set; }
        public long OrderId { get; set; }
        public Order Order { get; set; }
        public long ProductId { get; set; }
        public Product Product { get; set; }
        public int OrderedQuantity { get; set; }
    }
}
