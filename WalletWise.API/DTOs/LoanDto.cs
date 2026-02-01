using System.ComponentModel.DataAnnotations;

namespace WalletWise.API.DTOs
{
    public class LoanDto
    {
        public int? LoanId { get; set; }

        [Required]
        [MaxLength(200)]
        public string LoanName { get; set; } = string.Empty;

        [Required]
        [Range(0.01, double.MaxValue)]
        public decimal PrincipalAmount { get; set; }

        [Required]
        [Range(0.01, 100)]
        public decimal InterestRate { get; set; }

        [Required]
        [Range(1, 600)]
        public int TenureMonths { get; set; }

        public decimal? EmiAmount { get; set; }
    }
}




