using WalletWise.API.Models;

namespace WalletWise.API.DTOs
{
    /// <summary>
    /// FINAL response sent to frontend after onboarding
    /// Contains remaining income + investment suggestions
    /// </summary>
    public class InvestmentSuggestionResponseDto
    {
        public decimal RemainingIncome { get; set; }

        // Enum for backend logic
        public InvestmentType InvestmentType { get; set; }

        // Friendly name for UI (SIP, Equity, FD, etc.)
        public string InvestmentTypeName { get; set; } = string.Empty;

        // Suggested investment options
        public List<InvestmentOptionDto> InvestmentOptions { get; set; } = new();

        // Risk & benefit explanation
        public RiskBenefitDto RiskBenefit { get; set; } = new();
    }

    /// <summary>
    /// Represents ONE investment option shown to user
    /// (FD / SIP / Equity / Lumpsum)
    /// </summary>
    //public class InvestmentOptionDto
    //{
    //    // Equity / Market related
    //    public string? Symbol { get; set; }

    //    // Name of fund / bank / company
    //    public string Name { get; set; } = string.Empty;

    //    // Equity price (null for SIP/FD)
    //    public decimal? Price { get; set; }

    //    // Budget boundaries
    //    public decimal MinInvestment { get; set; }
    //    public decimal MaxInvestment { get; set; }

    //    // Optional description
    //    public string? Description { get; set; }

    //    // Expected annual return (%)
    //    public decimal? ExpectedReturn { get; set; }

    //    // Category: Equity / SIP / FD / Lumpsum
    //    public string Category { get; set; } = string.Empty;

    //    // Risk level for UI badges
    //    public string RiskLevel { get; set; } = string.Empty;
    //}

    /// <summary>
    /// Explains risks & benefits for selected investment type
    /// </summary>
    public class RiskBenefitDto
    {
        public List<string> Risks { get; set; } = new();
        public List<string> Benefits { get; set; } = new();

        // Low / Medium / High
        public string RiskLevel { get; set; } = string.Empty;
    }
}
