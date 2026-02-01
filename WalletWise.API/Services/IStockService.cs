using WalletWise.API.DTOs;
using WalletWise.API.Models;

namespace WalletWise.API.Services
{
    public interface IStockService
    {
        //Task<List<InvestmentOptionDto>> GetInvestmentSuggestionsAsync(InvestmentType investmentType, decimal maxBudget);
        //Task<RiskBenefitDto> GetRiskBenefitAsync(InvestmentType investmentType);
        //Task<List<InvestmentOptionDto>> GetRealTimeInvestmentDataAsync(InvestmentType? investmentType = null, string? searchTerm = null);
        Task<List<InvestmentOptionDto>> GetInvestmentSuggestionsAsync(
            InvestmentType investmentType,
            decimal maxBudget);

        Task<RiskBenefitDto> GetRiskBenefitAsync(
            InvestmentType investmentType);

        Task<List<InvestmentOptionDto>> GetRealTimeInvestmentDataAsync(
            InvestmentType? investmentType = null,
            string? searchTerm = null);
    }
}


