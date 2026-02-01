using WalletWise.API.Models;

namespace WalletWise.API.DTOs
{
    public class DashboardDto
    {
        public decimal TotalIncome { get; set; }
        public decimal TotalExpenses { get; set; }
        public decimal TotalSavings { get; set; }
        public decimal TotalMonthlyEmi { get; set; }
        public decimal AvailableForInvestment { get; set; }
        public decimal TotalInvestments { get; set; }
        public decimal TotalLoans { get; set; }
        public List<RecentIncomeDto> RecentIncomes { get; set; } = new();
        public List<RecentExpenseDto> RecentExpenses { get; set; } = new();
        public List<ActiveLoanDto> ActiveLoans { get; set; } = new();
        public List<ActiveInvestmentDto> ActiveInvestments { get; set; } = new();
    }

    public class RecentIncomeDto
    {
        public int IncomeId { get; set; }
        public string IncomeSource { get; set; } = string.Empty;
        public decimal Amount { get; set; }
        public DateTime IncomeDate { get; set; }
        public string Category { get; set; } = string.Empty;
    }

    public class RecentExpenseDto
    {
        public int ExpenseId { get; set; }
        public string ExpenseName { get; set; } = string.Empty;
        public decimal Amount { get; set; }
        public DateTime ExpenseDate { get; set; }
        public string Category { get; set; } = string.Empty;
    }

    public class ActiveLoanDto
    {
        public int LoanId { get; set; }
        public string LoanName { get; set; } = string.Empty;
        public decimal PrincipalAmount { get; set; }
        public decimal EmiAmount { get; set; }
        public int TenureMonths { get; set; }
    }

    public class ActiveInvestmentDto
    {
        public int InvestmentId { get; set; }
        public string InvestmentName { get; set; } = string.Empty;
        //public string InvestmentType { get; set; } = string.Empty;
        public InvestmentType InvestmentType { get; set; }

        public decimal PrincipalAmount { get; set; }
        public decimal? ExpectedFutureValue { get; set; }
    }
}




