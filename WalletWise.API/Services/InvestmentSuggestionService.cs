using WalletWise.API.DTOs;

namespace WalletWise.API.Services
{
    public class InvestmentSuggestionService : IInvestmentSuggestionService
    {
        public InvestmentSuggestionDto GetInvestmentSuggestion(decimal remainingIncome)
        {
            decimal suggestedSip = 0;
            decimal? suggestedLumpsum = null;
            string investmentProfile;
            string recommendation;

            if (remainingIncome < 2000)
            {
                investmentProfile = "Conservative";
                recommendation =
                    "Your remaining income is low. Focus on building an emergency fund before investing.";
            }
            else if (remainingIncome < 8000)
            {
                investmentProfile = "Conservative";
                suggestedSip = remainingIncome * 0.35m;
                recommendation =
                    "Consider starting a small SIP to build discipline while prioritizing an emergency fund.";
            }
            else if (remainingIncome < 20000)
            {
                investmentProfile = "Moderate";
                suggestedSip = remainingIncome * 0.55m;
                recommendation =
                    "You have a healthy surplus. A balanced SIP strategy is recommended.";
            }
            else
            {
                investmentProfile = "Aggressive";
                suggestedSip = remainingIncome * 0.70m;
                suggestedLumpsum = remainingIncome * 0.15m;
                recommendation =
                    "Excellent surplus! You can invest aggressively with SIPs and some lump-sum exposure.";
            }

            return new InvestmentSuggestionDto
            {
                RemainingIncome = remainingIncome,
                SuggestedSip = Math.Round(suggestedSip, 2),
                SuggestedLumpsum = suggestedLumpsum.HasValue
                    ? Math.Round(suggestedLumpsum.Value, 2)
                    : null,
                InvestmentProfile = investmentProfile,
                Recommendation = recommendation
            };
        }
    }
}
