using AutoMapper;
using Google.Apis.Auth;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.IdentityModel.Tokens.Jwt;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Mail;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using UserWebApi.Dto;
using UserWebApi.Infrastructure;
using UserWebApi.Interfaces;
using UserWebApi.Models;
using UserWebApi.Repositories;

namespace UserWebApi.Services
{
    public class AuthService : IAuthService
    {
        private readonly IMapper _mapper;
        private readonly UsersRepository _usersRepository;

        private readonly IConfigurationSection _secretKey, _googleID;
        private string emailPattern = @"^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$";
        public AuthService(IMapper mapper, UserDbContext dbContext, IConfiguration config)
        {
            _mapper = mapper;
            _usersRepository = new UsersRepository(dbContext);
            _secretKey = config.GetSection("SecretKey");
            _googleID = config.GetSection("GoogleClientID");
        }
        public async Task<RegisterUserDto> RegisterUser(RegisterUserDto newUser)
        {
            User user = _mapper.Map<User>(newUser);

            if (string.IsNullOrEmpty(user.Name) || string.IsNullOrEmpty(user.Surname) || string.IsNullOrEmpty(user.Password) || newUser.PictureFromForm == null || string.IsNullOrEmpty(user.Username) || string.IsNullOrEmpty(user.UserType) || string.IsNullOrEmpty(user.Address) || string.IsNullOrEmpty(user.DateOfBirth) || string.IsNullOrEmpty(user.Email))
                throw new Exception("Error. Registration inputs cannot be empty.");

            if (!DateTime.TryParseExact(user.DateOfBirth, "yyyy-MM-dd", CultureInfo.InvariantCulture, DateTimeStyles.None, out _))
                throw new Exception("Error. Date format is not valid.");

            if (!Regex.IsMatch(user.Email, emailPattern))
                throw new Exception("Error. Email format is not valid.");

            await CheckIfUnique(user);

            user.Password = BCrypt.Net.BCrypt.HashPassword(user.Password, 10);
            using (var memoryStream = new MemoryStream())
            {
                await newUser.PictureFromForm.CopyToAsync(memoryStream);
                user.Picture = memoryStream.ToArray();
            }
            if (newUser.UserType == "kupac")
            {
                user.Verify = null;
            }
            else if (newUser.UserType == "prodavac")
            {
                user.Verify = false;
                SendEmail(user.Email, "Your account verification is pending.");
            }
            else
            {
                throw new Exception("Error. You can register either as a seller or as a buyer.");
            }

            await _usersRepository.AddUserAsync(user);
            await _usersRepository.SaveChangesAsync();

            return _mapper.Map<RegisterUserDto>(newUser);
        }

