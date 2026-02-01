using System.ComponentModel.DataAnnotations;
using WalletWise.API.Models;

namespace WalletWise.API.DTOs
{
    public class InvestmentCalculationDto
    {
        [Required]
        [MaxLength(50)]
        public InvestmentType InvestmentType { get; set; } // "SIP" or "Lumpsum"

        [Required]
        [Range(0.01, double.MaxValue, ErrorMessage = "Principal amount must be greater than 0")]
        public decimal PrincipalAmount { get; set; }

        [Required]
        [Range(0.01, 100, ErrorMessage = "Expected return rate must be between 0.01 and 100")]
        public decimal ExpectedReturnRate { get; set; }

        [Required]
        [Range(1, 100, ErrorMessage = "Investment period must be between 1 and 100 years")]
        public int InvestmentPeriodYears { get; set; }
    }
}




