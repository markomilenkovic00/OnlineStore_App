using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ProductOrderWebApi.Models
{
    public class Order
    {
        public long Id { get; set; }
        public string Comment { get; set; }
        public string Address { get; set; }
        public float ProductsPrice { get; set; }
        public float DeliveryPrice { get; set; }
        public float TotalPrice { get; set; }
        public DateTime OrderPlacedOn { get; set; }
        public int DeliveryTime { get; set; }
        public DateTime DeliveryDateTime { get; set; }
        public bool Canceled { get; set; }
        public long BuyerId { get; set; }
        public List<OrderedProduct> OrderedProducts { get; set; }
    }
}
