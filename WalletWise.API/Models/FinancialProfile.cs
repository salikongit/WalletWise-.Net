using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WalletWise.API.Models
{
    [Table("UserFinancialProfiles")]
    public class FinancialProfile
    {
        [Key]
        public int ProfileId { get; set; }

        [Required]
        public int UserId { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal? TotalIncome { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal? TotalExpenses { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal? TotalSavings { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal? TotalInvestments { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal? TotalLoans { get; set; }

        public DateTime LastUpdated { get; set; } = DateTime.UtcNow;

        // Navigation property
        [ForeignKey("UserId")]
        public virtual User User { get; set; } = null!;
    }
}




