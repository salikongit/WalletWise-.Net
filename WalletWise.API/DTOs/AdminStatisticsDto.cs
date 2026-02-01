namespace WalletWise.API.DTOs
{
    public class AdminStatisticsDto
    {
        public int TotalUsers { get; set; }
        public int ActiveUsers { get; set; }
        public int InactiveUsers { get; set; }
        public int TotalLoans { get; set; }
        public int TotalInvestments { get; set; }
        public decimal TotalLoanAmount { get; set; }
        public decimal TotalInvestmentAmount { get; set; }
        public List<UserStatisticsDto> UserStatistics { get; set; } = new();
    }

    public class UserStatisticsDto
    {
        public int UserId { get; set; }
        public string Email { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public bool IsActive { get; set; }
        public int LoanCount { get; set; }
        public int InvestmentCount { get; set; }
    }
}




