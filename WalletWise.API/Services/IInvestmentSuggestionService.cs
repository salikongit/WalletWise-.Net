using WalletWise.API.DTOs;

namespace WalletWise.API.Services
{
    public interface IInvestmentSuggestionService
    {
        InvestmentSuggestionDto GetInvestmentSuggestion(decimal remainingIncome);
    }
}
