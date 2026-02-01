using WalletWise.API.DTOs;

namespace WalletWise.API.Services
{
    public interface ITransactionService
    {
        Task<IncomeDto> AddIncomeAsync(int userId, IncomeDto incomeDto);
        Task<ExpenseDto> AddExpenseAsync(int userId, ExpenseDto expenseDto);
        Task<List<IncomeDto>> GetIncomesAsync(int userId, DateTime? startDate = null, DateTime? endDate = null);
        Task<List<ExpenseDto>> GetExpensesAsync(int userId, DateTime? startDate = null, DateTime? endDate = null);
        Task<IncomeDto> UpdateIncomeAsync(int incomeId, int userId, IncomeDto incomeDto);
        Task<ExpenseDto> UpdateExpenseAsync(int expenseId, int userId, ExpenseDto expenseDto);
        Task<bool> DeleteIncomeAsync(int incomeId, int userId);
        Task<bool> DeleteExpenseAsync(int expenseId, int userId);
    }
}




