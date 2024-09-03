using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ProductOrderWebApi.Dto
{
    public class GetProductDto
    {
        public long Id { get; set; }
        public string Name { get; set; }
        public float Price { get; set; }
        public int Quantity { get; set; }
        public byte[] Picture { get; set; }
        public string Description { get; set; }
        public string UserId { get; set; }
        public UserInfoDto Seller { get; set; }
        public int OrderedQuantity { get; set; }
    }
}
