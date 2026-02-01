using WalletWise.API.Models;

namespace WalletWise.API.Repositories
{
    public interface IIncomeRepository
    {
        Task<Income> CreateAsync(Income income);
        Task<Income?> GetByIdAsync(int incomeId);
        Task<List<Income>> GetByUserIdAsync(int userId, DateTime? startDate = null, DateTime? endDate = null);
        Task<Income> UpdateAsync(Income income);
        Task<bool> DeleteAsync(int incomeId);
        Task<decimal> GetTotalIncomeByUserIdAsync(int userId, DateTime? startDate = null, DateTime? endDate = null);
    }
}




