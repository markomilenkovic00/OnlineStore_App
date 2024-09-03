using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ProductOrderWebApi.Dto
{
    public class GetOrderDto
    {
        public long Id { get; set; }
        public List<GetProductDto> ProductList { get; set; }
        public string Comment { get; set; }
        public string Address { get; set; }
        public float ProductsPrice { get; set; }
        public float DeliveryPrice { get; set; }
        public float TotalPrice { get; set; }
        public long BuyerId { get; set; }
        public UserInfoDto Buyer { get; set; }
        public DateTime OrderPlacedOn { get; set; }
        public int DeliveryTime { get; set; }
        public DateTime DeliveryDateTime { get; set; }
        public bool Canceled { get; set; }

    }
}
