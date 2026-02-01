using WalletWise.API.Models;

namespace WalletWise.API.Repositories
{
    public interface IFinancialProfileRepository
    {
        Task<FinancialProfile?> GetByUserIdAsync(int userId);
        Task<FinancialProfile> CreateOrUpdateAsync(FinancialProfile profile);
    }
}




