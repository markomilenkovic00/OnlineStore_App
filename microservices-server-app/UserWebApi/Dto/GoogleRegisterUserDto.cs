using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace UserWebApi.Dto
{
    public class GoogleRegisterUserDto
    {
        public long Id { get; set; }
        public string Username { get; set; }
        public string Password { get; set; }
        public string Token { get; set; }
        public string Email { get; set; }
        public string Name { get; set; }
        public string Surname { get; set; }
        public string DateOfBirth { get; set; }
        public string UserType { get; set; }
        public string Address { get; set; }
        public IFormFile PictureFromForm { get; set; }
        public string GoogleImageURL { get; set; }
    }
}
