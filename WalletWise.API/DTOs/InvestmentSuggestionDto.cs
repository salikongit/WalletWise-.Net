namespace WalletWise.API.DTOs
{
    public class InvestmentSuggestionDto
    {
        public decimal RemainingIncome { get; set; }

        public decimal? SuggestedSip { get; set; }

        public decimal? SuggestedLumpsum { get; set; }

        public string InvestmentProfile { get; set; } = string.Empty;

        public string Recommendation { get; set; } = string.Empty;
    }
}
