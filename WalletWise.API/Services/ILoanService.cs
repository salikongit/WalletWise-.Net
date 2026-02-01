using WalletWise.API.DTOs;

namespace WalletWise.API.Services
{
    public interface ILoanService
    {
        Task<LoanDto> CreateLoanAsync(int userId, LoanDto loanDto);
        Task<List<LoanDto>> GetUserLoansAsync(int userId);
        Task<LoanDto?> GetLoanByIdAsync(int loanId, int userId);
        Task<LoanDto> UpdateLoanAsync(int loanId, int userId, LoanDto loanDto);
        Task<bool> DeleteLoanAsync(int loanId, int userId);
        Task<EmiResponseDto> GetLoanAmortizationAsync(int loanId, int userId);
    }
}




