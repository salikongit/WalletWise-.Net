package com.walletwise.api.controller;

import com.walletwise.api.dto.OnboardingRequestDto;
import com.walletwise.api.repository.UserRepository;
import com.walletwise.api.service.OnboardingService;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/onboarding")
@Tag(name = "Onboarding")
public class OnboardingController {

    @Autowired
    private OnboardingService onboardingService;
    @Autowired
    private UserRepository userRepository;

    private Integer getUserId(Authentication auth) {
        return userRepository.findByEmail(auth.getName()).orElseThrow().getUserId();
    }

    @PostMapping("/complete")
    public ResponseEntity<?> completeOnboarding(Authentication auth, @RequestBody OnboardingRequestDto request) {
        try {
            return ResponseEntity.ok(onboardingService.completeOnboarding(getUserId(auth), request));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }
}
