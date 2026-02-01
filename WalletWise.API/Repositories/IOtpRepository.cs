using WalletWise.API.Models;

namespace WalletWise.API.Repositories
{
    public interface IOtpRepository
    {
        Task<Otp> CreateAsync(Otp otp);
        Task<Otp?> GetLatestOtpByUserIdAsync(int userId);
        Task MarkAsUsedAsync(int otpId);
    }
}




