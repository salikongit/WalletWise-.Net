using System.ComponentModel.DataAnnotations;
using WalletWise.API.Models;

namespace WalletWise.API.DTOs
{
    public class InvestmentDto
    {
        public int? InvestmentId { get; set; }

        [Required]
        [MaxLength(200)]
        public string InvestmentName { get; set; } = string.Empty;

        [Required]
        public InvestmentType InvestmentType { get; set; }

        [Required]
        [Range(0.01, double.MaxValue)]
        public decimal PrincipalAmount { get; set; }

        [Required]
        [Range(0.01, 100)]
        public decimal ExpectedReturnRate { get; set; }

        [Required]
        [Range(1, 100)]
        public int InvestmentPeriodYears { get; set; }
    }
}



