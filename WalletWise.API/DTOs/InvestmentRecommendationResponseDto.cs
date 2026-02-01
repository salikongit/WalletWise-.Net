using WalletWise.API.DTOs;

namespace WalletWise.API.DTOs
{
    public class InvestmentRecommendationResponseDto
    {
        public decimal AvailableForInvestment { get; set; }
        public decimal TotalMonthlyEmi { get; set; }

        public InvestmentSuggestionDto Suggestion { get; set; } = null!;
        public List<InvestmentOptionDto> Products { get; set; } = new();
    }
}
