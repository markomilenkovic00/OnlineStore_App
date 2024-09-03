using AutoMapper;
using ProductOrderWebApi.Dto;
using ProductOrderWebApi.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ProductOrderWebApi.Mapping
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<Product, ProductDto>().ReverseMap();
            CreateMap<Product, GetProductDto>().ReverseMap();
            CreateMap<Order, CreateOrderDto>().ReverseMap();
            CreateMap<Order, GetOrderDto>().ReverseMap();
            CreateMap<ProductDto, GetProductDto>().ReverseMap();
            CreateMap<UserInfoDto, GetUserProfileDto>().ReverseMap();
        }
    }
}
