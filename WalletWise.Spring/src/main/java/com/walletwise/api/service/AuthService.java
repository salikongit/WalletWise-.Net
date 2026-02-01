package com.walletwise.api.service;

import com.walletwise.api.dto.AuthResponseDto;
import com.walletwise.api.dto.LoginRequestDto;
import com.walletwise.api.dto.RegisterRequestDto;
import com.walletwise.api.model.User;
import com.walletwise.api.model.UserOnboardingStatus;
import com.walletwise.api.model.UserRole;
import com.walletwise.api.repository.UserOnboardingStatusRepository;
import com.walletwise.api.repository.UserRepository;
import com.walletwise.api.repository.UserRoleRepository;
import com.walletwise.api.security.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserRoleRepository userRoleRepository;

    @Autowired
    private UserOnboardingStatusRepository onboardingStatusRepository;

    @Autowired
    private OtpService otpService;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public AuthResponseDto login(LoginRequestDto request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new RuntimeException("Invalid email or password");
        }

        if (!user.isActive()) {
            throw new RuntimeException("Account is inactive");
        }

        otpService.generateAndSendOtp(user.getUserId(), user.getEmail());

        AuthResponseDto response = new AuthResponseDto();
        response.setMessage("OTP sent to your email. Please verify to complete login.");
        response.setUserId(user.getUserId());
        response.setEmail(user.getEmail());
        return response;
    }

    public AuthResponseDto verifyOtp(Integer userId, String otpCode) {
        boolean isValid = otpService.verifyOtp(userId, otpCode);
        if (!isValid) {
            throw new RuntimeException("Invalid or expired OTP");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        String role = "Customer";
        if (!user.getUserRoles().isEmpty()) {
            role = user.getUserRoles().get(0).getRoleName();
        }

        boolean isOnboardingComplete = false;
        UserOnboardingStatus status = onboardingStatusRepository.findByUserId(userId).orElse(null);
        if (status != null && status.isOnboardingComplete()) {
            isOnboardingComplete = true;
        }

        String token = jwtService.generateToken(user.getUserId(), user.getEmail(), role);

        AuthResponseDto response = new AuthResponseDto();
        response.setToken(token);
        response.setRole(role);
        response.setUserId(user.getUserId());
        response.setEmail(user.getEmail());
        response.setMessage("Login successful");
        response.setOnboardingRequired(!isOnboardingComplete);
        response.setOnboardingComplete(isOnboardingComplete);
        return response;
    }

    @Transactional
    public AuthResponseDto register(RegisterRequestDto request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        User user = new User();
        user.setEmail(request.getEmail());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setPhoneNumber(request.getPhoneNumber());
        user.setActive(true);

        user = userRepository.save(user);

        UserRole role = new UserRole();
        role.setUser(user);
        role.setRoleName("Customer");
        userRoleRepository.save(role);

        UserOnboardingStatus status = new UserOnboardingStatus();
        status.setUser(user);
        status.setSalaryEntered(false);
        status.setLoansEntered(false);
        status.setExpensesEntered(false);
        onboardingStatusRepository.save(status);

        // Generate and Send OTP
        otpService.generateAndSendOtp(user.getUserId(), user.getEmail());

        AuthResponseDto response = new AuthResponseDto();
        response.setMessage("User registered successfully. OTP sent to email.");
        response.setUserId(user.getUserId());
        response.setEmail(user.getEmail());
        // Initial state
        response.setOnboardingRequired(true);
        response.setOnboardingComplete(false);
        
        return response;
    }
    public void sendOtp(Integer userId, String email) {
        otpService.generateAndSendOtp(userId, email);
    }

}
