using AutoMapper;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using UserWebApi.Dto;
using UserWebApi.Infrastructure;
using UserWebApi.Interfaces;
using UserWebApi.Models;
using UserWebApi.Repositories;

namespace UserWebApi.Services
{
    public class UserProfileService : IUserProfileService
    {
        private readonly IMapper _mapper;
        private readonly UsersRepository _usersRepository;
        private string emailPattern = @"^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$";

        public UserProfileService(IMapper mapper, UserDbContext dbContext)
        {
            _mapper = mapper;
            _usersRepository = new UsersRepository(dbContext);
        }
        public async Task<GetUserProfileDto> GetUserProfile(long Id)
        {
            User u = await _usersRepository.GetUserByIdAsync(Id);
            if (u == null)
                throw new Exception("Error. User does not exist in database.");

            return _mapper.Map<GetUserProfileDto>(u);
        }

        public async Task<GetUserProfileDto> UpdateUserProfile(UpdateUserProfileDto userProfileDto)
        {
            User u = await _usersRepository.GetUserByIdAsync(userProfileDto.Id);
            if (u == null)
                throw new Exception("Error. The user does not exist in database.");
            if (string.IsNullOrEmpty(userProfileDto.Address) || (string.IsNullOrEmpty(userProfileDto.CurrentPassword) && u.Password != "") || string.IsNullOrEmpty(userProfileDto.DateOfBirth) || string.IsNullOrEmpty(userProfileDto.Email) || string.IsNullOrEmpty(userProfileDto.Name) || string.IsNullOrEmpty(userProfileDto.Surname) || string.IsNullOrEmpty(userProfileDto.Surname))
                throw new Exception("Error. Inputs for updating profile cannot be empty.");

            if (!DateTime.TryParseExact(u.DateOfBirth, "yyyy-MM-dd", CultureInfo.InvariantCulture, DateTimeStyles.None, out _))
                throw new Exception("Error. Date format is not valid.");

            if (!Regex.IsMatch(u.Email, emailPattern))
                throw new Exception("Error. Email format is not valid.");

            if (u.Password != "")
                if (!BCrypt.Net.BCrypt.Verify(userProfileDto.CurrentPassword, u.Password))
                    throw new Exception("Error. Wrong password.");

            List<User> userUniqueTest = await _usersRepository.GetAllUsersAsync();
             userUniqueTest = userUniqueTest.Where(o => o.Id != u.Id && (o.Email == u.Email || o.Username == u.Username)).ToList();
            if (userUniqueTest.Count > 0)
                throw new Exception("Error. User with entered email/username already exists in database.");

            u.Name = userProfileDto.Name;
            u.Surname = userProfileDto.Surname;
            u.Address = userProfileDto.Address;
            u.DateOfBirth = userProfileDto.DateOfBirth;
            u.Email = userProfileDto.Email;
            u.Username = userProfileDto.Username;
            if (userProfileDto.Password != null)
                u.Password = BCrypt.Net.BCrypt.HashPassword(userProfileDto.Password, 10);
            if (userProfileDto.PictureFromForm != null)
            {
                using (var memoryStream = new MemoryStream())
                {
                    await userProfileDto.PictureFromForm.CopyToAsync(memoryStream);
                    u.Picture = memoryStream.ToArray();
                }
            }
            await _usersRepository.SaveChangesAsync();
            return _mapper.Map<GetUserProfileDto>(u);
        }
    }
}
