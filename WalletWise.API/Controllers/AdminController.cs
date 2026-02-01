using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WalletWise.API.DTOs;
using WalletWise.API.Services;

namespace WalletWise.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Admin")]
    [Tags("Admin")]
    public class AdminController : ControllerBase
    {
        private readonly IAdminService _adminService;

        public AdminController(IAdminService adminService)
        {
            _adminService = adminService;
        }

        /// <summary>
        /// Get all users (Admin only)
        /// </summary>
        [HttpGet("users")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(List<UserDto>))]
        public async Task<IActionResult> GetAllUsers()
        {
            var users = await _adminService.GetAllUsersAsync();
            return Ok(users);
        }

        /// <summary>
        /// Get user by ID (Admin only)
        /// </summary>
        [HttpGet("users/{userId}")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(UserDto))]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetUser(int userId)
        {
            var user = await _adminService.GetUserByIdAsync(userId);
            if (user == null)
            {
                return NotFound(new { error = "User not found" });
            }
            return Ok(user);
        }

        /// <summary>
        /// Activate a user (Admin only)
        /// </summary>
        [HttpPost("users/{userId}/activate")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> ActivateUser(int userId)
        {
            var result = await _adminService.ActivateUserAsync(userId);
            if (!result)
            {
                return NotFound(new { error = "User not found" });
            }
            return Ok(new { message = "User activated successfully" });
        }

        /// <summary>
        /// Deactivate a user (Admin only)
        /// </summary>
        [HttpPost("users/{userId}/deactivate")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> DeactivateUser(int userId)
        {
            var result = await _adminService.DeactivateUserAsync(userId);
            if (!result)
            {
                return NotFound(new { error = "User not found" });
            }
            return Ok(new { message = "User deactivated successfully" });
        }

        /// <summary>
        /// Get aggregated statistics (Admin only)
        /// </summary>
        [HttpGet("statistics")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(AdminStatisticsDto))]
        public async Task<IActionResult> GetStatistics()
        {
            var statistics = await _adminService.GetStatisticsAsync();
            return Ok(statistics);
        }
    }
}




