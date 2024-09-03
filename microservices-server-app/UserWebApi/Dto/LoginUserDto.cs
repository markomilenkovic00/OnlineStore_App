using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace UserWebApi.Dto
{
    public class LoginUserDto
    {
        public long Id { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
    }
}
