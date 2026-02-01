using WalletWise.API.DTOs;
using WalletWise.API.Models;

public interface IInvestmentRepository
{
    Task<Investment> CreateAsync(Investment investment);
    Task<List<Investment>> GetByUserIdAsync(int userId);
    Task<Investment?> GetByIdAsync(int id);
    Task<Investment> UpdateAsync(Investment investment);
    Task<bool> DeleteAsync(int id);
    Task<List<Investment>> GetAllInvestmentsAsync();
}

