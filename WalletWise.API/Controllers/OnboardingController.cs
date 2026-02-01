using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using WalletWise.API.DTOs;
using WalletWise.API.Services;
using WalletWise.API.Models;


namespace WalletWise.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    [Tags("Onboarding")]
    public class OnboardingController : ControllerBase
    {
        private readonly IOnboardingService _onboardingService;

        public OnboardingController(IOnboardingService onboardingService)
        {
            _onboardingService = onboardingService;
        }

        private int GetUserId()
        {
            return int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        }

        /// <summary>
        /// Get risk and benefits for investment type selection (before completing onboarding)
        /// </summary>
        [HttpGet("risk-benefit")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(RiskBenefitDto))]
        public async Task<IActionResult> GetRiskBenefit([FromQuery] InvestmentType investmentType, [FromServices] IStockService stockService)
        {
            try
            {
                var riskBenefit = await stockService.GetRiskBenefitAsync(investmentType);
                return Ok(riskBenefit);
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        /// <summary>
        /// Complete onboarding wizard - Financial setup
        /// </summary>
        [HttpPost("complete")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(OnboardingResponseDto))]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> CompleteOnboarding([FromBody] OnboardingRequestDto request)
        {
            try
            {
                var userId = GetUserId();
                var response = await _onboardingService.CompleteOnboardingAsync(userId, request);
                return Ok(response);
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }
    }
}


