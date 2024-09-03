using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ProductOrderWebApi.Dto
{
    public class CreateOrderDto
    {
        public List<ProductItem> ProductList { get; set; }
        public string Comment { get; set; }
        public string Address { get; set; }
        public float ProductsPrice { get; set; }
        public float DeliveryPrice { get; set; }
        public float TotalPrice { get; set; }
        public long BuyerId { get; set; }
    }

    public class ProductItem
    {
        public long ProductId { get; set; } 
        public int OrderedQuantity { get; set; }
    }
}
