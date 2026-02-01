using WalletWise.API.DTOs;
using WalletWise.API.Repositories;

namespace WalletWise.API.Services
{
    public class AdminService : IAdminService
    {
        private readonly IUserRepository _userRepository;
        private readonly ILoanRepository _loanRepository;
        private readonly IInvestmentRepository _investmentRepository;

        public AdminService(
            IUserRepository userRepository,
            ILoanRepository loanRepository,
            IInvestmentRepository investmentRepository)
        {
            _userRepository = userRepository;
            _loanRepository = loanRepository;
            _investmentRepository = investmentRepository;
        }

        public async Task<List<UserDto>> GetAllUsersAsync()
        {
            var users = await _userRepository.GetAllUsersAsync();
            return users.Select(u => new UserDto
            {
                UserId = u.UserId,
                Email = u.Email,
                FirstName = u.FirstName,
                LastName = u.LastName,
                PhoneNumber = u.PhoneNumber,
                IsActive = u.IsActive,
                Roles = u.UserRoles.Select(ur => ur.RoleName).ToList(),
                CreatedAt = u.CreatedAt
            }).ToList();
        }

        public async Task<UserDto?> GetUserByIdAsync(int userId)
        {
            var user = await _userRepository.GetByIdAsync(userId);
            if (user == null)
            {
                return null;
            }

            return new UserDto
            {
                UserId = user.UserId,
                Email = user.Email,
                FirstName = user.FirstName,
                LastName = user.LastName,
                PhoneNumber = user.PhoneNumber,
                IsActive = user.IsActive,
                Roles = user.UserRoles.Select(ur => ur.RoleName).ToList(),
                CreatedAt = user.CreatedAt
            };
        }

        public async Task<bool> ActivateUserAsync(int userId)
        {
            var user = await _userRepository.GetByIdAsync(userId);
            if (user == null)
            {
                return false;
            }

            user.IsActive = true;
            await _userRepository.UpdateAsync(user);
            return true;
        }

        public async Task<bool> DeactivateUserAsync(int userId)
        {
            var user = await _userRepository.GetByIdAsync(userId);
            if (user == null)
            {
                return false;
            }

            user.IsActive = false;
            await _userRepository.UpdateAsync(user);
            return true;
        }

        public async Task<AdminStatisticsDto> GetStatisticsAsync()
        {
            var users = await _userRepository.GetAllUsersAsync();
            var loans = await _loanRepository.GetAllLoansAsync();
            var investments = await _investmentRepository.GetAllInvestmentsAsync();

            var userStats = users.Select(u =>
            {
                var userLoans = loans.Where(l => l.UserId == u.UserId).ToList();
                var userInvestments = investments.Where(i => i.UserId == u.UserId).ToList();

                return new UserStatisticsDto
                {
                    UserId = u.UserId,
                    Email = u.Email,
                    Name = $"{u.FirstName} {u.LastName}",
                    IsActive = u.IsActive,
                    LoanCount = userLoans.Count,
                    InvestmentCount = userInvestments.Count
                };
            }).ToList();

            return new AdminStatisticsDto
            {
                TotalUsers = users.Count,
                ActiveUsers = users.Count(u => u.IsActive),
                InactiveUsers = users.Count(u => !u.IsActive),
                TotalLoans = loans.Count,
                TotalInvestments = investments.Count,
                TotalLoanAmount = loans.Sum(l => l.PrincipalAmount),
                TotalInvestmentAmount = investments.Sum(i => i.PrincipalAmount),
                UserStatistics = userStats
            };
        }
    }
}




