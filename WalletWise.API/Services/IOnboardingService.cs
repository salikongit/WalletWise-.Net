using WalletWise.API.DTOs;

namespace WalletWise.API.Services
{
    public interface IOnboardingService
    {
        Task<OnboardingResponseDto> CompleteOnboardingAsync(int userId, OnboardingRequestDto request);
    }
}



