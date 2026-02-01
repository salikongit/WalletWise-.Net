namespace WalletWise.API.Models
{
    public class SipFund
    {
        public int Id { get; set; }
        public string FundCode { get; set; }
        public string FundName { get; set; }
        public string Category { get; set; }

        public decimal Nav { get; set; }
        public decimal ExpectedReturn { get; set; }
        public string RiskLevel { get; set; }

        public decimal MinMonthlyAmount { get; set; }
        public decimal MaxMonthlyAmount { get; set; }

        public int LockInYears { get; set; }
        public bool IsActive { get; set; }
    }
}
