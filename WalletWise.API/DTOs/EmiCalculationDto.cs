using System.ComponentModel.DataAnnotations;

namespace WalletWise.API.DTOs
{
    public class EmiCalculationDto
    {
        [Required]
        [Range(0.01, double.MaxValue, ErrorMessage = "Principal amount must be greater than 0")]
        public decimal PrincipalAmount { get; set; }

        [Required]
        [Range(0.01, 100, ErrorMessage = "Interest rate must be between 0.01 and 100")]
        public decimal InterestRate { get; set; }

        [Required]
        [Range(1, 600, ErrorMessage = "Tenure must be between 1 and 600 months")]
        public int TenureMonths { get; set; }
    }
}




