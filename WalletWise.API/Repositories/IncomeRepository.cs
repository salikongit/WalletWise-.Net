using Microsoft.EntityFrameworkCore;
using WalletWise.API.Data;
using WalletWise.API.Models;

namespace WalletWise.API.Repositories
{
    public class IncomeRepository : IIncomeRepository
    {
        private readonly WalletWiseDbContext _context;

        public IncomeRepository(WalletWiseDbContext context)
        {
            _context = context;
        }

        public async Task<Income> CreateAsync(Income income)
        {
            _context.Incomes.Add(income);
            await _context.SaveChangesAsync();
            return income;
        }

        public async Task<Income?> GetByIdAsync(int incomeId)
        {
            return await _context.Incomes.FindAsync(incomeId);
        }

        public async Task<List<Income>> GetByUserIdAsync(int userId, DateTime? startDate = null, DateTime? endDate = null)
        {
            var query = _context.Incomes.Where(i => i.UserId == userId);

            if (startDate.HasValue)
                query = query.Where(i => i.IncomeDate >= startDate.Value);

            if (endDate.HasValue)
                query = query.Where(i => i.IncomeDate <= endDate.Value);

            return await query.OrderByDescending(i => i.IncomeDate).ToListAsync();
        }

        public async Task<Income> UpdateAsync(Income income)
        {
            _context.Incomes.Update(income);
            await _context.SaveChangesAsync();
            return income;
        }

        public async Task<bool> DeleteAsync(int incomeId)
        {
            var income = await _context.Incomes.FindAsync(incomeId);
            if (income == null) return false;

            _context.Incomes.Remove(income);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<decimal> GetTotalIncomeByUserIdAsync(int userId, DateTime? startDate = null, DateTime? endDate = null)
        {
            var query = _context.Incomes.Where(i => i.UserId == userId);

            if (startDate.HasValue)
                query = query.Where(i => i.IncomeDate >= startDate.Value);

            if (endDate.HasValue)
                query = query.Where(i => i.IncomeDate <= endDate.Value);

            return await query.SumAsync(i => i.Amount);
        }
    }
}




