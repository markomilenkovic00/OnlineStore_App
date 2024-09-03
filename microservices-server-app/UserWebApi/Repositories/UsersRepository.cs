using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using UserWebApi.Infrastructure;
using UserWebApi.Models;

namespace UserWebApi.Repositories
{
    public class UsersRepository
    {
        private readonly UserDbContext _dbContext;
        public UsersRepository(UserDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task AddUserAsync(User u)
        {
            await _dbContext.Users.AddAsync(u);
        }

        public async Task<User> GetUserByIdAsync(long id)
        {
            return await _dbContext.Users.FindAsync(id);
        }

        public async Task<List<User>> GetAllUsersAsync()
        {
            return await _dbContext.Users.ToListAsync();
        }

        public async Task SaveChangesAsync()
        {
            await _dbContext.SaveChangesAsync();
        }
    }
}
