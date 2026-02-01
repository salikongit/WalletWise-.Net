using Microsoft.EntityFrameworkCore;
using WalletWise.API.Data;
using WalletWise.API.Models;

namespace WalletWise.API.Repositories
{
    public class ExpenseRepository : IExpenseRepository
    {
        private readonly WalletWiseDbContext _context;

        public ExpenseRepository(WalletWiseDbContext context)
        {
            _context = context;
        }

        public async Task<Expense> CreateAsync(Expense expense)
        {
            _context.Expenses.Add(expense);
            await _context.SaveChangesAsync();
            return expense;
        }

        public async Task<Expense?> GetByIdAsync(int expenseId)
        {
            return await _context.Expenses.FindAsync(expenseId);
        }

        public async Task<List<Expense>> GetByUserIdAsync(int userId, DateTime? startDate = null, DateTime? endDate = null)
        {
            var query = _context.Expenses.Where(e => e.UserId == userId);

            if (startDate.HasValue)
                query = query.Where(e => e.ExpenseDate >= startDate.Value);

            if (endDate.HasValue)
                query = query.Where(e => e.ExpenseDate <= endDate.Value);

            return await query.OrderByDescending(e => e.ExpenseDate).ToListAsync();
        }

        public async Task<Expense> UpdateAsync(Expense expense)
        {
            _context.Expenses.Update(expense);
            await _context.SaveChangesAsync();
            return expense;
        }

        public async Task<bool> DeleteAsync(int expenseId)
        {
            var expense = await _context.Expenses.FindAsync(expenseId);
            if (expense == null) return false;

            _context.Expenses.Remove(expense);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<decimal> GetTotalExpenseByUserIdAsync(int userId, DateTime? startDate = null, DateTime? endDate = null)
        {
            var query = _context.Expenses.Where(e => e.UserId == userId);

            if (startDate.HasValue)
                query = query.Where(e => e.ExpenseDate >= startDate.Value);

            if (endDate.HasValue)
                query = query.Where(e => e.ExpenseDate <= endDate.Value);

            return await query.SumAsync(e => e.Amount);
        }
    }
}




