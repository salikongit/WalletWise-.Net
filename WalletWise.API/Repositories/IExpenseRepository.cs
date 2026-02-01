using WalletWise.API.Models;

namespace WalletWise.API.Repositories
{
    public interface IExpenseRepository
    {
        Task<Expense> CreateAsync(Expense expense);
        Task<Expense?> GetByIdAsync(int expenseId);
        Task<List<Expense>> GetByUserIdAsync(int userId, DateTime? startDate = null, DateTime? endDate = null);
        Task<Expense> UpdateAsync(Expense expense);
        Task<bool> DeleteAsync(int expenseId);
        Task<decimal> GetTotalExpenseByUserIdAsync(int userId, DateTime? startDate = null, DateTime? endDate = null);
    }
}




