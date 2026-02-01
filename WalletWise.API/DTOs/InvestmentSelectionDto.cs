using WalletWise.API.Models;

namespace WalletWise.API.DTOs
{
    public class InvestmentSelectionDto
    {
        public decimal AvailableForInvestment { get; set; }
        public decimal TotalMonthlyEmi { get; set; }
        public List<InvestmentTypeOption> InvestmentOptions { get; set; } = new();
    }

    public class InvestmentTypeOption
    {
        public InvestmentType Type { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public decimal MinimumAmount { get; set; }
        public string RiskLevel { get; set; } = string.Empty;
    }
}