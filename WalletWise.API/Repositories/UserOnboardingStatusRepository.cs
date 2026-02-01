using Microsoft.EntityFrameworkCore;
using System;
using WalletWise.API.Data;
using WalletWise.API.Models;

namespace WalletWise.API.Repositories
{
    public class UserOnboardingStatusRepository : IUserOnboardingStatusRepository
    {
        private readonly WalletWiseDbContext _context;

        public UserOnboardingStatusRepository(WalletWiseDbContext context)
        {
            _context = context;
        }

        public async Task<UserOnboardingStatus?> GetByUserIdAsync(int userId)
        {
            return await _context.UserOnboardingStatuses
                .FirstOrDefaultAsync(s => s.UserId == userId);
        }

        public async Task CreateAsync(UserOnboardingStatus status)
        {
            _context.UserOnboardingStatuses.Add(status);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(UserOnboardingStatus status)
        {
            _context.UserOnboardingStatuses.Update(status);
            await _context.SaveChangesAsync();
        }
        public async Task<bool> IsOnboardingCompleteAsync(int userId)
        {
            var status = await _context.UserOnboardingStatuses
                .FirstOrDefaultAsync(s => s.UserId == userId);

            return status != null && status.CompletedAt != null;
        }

    }
}
