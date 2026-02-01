using WalletWise.API.DTOs;

namespace WalletWise.API.Services
{
    public interface IRecommendationService
    {
        Task<InvestmentSuggestionResponseDto> GetRecommendationsAsync(int userId);
    }
}
