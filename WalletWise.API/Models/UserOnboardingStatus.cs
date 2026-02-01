using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WalletWise.API.Models
{
    [Table("UserOnboardingStatuses")]
    public class UserOnboardingStatus
    {
        [Key] // ✅ REQUIRED
        public int StatusId { get; set; }

        [Required]
        public int UserId { get; set; }

        public bool SalaryEntered { get; set; }
        public bool LoansEntered { get; set; }
        public bool ExpensesEntered { get; set; }

        // ✅ single source of truth
        public InvestmentType SelectedInvestmentType { get; set; }

        public DateTime? CompletedAt { get; set; }

        // ✅ navigation
        [ForeignKey(nameof(UserId))]
        public User User { get; set; } = null!;

        [NotMapped]
        public bool IsOnboardingComplete => CompletedAt != null;
    }
}
