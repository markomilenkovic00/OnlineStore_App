using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace UserWebApi.Dto
{
    public class GoogleLoginUserDto
    {
        public long Id { get; set; }
        public string Email { get; set; }
        public string Token { get; set; }
    }
}
