using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using WalletWise.API.DTOs;
using WalletWise.API.Services;

namespace WalletWise.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    [Tags("Dashboard")]
    public class DashboardController : ControllerBase
    {
        private readonly IUserService _userService;

        public DashboardController(IUserService userService)
        {
            _userService = userService;
        }

        private int GetUserId()
        {
            return int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        }

        /// <summary>
        /// Get user financial dashboard
        /// </summary>
        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(DashboardDto))]
        public async Task<IActionResult> GetDashboard()
        {
            var userId = GetUserId();
            var dashboard = await _userService.GetDashboardAsync(userId);
            return Ok(dashboard);
        }

        /// <summary>
        /// Get available amount for investment after EMI deduction
        /// </summary>
        [HttpGet("available-for-investment")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(decimal))]
        public async Task<IActionResult> GetAvailableForInvestment()
        {
            var userId = GetUserId();
            var dashboard = await _userService.GetDashboardAsync(userId);
            return Ok(new { availableAmount = dashboard.AvailableForInvestment });
        }
    }
}




