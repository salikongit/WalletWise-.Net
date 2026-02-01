using Microsoft.EntityFrameworkCore;
using WalletWise.API.Data;
using WalletWise.API.DTOs;
using WalletWise.API.Models;
using WalletWise.API.Repositories;
using BCrypt.Net;

namespace WalletWise.API.Services
{
    public class AuthService : IAuthService
    {
        private readonly IUserRepository _userRepository;
        private readonly IOtpService _otpService;
        private readonly IJwtService _jwtService;
        private readonly IUserOnboardingStatusRepository _onboardingStatusRepository;
        private readonly WalletWiseDbContext _context;

        public AuthService(
            IUserRepository userRepository, 
            IOtpService otpService, 
            IJwtService jwtService,
            IUserOnboardingStatusRepository onboardingStatusRepository,
            WalletWiseDbContext context)
        {
            _userRepository = userRepository;
            _otpService = otpService;
            _jwtService = jwtService;
            _onboardingStatusRepository = onboardingStatusRepository;
            _context = context;
        }

        public async Task<AuthResponseDto> LoginAsync(LoginRequestDto request)
        {
            var user = await _userRepository.GetByEmailAsync(request.Email);
            if (user == null)
            {
                throw new UnauthorizedAccessException("Invalid email or password");
            }

            if (!BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
            {
                throw new UnauthorizedAccessException("Invalid email or password");
            }

            if (!user.IsActive)
            {
                throw new UnauthorizedAccessException("Account is inactive. Please contact administrator.");
            }

            // Generate and send OTP
            await _otpService.GenerateAndSendOtpAsync(user.UserId, user.Email);

            return new AuthResponseDto
            {
                Message = "OTP sent to your email. Please verify to complete login.",
                UserId = user.UserId,
                Email = user.Email
            };
        }

        public async Task<AuthResponseDto> VerifyOtpAsync(int userId, string otpCode)
        {
            var isValid = await _otpService.VerifyOtpAsync(userId, otpCode);
            if (!isValid)
            {
                throw new UnauthorizedAccessException("Invalid or expired OTP");
            }

            var user = await _userRepository.GetByIdAsync(userId);
            if (user == null)
            {
                throw new UnauthorizedAccessException("User not found");
            }

            // Get user roles
            var roles = user.UserRoles.Select(ur => ur.RoleName).ToList();
            var primaryRole = roles.FirstOrDefault() ?? "Customer";

            // Check onboarding status
            var isOnboardingComplete = await _onboardingStatusRepository.IsOnboardingCompleteAsync(user.UserId);

            // Generate JWT token
            var token = _jwtService.GenerateToken(user.UserId, user.Email, primaryRole);

            return new AuthResponseDto
            {
                Token = token,
                Role = primaryRole,
                UserId = user.UserId,
                Email = user.Email,
                Message = "Login successful",
                OnboardingRequired = !isOnboardingComplete,
                IsOnboardingComplete = isOnboardingComplete
            };
        }

        public async Task<bool> RegisterAsync(RegisterRequestDto request)
        {
            if (await _userRepository.EmailExistsAsync(request.Email))
            {
                throw new InvalidOperationException("Email already exists");
            }

            var user = new User
            {
                Email = request.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
                FirstName = request.FirstName,
                LastName = request.LastName,
                PhoneNumber = request.PhoneNumber,
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            };

            var createdUser = await _userRepository.CreateAsync(user);

            // Assign Customer role by default
            var userRole = new UserRole
            {
                UserId = createdUser.UserId,
                RoleName = "Customer",
                CreatedAt = DateTime.UtcNow
            };

            // Add role directly to the context
            _context.UserRoles.Add(userRole);

            // Create onboarding status (not complete initially)
            var onboardingStatus = new UserOnboardingStatus
            {
                UserId = createdUser.UserId,
                //IsOnboardingComplete = false
            };

            _context.UserOnboardingStatuses.Add(onboardingStatus);

            await _context.SaveChangesAsync();

            return true;
        }
    }
}

