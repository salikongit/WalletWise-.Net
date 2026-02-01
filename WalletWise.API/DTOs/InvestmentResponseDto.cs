using WalletWise.API.Models;

namespace WalletWise.API.DTOs
{
    public class InvestmentResponseDto
    {
        public decimal FutureValue { get; set; }
        public decimal TotalInvestment { get; set; }
        public decimal TotalReturns { get; set; }
        //public string InvestmentType { get; set; } = string.Empty;
        public InvestmentType InvestmentType { get; set; }

    }
}




