using WalletWise.API.Models;

namespace WalletWise.API.Repositories
{
    public interface IUserRepository
    {
        Task<User?> GetByEmailAsync(string email);
        Task<User?> GetByIdAsync(int userId);
        Task<User> CreateAsync(User user);
        Task<User> UpdateAsync(User user);
        Task<List<User>> GetAllUsersAsync();
        Task<bool> EmailExistsAsync(string email);
    }
}




