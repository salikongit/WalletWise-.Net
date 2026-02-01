namespace WalletWise.API.DTOs
{
    public class OnboardingResponseDto
    {
        public bool Success { get; set; }
        public string Message { get; set; } = string.Empty;
        public InvestmentSuggestionDto? InvestmentSuggestion { get; set; }
        public decimal RemainingIncome { get; set; }
        public List<InvestmentOptionDto> InvestmentOptions { get; set; } = new();
        public RiskBenefitDto RiskBenefit { get; set; } = new();
        public bool IsOnboardingComplete { get; set; } = true;
    }



}


