using WalletWise.API.Models;

namespace WalletWise.API.Repositories
{
    public interface IUserOnboardingStatusRepository
    {
        Task<UserOnboardingStatus?> GetByUserIdAsync(int userId);
        Task CreateAsync(UserOnboardingStatus status);
        Task UpdateAsync(UserOnboardingStatus status);
        Task<bool> IsOnboardingCompleteAsync(int userId);
    }
}
