using WalletWise.API.DTOs;

namespace WalletWise.API.Services
{
    public interface IUserService
    {
        Task<DashboardDto> GetDashboardAsync(int userId);
    }
}




