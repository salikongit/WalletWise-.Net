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
@RequestMapping({"/api/UserData", "/api/userdata", "/api/userData"})
@Tag(name = "UserData")
public class UserDataController {

    @Autowired
    private UserService userService;
    @Autowired
    private UserRepository userRepository;

    private Integer getUserId(Authentication auth) {
        String email = auth.getName();
        return userRepository.findByEmail(email).orElseThrow().getUserId();
    }

    @GetMapping("/dashboard")
    public ResponseEntity<DashboardDto> getDashboard(Authentication auth) {
        return ResponseEntity.ok(userService.getDashboard(getUserId(auth)));
    }

    @org.springframework.web.bind.annotation.DeleteMapping("/reset")
    public ResponseEntity<Void> resetData(Authentication auth) {
        userService.resetUserData(getUserId(auth));
        return ResponseEntity.noContent().build();
    }
}
