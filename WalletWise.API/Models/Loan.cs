using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WalletWise.API.Models
{
    [Table("Loans")]
    public class Loan
    {
        [Key]
        public int LoanId { get; set; }

        [Required]
        public int UserId { get; set; }

        [Required]
        [MaxLength(200)]
        public string LoanName { get; set; } = string.Empty;

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal PrincipalAmount { get; set; }

        [Required]
        [Column(TypeName = "decimal(5,2)")]
        public decimal InterestRate { get; set; } // Annual interest rate in percentage

        [Required]
        public int TenureMonths { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal? EmiAmount { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime? UpdatedAt { get; set; }

        // Navigation properties
        [ForeignKey("UserId")]
        public virtual User User { get; set; } = null!;
        public virtual ICollection<AmortizationSchedule> AmortizationSchedules { get; set; } = new List<AmortizationSchedule>();
    }
}


