using Microsoft.EntityFrameworkCore;
using WalletWise.API.Data;
using WalletWise.API.Models;

namespace WalletWise.API.Repositories
{
    public class InvestmentRepository : IInvestmentRepository
    {

        private readonly WalletWiseDbContext _context;

        public InvestmentRepository(WalletWiseDbContext context)
        {
            _context = context;
        }

        public async Task<Investment> CreateAsync(Investment investment)
        {
            _context.Investments.Add(investment);
            await _context.SaveChangesAsync();
            return investment;
        }

        public async Task<List<Investment>> GetByUserIdAsync(int userId)
        {
            return await _context.Investments
                .Where(i => i.UserId == userId)
                .ToListAsync();
        }

        public async Task<Investment?> GetByIdAsync(int id)
        {
            return await _context.Investments
                .FirstOrDefaultAsync(i => i.InvestmentId == id);
        }

        public async Task<Investment> UpdateAsync(Investment investment)
        {
            _context.Investments.Update(investment);
            await _context.SaveChangesAsync();
            return investment;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var investment = await _context.Investments.FindAsync(id);
            if (investment == null)
                return false;

            _context.Investments.Remove(investment);
            await _context.SaveChangesAsync();
            return true;
        }

        //  REQUIRED FOR ADMIN DASHBOARD
        public async Task<List<Investment>> GetAllInvestmentsAsync()
        {
            return await _context.Investments.ToListAsync();
        }

    }
}
