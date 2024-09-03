using AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using UserWebApi.Dto;
using UserWebApi.Models;

namespace UserWebApi.Mapping
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<User, RegisterUserDto>().ReverseMap();
            CreateMap<User, LoginUserDto>().ReverseMap();
            CreateMap<User, GetUserProfileDto>().ReverseMap();
            CreateMap<User, UpdateUserProfileDto>().ReverseMap();
            CreateMap<User, GoogleRegisterUserDto>().ReverseMap();
        }
    }
}
