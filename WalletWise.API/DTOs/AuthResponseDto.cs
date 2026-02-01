namespace WalletWise.API.DTOs
{
    public class AuthResponseDto
    {
        public string Token { get; set; } = string.Empty;
        public string Role { get; set; } = string.Empty;
        public int UserId { get; set; }
        public string Email { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
        public bool OnboardingRequired { get; set; } = false;
        public bool IsOnboardingComplete { get; set; } = false;
    }
}
