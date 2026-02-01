using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WalletWise.API.Services;

namespace WalletWise.API.Controllers
{
    [ApiController]
    [Route("api/recommendations")]
    [Authorize]
    public class RecommendationController : ControllerBase
    {
        private readonly IRecommendationService _recommendationService;

        public RecommendationController(IRecommendationService recommendationService)
        {
            _recommendationService = recommendationService;
        }

        // GET: api/recommendations/me
        [HttpGet("me")]
        public async Task<IActionResult> GetMyRecommendations()
        {
            var userId = int.Parse(User.FindFirst("UserId")!.Value);

            var result = await _recommendationService.GetRecommendationsAsync(userId);
            return Ok(result);
        }
    }
}
