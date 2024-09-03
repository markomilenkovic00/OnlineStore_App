using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace UserWebApi.Models
{
    public class User
    {
        public long Id { get; set; }
        public string Username { get; set; }
        public string Password { get; set; }
        public string Email { get; set; }
        public string Name { get; set; }
        public string Surname { get; set; }
        public string DateOfBirth { get; set; }
        public string Address { get; set; }
        public bool? Verify { get; set; }
        public string UserType { get; set; }
        public byte[] Picture { get; set; }
    }
}
