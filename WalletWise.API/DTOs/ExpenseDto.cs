using System.ComponentModel.DataAnnotations;

namespace WalletWise.API.DTOs
{
    public class ExpenseDto
    {
        public int? ExpenseId { get; set; }

        [Required]
        [MaxLength(200)]
        public string ExpenseName { get; set; } = string.Empty;

        [Required]
        [Range(0.01, double.MaxValue)]
        public decimal Amount { get; set; }

        [Required]
        public DateTime ExpenseDate { get; set; }

        [MaxLength(500)]
        public string? Description { get; set; }

        [Required]
        [MaxLength(50)]
        public string Category { get; set; } = string.Empty;
    }
}




