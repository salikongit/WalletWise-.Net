package com.walletwise.api.controller;

import com.walletwise.api.dto.DashboardDto;
import com.walletwise.api.repository.UserRepository;
import com.walletwise.api.service.UserService;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
@Tag(name = "Dashboard")
public class DashboardController {

    @Autowired
    private UserService userService;
    @Autowired
    private UserRepository userRepository;

    private Integer getUserId(Authentication auth) {
        return userRepository.findByEmail(auth.getName()).orElseThrow().getUserId();
    }

    @GetMapping
    public ResponseEntity<DashboardDto> getDashboard(Authentication auth) {
        return ResponseEntity.ok(userService.getDashboard(getUserId(auth)));
    }
}
