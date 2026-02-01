package com.walletwise.api.controller;

import com.walletwise.api.repository.UserRepository;
import com.walletwise.api.service.RecommendationService;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/recommendations")
@Tag(name = "Recommendations")
public class RecommendationController {

    @Autowired
    private RecommendationService recommendationService;
    @Autowired
    private UserRepository userRepository;

    private Integer getUserId(Authentication auth) {
        return userRepository.findByEmail(auth.getName()).orElseThrow().getUserId();
    }

    @GetMapping("/me")
    public ResponseEntity<?> getMyRecommendations(Authentication auth) {
        return ResponseEntity.ok(recommendationService.getRecommendations(getUserId(auth)));
    }
}
