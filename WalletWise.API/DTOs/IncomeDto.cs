using System.ComponentModel.DataAnnotations;

namespace WalletWise.API.DTOs
{
    public class IncomeDto
    {
        public int? IncomeId { get; set; }

        [Required]
        [MaxLength(200)]
        public string IncomeSource { get; set; } = string.Empty;

        [Required]
        [Range(0.01, double.MaxValue)]
        public decimal Amount { get; set; }

        [Required]
        public DateTime IncomeDate { get; set; }

        [MaxLength(500)]
        public string? Description { get; set; }

        [Required]
        [MaxLength(50)]
        public string Category { get; set; } = string.Empty;
    }
}




