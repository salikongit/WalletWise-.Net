using System.ComponentModel.DataAnnotations;
using WalletWise.API.Models;

namespace WalletWise.API.DTOs
{
    public class OnboardingRequestDto
    {
        [Required]
        [Range(0.01, double.MaxValue, ErrorMessage = "Salary must be greater than 0")]
        public decimal Salary { get; set; }

        [Required]
        [MaxLength(20)]
        public string SalaryFrequency { get; set; } = string.Empty; // "Monthly" or "Yearly"

        public List<LoanDto>? Loans { get; set; }

        public List<ExpenseDto>? MonthlyExpenses { get; set; }

        [Required]
        public InvestmentType InvestmentType { get; set; } // SIP, Lumpsum, Equity, FD

        [Required]
        public bool RiskAccepted { get; set; } // User must accept risks/benefits
    }
}
