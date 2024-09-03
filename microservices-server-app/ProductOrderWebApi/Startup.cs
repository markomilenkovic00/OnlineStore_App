using AutoMapper;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using ProductOrderWebApi.Infrastructure;
using ProductOrderWebApi.Interfaces;
using ProductOrderWebApi.Mapping;
using server_app.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Polly;
using System.Net.Http;
using Polly.Extensions.Http;

namespace ProductOrderWebApi
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }
        private readonly string _cors = "cors";

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddControllers();

            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo { Title = "ProductOrderWebApi", Version = "v1" });
                c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
                {
                    In = ParameterLocation.Header,
                    Description = "Please enter token",
                    Name = "Authorization",
                    Type = SecuritySchemeType.Http,
                    BearerFormat = "JWT",
                    Scheme = "bearer"
                });
                c.AddSecurityRequirement(new OpenApiSecurityRequirement
                {
                    {
                        new OpenApiSecurityScheme
                        {
                            Reference = new OpenApiReference
                            {
                                Type=ReferenceType.SecurityScheme,
                                Id="Bearer"
                            }
                        },
                        new string[]{}
                    }
                });
            });

            services.AddScoped<IAdminService, AdminService>();
            services.AddScoped<ISellerService, SellerService>();
            services.AddScoped<IBuyerService, BuyerService>();

            services.AddHttpClient<IAdminService, AdminService>(client =>
                client.BaseAddress = new Uri(Configuration["UserWebApiUrl"])
                ).AddPolicyHandler(GetRetryPolicy())
                .AddPolicyHandler(GetCircuitBreakerPolicy());
            services.AddHttpClient<ISellerService, SellerService>(client =>
                client.BaseAddress = new Uri(Configuration["UserWebApiUrl"])
                ).AddPolicyHandler(GetRetryPolicy())
                .AddPolicyHandler(GetCircuitBreakerPolicy());
            services.AddHttpClient<IBuyerService, BuyerService>(client =>
                client.BaseAddress = new Uri(Configuration["UserWebApiUrl"])
                ).AddPolicyHandler(GetRetryPolicy())
                .AddPolicyHandler(GetCircuitBreakerPolicy());

            services.AddDbContext<ProductOrderDbContext>(options => options.UseSqlServer(Configuration.GetConnectionString("AppDatabase")));

            var mapperConfig = new MapperConfiguration(mc =>
            {
                mc.AddProfile(new MappingProfile());
            });

            IMapper mapper = mapperConfig.CreateMapper();
            services.AddSingleton(mapper);

            services.AddAuthentication(opt => {
                opt.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                opt.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            })
           .AddJwtBearer(options =>
           {
               options.TokenValidationParameters = new TokenValidationParameters
               {
                   ValidateIssuer = true, //Validira izdavaoca tokena
                   ValidateAudience = false, //Kazemo da ne validira primaoce tokena
                   ValidateLifetime = true,//Validira trajanje tokena
                   ValidateIssuerSigningKey = true, //validira potpis token, ovo je jako vazno!
                   ValidIssuer = "http://localhost:2554", //odredjujemo koji server je validni izdavalac
                   IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(Configuration["SecretKey"]))//navodimo privatni kljuc kojim su potpisani nasi tokeni
               };
           });

            services.AddAuthorization(options =>
            {
                options.AddPolicy("AdminOnly", policy =>
                {
                    policy.RequireRole("admin");
                });
                options.AddPolicy("BuyerOnly", policy =>
                {
                    policy.RequireRole("kupac");
                });
                options.AddPolicy("SellerOnly", policy =>
                {
                    policy.RequireRole("prodavac");
                });
            });

            services.AddCors(options =>
            {
                options.AddPolicy(name: _cors, builder =>
                {
                    builder.WithOrigins("http://localhost:36670")
                    .AllowAnyHeader()
                    .AllowAnyMethod()
                    .AllowCredentials();
                });
                options.AddPolicy(name: _cors, builder =>
                {
                    builder.WithOrigins("http://127.0.0.1:3500")
                    .AllowAnyHeader()
                    .AllowAnyMethod()
                    .AllowCredentials();
                });
                options.AddPolicy(name: _cors, builder =>
                {
                    builder.WithOrigins("http://localhost:2554")
                    .AllowAnyHeader()
                    .AllowAnyMethod()
                    .AllowCredentials();
                });
            });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                app.UseSwagger();
                app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "ProductOrderWebApi v1"));
            }

            app.UseCors(_cors);

            app.UseRouting();

            app.UseAuthentication();

            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }

        private static IAsyncPolicy<HttpResponseMessage> GetRetryPolicy()
        {
            return HttpPolicyExtensions.HandleTransientHttpError()
                .WaitAndRetryAsync(5,
                    retryAttempt => TimeSpan.FromMilliseconds(Math.Pow(2, retryAttempt) * 1000),
                    (_, waitingTime) =>
                    {
                        Console.WriteLine("Retrying.....");
                    });
        }

        private static IAsyncPolicy<HttpResponseMessage> GetCircuitBreakerPolicy()
        {
            return HttpPolicyExtensions
                .HandleTransientHttpError()
                .CircuitBreakerAsync(3, TimeSpan.FromSeconds(10));
        }
    }
}
