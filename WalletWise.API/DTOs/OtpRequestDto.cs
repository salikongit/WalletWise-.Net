using System.ComponentModel.DataAnnotations;

namespace WalletWise.API.DTOs
{
    public class OtpRequestDto
    {
        [Required]
        [MaxLength(6)]
        [MinLength(6)]
        public string OtpCode { get; set; } = string.Empty;
    }
}




