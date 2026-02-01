using WalletWise.API.Models;

namespace WalletWise.API.Repositories
{
    public interface ILoanRepository
    {
        Task<Loan> CreateAsync(Loan loan);
        Task<Loan?> GetByIdAsync(int loanId);
        Task<List<Loan>> GetByUserIdAsync(int userId);
        Task<Loan> UpdateAsync(Loan loan);
        Task<bool> DeleteAsync(int loanId);
        Task<List<Loan>> GetAllLoansAsync();
    }
}




