using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WalletWise.API.Models
{
    [Table("AmortizationSchedules")]
    public class AmortizationSchedule
    {
        [Key]
        public int ScheduleId { get; set; }

        [Required]
        public int LoanId { get; set; }

        [Required]
        public int Month { get; set; }

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal Principal { get; set; }

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal Interest { get; set; }

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal Balance { get; set; }

        // Navigation property
        [ForeignKey("LoanId")]
        public virtual Loan Loan { get; set; } = null!;
    }
}



