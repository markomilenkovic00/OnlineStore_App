using Microsoft.EntityFrameworkCore;
using ProductOrderWebApi.Infrastructure;
using ProductOrderWebApi.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace server_app.Repositories
{
    public class OrderedProductsRepository
    {
        private readonly ProductOrderDbContext _dbContext;
        public OrderedProductsRepository(ProductOrderDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<List<OrderedProduct>> GetAllOrderedProducts()
        {
            return await _dbContext.OrderedProducts.ToListAsync();
        }

        public async Task AddOrderedProduct(OrderedProduct op)
        {
           await _dbContext.OrderedProducts.AddAsync(op);
        }
    }
}
