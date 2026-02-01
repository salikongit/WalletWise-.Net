using Amazon;
using Amazon.SimpleEmail;
using Amazon.SimpleEmail.Model;

namespace WalletWise.API.Services
{
    public class EmailService : IEmailService
    {
        private readonly IConfiguration _configuration;
        private readonly ILogger<EmailService> _logger;
        private readonly IAmazonSimpleEmailService _sesClient;



        public EmailService(
            IConfiguration configuration,
            ILogger<EmailService> logger)
        {
            _configuration = configuration;
            _logger = logger;

            _sesClient = new AmazonSimpleEmailServiceClient(
                Amazon.RegionEndpoint.APSouth1
            );
        }


        public async Task<bool> SendOtpEmailAsync(string email, string otpCode)
        {
            try
            {
                var awsSettings = _configuration.GetSection("AwsSesSettings");
                var fromEmail = awsSettings["FromEmail"];
                var fromName = awsSettings["FromName"] ?? "WalletWise";

                var request = new SendEmailRequest
                {
                    Source = $"{fromName} <{fromEmail}>",
                    Destination = new Destination
                    {
                        ToAddresses = new List<string> { email }
                    },
                    Message = new Message
                    {
                        Subject = new Content("Your WalletWise OTP Code"),
                        Body = new Body
                        {
                            Html = new Content($@"
                                <html>
                                <body style='font-family: Arial, sans-serif; padding: 20px;'>
                                    <h2 style='color: #4CAF50;'>WalletWise OTP Verification</h2>
                                    <p>Your OTP code is:</p>
                                    <h1 style='color: #2196F3; font-size: 32px; letter-spacing: 5px;'>{otpCode}</h1>
                                    <p>This code will expire in 5 minutes.</p>
                                    <p>If you didn't request this code, please ignore this email.</p>
                                    <hr>
                                    <p style='color: #666; font-size: 12px;'>© WalletWise</p>
                                </body>
                                </html>
                            "),
                            Text = new Content(
                                $"Your WalletWise OTP code is: {otpCode}. It will expire in 5 minutes."
                            )
                        }
                    }
                };

                var response = await _sesClient.SendEmailAsync(request);
                _logger.LogInformation(
                    "OTP email sent successfully to {Email}. MessageId: {MessageId}",
                    email,
                    response.MessageId
                );

                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to send OTP email to {Email}", email);

                // Dev fallback (very good design)
                _logger.LogWarning("OTP for {Email}: {Otp}", email, otpCode);

                return false;
            }
        }
    }
}
