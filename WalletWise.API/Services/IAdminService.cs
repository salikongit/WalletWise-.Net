using WalletWise.API.DTOs;

namespace WalletWise.API.Services
{
    public interface IAdminService
    {
        Task<List<UserDto>> GetAllUsersAsync();
        Task<UserDto?> GetUserByIdAsync(int userId);
        Task<bool> ActivateUserAsync(int userId);
        Task<bool> DeactivateUserAsync(int userId);
        Task<AdminStatisticsDto> GetStatisticsAsync();
    }
}




