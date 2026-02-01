namespace WalletWise.API.Services
{
    public interface IOtpService
    {
        Task<string> GenerateAndSendOtpAsync(int userId, string email);
        Task<bool> VerifyOtpAsync(int userId, string otpCode);
    }
}




