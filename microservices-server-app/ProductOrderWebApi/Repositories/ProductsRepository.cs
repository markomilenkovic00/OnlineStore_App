using Microsoft.EntityFrameworkCore;
using ProductOrderWebApi.Infrastructure;
using ProductOrderWebApi.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace server_app.Repositories
{
    public class ProductsRepository
    {
        private readonly ProductOrderDbContext _dbContext;
        public ProductsRepository(ProductOrderDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task AddProduct(Product p)
        {
            await _dbContext.Products.AddAsync(p);
        }

        public async Task<Product> GetProductById(long id)
        {
            return await _dbContext.Products.FindAsync(id);
        }

        public async Task<List<Product>> GetAllProducts()
        {
            return await _dbContext.Products.ToListAsync();
        }

        public async Task SaveChangesASync()
        {
            await _dbContext.SaveChangesAsync();
        }

        public async Task UpdateProduct(Product p)
        {
            _dbContext.Update(p);
            await _dbContext.SaveChangesAsync();
        }

        public async Task DeleteProduct(Product p)
        {
             _dbContext.Remove(p);
            await _dbContext.SaveChangesAsync();
        }
    }
}
