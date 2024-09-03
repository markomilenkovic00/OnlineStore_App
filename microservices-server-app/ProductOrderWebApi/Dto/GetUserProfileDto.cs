using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Text.Json.Serialization;

namespace ProductOrderWebApi.Dto
{
    public class GetUserProfileDto
    {
        [JsonPropertyName("id")]
        public long Id { get; set; }
        [JsonPropertyName("username")]
        public string Username { get; set; }
        [JsonPropertyName("password")]

        public string Password { get; set; }
        [JsonPropertyName("email")]

        public string Email { get; set; }
        [JsonPropertyName("name")]

        public string Name { get; set; }
        [JsonPropertyName("surname")]

        public string Surname { get; set; }
        [JsonPropertyName("dateOfBirth")]

        public string DateOfBirth { get; set; }
        [JsonPropertyName("address")]

        public string Address { get; set; }
        [JsonPropertyName("picture")]

        public byte[] Picture { get; set; }
        [JsonPropertyName("verify")]

        public string Verify { get; set; }
    }
}
