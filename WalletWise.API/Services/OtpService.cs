using WalletWise.API.Models;
using WalletWise.API.Repositories;

namespace WalletWise.API.Services
{
    public class OtpService : IOtpService
    {
        private readonly IOtpRepository _otpRepository;
        private readonly IEmailService _emailService;
        private readonly IConfiguration _configuration;

        public OtpService(IOtpRepository otpRepository, IEmailService emailService, IConfiguration configuration)
        {
            _otpRepository = otpRepository;
            _emailService = emailService;
            _configuration = configuration;
        }

        public async Task<string> GenerateAndSendOtpAsync(int userId, string email)
        {
            var otpSettings = _configuration.GetSection("OtpSettings");
            var expirationMinutes = otpSettings.GetValue<int>("ExpirationInMinutes", 5);
            var otpLength = otpSettings.GetValue<int>("Length", 6);

            // Generate 6-digit OTP
            var random = new Random();
            var otpCode = random.Next(100000, 999999).ToString();

            var otp = new Otp
            {
                UserId = userId,
                OtpCode = otpCode,
                CreatedAt = DateTime.UtcNow,
                ExpiresAt = DateTime.UtcNow.AddMinutes(expirationMinutes),
                IsUsed = false
            };

            await _otpRepository.CreateAsync(otp);

            // Send OTP via email
            await _emailService.SendOtpEmailAsync(email, otpCode);

            return otpCode;
        }

        public async Task<bool> VerifyOtpAsync(int userId, string otpCode)
        {
            var otp = await _otpRepository.GetLatestOtpByUserIdAsync(userId);
            if (otp == null)
            {
                return false;
            }

            if (otp.IsUsed)
            {
                return false;
            }

            if (DateTime.UtcNow > otp.ExpiresAt)
            {
                return false;
            }

            if (otp.OtpCode != otpCode)
            {
                return false;
            }

            // Mark OTP as used
            await _otpRepository.MarkAsUsedAsync(otp.OtpId);

            return true;
        }
    }
}




