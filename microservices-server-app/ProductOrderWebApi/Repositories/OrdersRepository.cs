using Microsoft.EntityFrameworkCore;
using ProductOrderWebApi.Infrastructure;
using ProductOrderWebApi.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace server_app.Repositories
{
    public class OrdersRepository
    {
        private readonly ProductOrderDbContext _dbContext;
        public OrdersRepository(ProductOrderDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<List<Order>> GetAllOrders()
        {
            return await _dbContext.Orders.ToListAsync();
        }

        public async Task<Order> GetOrderById(long id)
        {
            return await _dbContext.Orders.FindAsync(id);
        }

        public async Task UpdateOrder(Order o)
        {
            _dbContext.Update(o);
            await _dbContext.SaveChangesAsync();
        }

        public async Task SaveChangesAsync()
        {
            await _dbContext.SaveChangesAsync();
        }

        public async Task AddOrder(Order o)
        {
            await _dbContext.Orders.AddAsync(o);
        }
    }
}
