using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WalletWise.API.Models
{
    [Table("OTPs")]
    public class Otp
    {
        [Key]
        public int OtpId { get; set; }

        [Required]
        public int UserId { get; set; }

        [Required]
        [MaxLength(6)]
        public string OtpCode { get; set; } = string.Empty;

        [Required]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [Required]
        public DateTime ExpiresAt { get; set; }

        public bool IsUsed { get; set; } = false;

        // Navigation property
        [ForeignKey("UserId")]
        public virtual User User { get; set; } = null!;
    }
}