        public async Task<string> LoginUser(LoginUserDto loginUserDto)
        {
            List<User> users = await _usersRepository.GetAllUsersAsync();
            User u = users.Where(o => o.Email == loginUserDto.Email).FirstOrDefault();
            if (u == null)
                throw new Exception("Error. Entered email does not exist in database.");

            if (!BCrypt.Net.BCrypt.Verify(loginUserDto.Password, u.Password))
                throw new Exception("Error. Wrong password.");

            List<Claim> claims = new List<Claim>();
            if (u.UserType == "kupac")
            {
                claims.Add(new Claim(ClaimTypes.Role, "kupac"));
            }
            else if (u.UserType == "prodavac")
            {
                claims.Add(new Claim(ClaimTypes.Role, "prodavac"));
            }
            else if (u.UserType == "admin")
            {
                claims.Add(new Claim(ClaimTypes.Role, "admin"));
            }
            claims.Add(new Claim("userid", u.Id.ToString()));
            claims.Add(new Claim("verify", u.Verify.ToString()));
            claims.Add(new Claim("name", u.Name + " " + u.Surname));

            SymmetricSecurityKey secretKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_secretKey.Value));
            var signinCredentials = new SigningCredentials(secretKey, SecurityAlgorithms.HmacSha256);
            var tokenOptions = new JwtSecurityToken(
                issuer: "http://localhost:2554",
                claims: claims,
                expires: DateTime.Now.AddMinutes(20),
                signingCredentials: signinCredentials
            );
            string tokenString = new JwtSecurityTokenHandler().WriteToken(tokenOptions);
            return tokenString;
        }

        public async Task CheckIfUnique(User newUser)
        {
            foreach (User u in await _usersRepository.GetAllUsersAsync())
            {
                if (u.Username == newUser.Username)
                {
                    throw new Exception("Error. Entered username already exists in database.");
                }
                else if (u.Email == newUser.Email)
                {
                    throw new Exception("Error. Entered email already exists in database.");
                }
            }
        }
        public void SendEmail(string ToEmail, string EmailBody)
        {
            SmtpClient smtpClient = new SmtpClient("smtp.gmail.com", 587);
            smtpClient.EnableSsl = true;
            smtpClient.Credentials = new NetworkCredential("webprogramiranje2projekat@gmail.com", "byltqtvyyvvqddsr");
            MailMessage mailMessage = new MailMessage();
            mailMessage.From = new MailAddress("webprogramiranje2projekat@gmail.com");
            mailMessage.To.Add(ToEmail);
            mailMessage.Subject = "Verification Info";
            mailMessage.Body = EmailBody;

            smtpClient.Send(mailMessage);
            //asinhrona ?? 
        }

        public async Task<RegisterUserDto> RegisterUserViaGoogle(GoogleRegisterUserDto newUser)
        {
            GoogleJsonWebSignature.ValidationSettings validationSettings = new GoogleJsonWebSignature.ValidationSettings();
            validationSettings.Audience = new List<string>() { _googleID.Value };

            GoogleJsonWebSignature.Payload payload = Task.Run(() => GoogleJsonWebSignature.ValidateAsync(newUser.Token, validationSettings)).GetAwaiter().GetResult();

            User user = _mapper.Map<User>(newUser);

            if (string.IsNullOrEmpty(user.Name) || string.IsNullOrEmpty(user.Surname) || string.IsNullOrEmpty(user.Username) || string.IsNullOrEmpty(user.Address) || string.IsNullOrEmpty(user.DateOfBirth) || string.IsNullOrEmpty(user.Email))
                throw new Exception("Error. Registration inputs cannot be empty.");

            if (!DateTime.TryParseExact(user.DateOfBirth, "yyyy-MM-dd", CultureInfo.InvariantCulture, DateTimeStyles.None, out _))
                throw new Exception("Error. Date format is not valid.");

            if (!Regex.IsMatch(user.Email, emailPattern))
                throw new Exception("Error. Email format is not valid.");

            await CheckIfUnique(user);

            user.Password = "";

            using (var webClient = new WebClient())
            {
                byte[] data = await webClient.DownloadDataTaskAsync(newUser.GoogleImageURL);
                user.Picture = data;
            }

            user.UserType = "kupac";
            user.Verify = null;

            await _usersRepository.AddUserAsync(user);
            await _usersRepository.SaveChangesAsync();
            return _mapper.Map<RegisterUserDto>(user);
        }

        public async Task<string> LoginUserViaGoogle(GoogleLoginUserDto googleLoginUserDto)
        {
            GoogleJsonWebSignature.ValidationSettings validationSettings = new GoogleJsonWebSignature.ValidationSettings();
            validationSettings.Audience = new List<string>() { _googleID.Value };

            GoogleJsonWebSignature.Payload payload = Task.Run(() => GoogleJsonWebSignature.ValidateAsync(googleLoginUserDto.Token, validationSettings)).GetAwaiter().GetResult();

            List<User> users = await _usersRepository.GetAllUsersAsync();
            User u = users.Where(o => o.Email == googleLoginUserDto.Email).FirstOrDefault();
            if (u == null)
                throw new Exception("Error. Entered email does not exist in database.");

            if (u.Password != "")
                throw new Exception("Error. Without account, you cannot log in via Google.");

            List<Claim> claims = new List<Claim>();
            claims.Add(new Claim(ClaimTypes.Role, "kupac"));
            claims.Add(new Claim("userid", u.Id.ToString()));
            claims.Add(new Claim("verify", u.Verify.ToString()));
            claims.Add(new Claim("name", u.Name + " " + u.Surname));

            SymmetricSecurityKey secretKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_secretKey.Value));
            var signinCredentials = new SigningCredentials(secretKey, SecurityAlgorithms.HmacSha256);
            var tokenOptions = new JwtSecurityToken(
                issuer: "http://localhost:2554",
                claims: claims,
                expires: DateTime.Now.AddMinutes(20),
                signingCredentials: signinCredentials
            );
            string tokenString = new JwtSecurityTokenHandler().WriteToken(tokenOptions);
            return tokenString;
        }
    }
}
