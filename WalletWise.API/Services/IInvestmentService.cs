using WalletWise.API.DTOs;

namespace WalletWise.API.Services
{
    public interface IInvestmentService
    {
        Task<InvestmentDto> CreateInvestmentAsync(int userId, InvestmentDto investmentDto);
        Task<List<InvestmentDto>> GetUserInvestmentsAsync(int userId);
        Task<InvestmentDto?> GetInvestmentByIdAsync(int investmentId, int userId);
        Task<InvestmentDto> UpdateInvestmentAsync(int investmentId, int userId, InvestmentDto investmentDto);
        Task<bool> DeleteInvestmentAsync(int investmentId, int userId);
    }
}
