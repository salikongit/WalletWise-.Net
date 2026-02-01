using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WalletWise.API.Models
{
    [Table("Investments")]
    public class Investment
    {
        [Key]
        public int InvestmentId { get; set; }

        [Required]
        public int UserId { get; set; }

        [Required]
        [MaxLength(200)]
        public string InvestmentName { get; set; } = string.Empty;

        [Required]
        [Column(TypeName = "int")]
        public InvestmentType InvestmentType { get; set; } // SIP, Lumpsum, Equity, FD

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal PrincipalAmount { get; set; }

        [Required]
        [Column(TypeName = "decimal(5,2)")]
        public decimal ExpectedReturnRate { get; set; } // Annual return rate in percentage

        [Required]
        public int InvestmentPeriodYears { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal? ExpectedFutureValue { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime? UpdatedAt { get; set; }

        // Navigation property
        [ForeignKey("UserId")]
        public virtual User User { get; set; } = null!;
    }
}



