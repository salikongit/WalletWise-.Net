using Microsoft.EntityFrameworkCore;
using WalletWise.API.Data;
using WalletWise.API.Models;

namespace WalletWise.API.Repositories
{
    public class FinancialProfileRepository : IFinancialProfileRepository
    {
        private readonly WalletWiseDbContext _context;

        public FinancialProfileRepository(WalletWiseDbContext context)
        {
            _context = context;
        }

        public async Task<FinancialProfile?> GetByUserIdAsync(int userId)
        {
            return await _context.FinancialProfiles
                .FirstOrDefaultAsync(fp => fp.UserId == userId);
        }

        public async Task<FinancialProfile> CreateOrUpdateAsync(FinancialProfile profile)
        {
            var existing = await _context.FinancialProfiles
                .FirstOrDefaultAsync(fp => fp.UserId == profile.UserId);

            if (existing != null)
            {
                existing.TotalIncome = profile.TotalIncome;
                existing.TotalExpenses = profile.TotalExpenses;
                existing.TotalSavings = profile.TotalSavings;
                existing.TotalInvestments = profile.TotalInvestments;
                existing.TotalLoans = profile.TotalLoans;
                existing.LastUpdated = DateTime.UtcNow;
                _context.FinancialProfiles.Update(existing);
                await _context.SaveChangesAsync();
                return existing;
            }
            else
            {
                _context.FinancialProfiles.Add(profile);
                await _context.SaveChangesAsync();
                return profile;
            }
        }
    }
}




