namespace WalletWise.API.Models
{
    public class EquityStock
    {
        public int Id { get; set; }
        public string Symbol { get; set; }
        public string CompanyName { get; set; }

        public decimal CurrentPrice { get; set; }
        public decimal PreviousClose { get; set; }
        public decimal ChangePercent { get; set; }

        public long Volume { get; set; }
        public string RiskLevel { get; set; }

        public decimal MinInvestment { get; set; }
        public decimal MaxInvestment { get; set; }

        public bool IsActive { get; set; }
        public DateTime LastUpdated { get; set; }
    }
}
