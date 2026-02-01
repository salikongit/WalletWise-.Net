package com.walletwise.api.service;

import com.amazonaws.regions.Regions;
import com.amazonaws.services.simpleemail.AmazonSimpleEmailService;
import com.amazonaws.services.simpleemail.AmazonSimpleEmailServiceClientBuilder;
import com.amazonaws.services.simpleemail.model.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
public class EmailService {

    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);

    @Value("${aws.ses.from-email}")
    private String fromEmail;
    
    // Autowire or instantiate client. 
    // Since we used Env vars for AWS keys, the default client builder might find them 
    // if valid in ENV, or we might need BasicAWSCredentials. 
    // Assuming standard SDK behavior (Env vars AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY).
    private final AmazonSimpleEmailService sesClient;

    public EmailService() {
        // We can optimize this to be a Bean, but for simplicity:
        this.sesClient = AmazonSimpleEmailServiceClientBuilder.standard()
                .withRegion(Regions.AP_SOUTH_1)
                .build();
    }

    public boolean sendOtpEmail(String toEmail, String otpCode) {
        try {
            String subject = "Your WalletWise OTP Code";
            String htmlBody = "<html>" +
                    "<body style='font-family: Arial, sans-serif; padding: 20px;'>" +
                    "<h2 style='color: #4CAF50;'>WalletWise OTP Verification</h2>" +
                    "<p>Your OTP code is:</p>" +
                    "<h1 style='color: #2196F3; font-size: 32px; letter-spacing: 5px;'>" + otpCode + "</h1>" +
                    "<p>This code will expire in 5 minutes.</p>" +
                    "<hr>" +
                    "<p style='color: #666; font-size: 12px;'>© WalletWise</p>" +
                    "</body>" +
                    "</html>";

            SendEmailRequest request = new SendEmailRequest()
                    .withDestination(new Destination().withToAddresses(toEmail))
                    .withMessage(new Message()
                            .withBody(new Body()
                                    .withHtml(new Content().withCharset("UTF-8").withData(htmlBody))
                                    .withText(new Content().withCharset("UTF-8").withData("Your OTP is " + otpCode)))
                            .withSubject(new Content().withCharset("UTF-8").withData(subject)))
                    .withSource(fromEmail);

            sesClient.sendEmail(request);
            logger.info("OTP email sent successfully to {}", toEmail);
            return true;
        } catch (Exception ex) {
            logger.error("Failed to send OTP email to {}: {}", toEmail, ex.getMessage());
            // Fallback logging as requested by user
            logger.warn("FALLBACK: OTP for {}: {}", toEmail, otpCode);
            return false;
        }
    }
}
