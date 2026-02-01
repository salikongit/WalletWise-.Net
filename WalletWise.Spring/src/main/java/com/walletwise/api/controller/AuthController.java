package com.walletwise.api.controller;

import com.walletwise.api.dto.*;
import com.walletwise.api.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponseDto> register(
            @RequestBody RegisterRequestDto request) {
        return ResponseEntity.ok(authService.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponseDto> login(
            @RequestBody LoginRequestDto request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<AuthResponseDto> verifyOtp(
            @RequestParam Integer userId,
            @RequestBody VerifyOtpRequestDto request
    ) {
//        String otpCode = body.get("otpCode");
        return ResponseEntity.ok(authService.verifyOtp(userId, request.getOtpCode()));
    }

    @PostMapping("/resend-otp")
    public ResponseEntity<Boolean> resendOtp(
            @RequestParam Integer userId,
            @RequestParam String email
    ) {
        authService.sendOtp(userId, email);
        return ResponseEntity.ok(true);
    }

}



// Inline DTO for OtpRequest if not exists
class OtpRequestDto {
    private String otpCode;
    public String getOtpCode() { return otpCode; }
    public void setOtpCode(String otpCode) { this.otpCode = otpCode; }
}
