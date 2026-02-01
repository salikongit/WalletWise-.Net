
namespace WalletWise.API.DTOs
{
    public class InvestmentOptionDto
    {
        public string? Symbol { get; set; }          // Equity
        public string Name { get; set; } = string.Empty;

        public decimal? Price { get; set; }          // Equity
        public decimal MinInvestment { get; set; }
        public decimal MaxInvestment { get; set; }

        public decimal? ExpectedReturn { get; set; } // SIP / FD
        public string Category { get; set; } = string.Empty;
        public string RiskLevel { get; set; } = string.Empty;
        public string? Description { get; set; }
        public decimal? CurrentPrice { get; set; }
    }
}
