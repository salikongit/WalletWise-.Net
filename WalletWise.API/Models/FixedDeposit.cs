namespace WalletWise.API.Models
{
    public class FixedDeposit
    {
        public int Id { get; set; }
        public string BankName { get; set; }

        public int TenureYears { get; set; }
        public decimal InterestRate { get; set; }

        public decimal MinInvestment { get; set; }
        public decimal MaxInvestment { get; set; }

        public bool IsActive { get; set; }
    }
}
