package com.walletwise.api.service;

import com.walletwise.api.model.Otp;
import com.walletwise.api.repository.OtpRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Random;

@Service
public class OtpService {

    @Autowired
    private OtpRepository otpRepository;

    @Autowired
    private EmailService emailService;

    @Value("${otp.expiration-minutes}")
    private int expirationMinutes;

    public String generateAndSendOtp(Integer userId, String email) {
        Random random = new Random();
        String otpCode = String.valueOf(random.nextInt(900000) + 100000); // 100000 to 999999

        Otp otp = new Otp();
        otp.setUserId(userId);
        otp.setOtpCode(otpCode);
        otp.setExpiresAt(LocalDateTime.now().plusMinutes(expirationMinutes));
        otp.setCreatedAt(LocalDateTime.now());
        otp.setUsed(false);

        otpRepository.save(otp);

        emailService.sendOtpEmail(email, otpCode);

        return otpCode;
    }

    public boolean verifyOtp(Integer userId, String otpCode) {
        Otp otp = otpRepository
                .findTopByUserIdOrderByCreatedAtDesc(userId)
                .orElse(null);

        if (otp == null) {
            System.err.println("OTP ERROR: No OTP found for userId " + userId);
            return false;
        }
        if (otp.isUsed()) {
            System.err.println("OTP ERROR: OTP already used for userId " + userId);
            return false;
        }
        if (LocalDateTime.now().isAfter(otp.getExpiresAt())) {
            System.err.println("OTP ERROR: OTP expired. Expires: " + otp.getExpiresAt() + ", Now: " + LocalDateTime.now());
            return false;
        }
        if (!otp.getOtpCode().equals(otpCode)) {
            System.err.println("OTP ERROR: Code mismatch. Expected: " + otp.getOtpCode() + ", Received: " + otpCode);
            return false;
        }

        otp.setUsed(true);
        otpRepository.save(otp);
        return true;
    }

}
