using WalletWise.API.DTOs;

namespace WalletWise.API.Services
{
    public interface IAuthService
    {
        Task<AuthResponseDto> LoginAsync(LoginRequestDto request);
        Task<AuthResponseDto> VerifyOtpAsync(int userId, string otpCode);
        Task<bool> RegisterAsync(RegisterRequestDto request);
    }
}




