using WalletWise.API.DTOs;
using WalletWise.API.Models;

namespace WalletWise.API.Services
{
    public interface IInvestmentProductService
    {
        Task<List<InvestmentOptionDto>> GetProductsAsync(
            InvestmentType investmentType,
            decimal availableAmount);
    }
}
