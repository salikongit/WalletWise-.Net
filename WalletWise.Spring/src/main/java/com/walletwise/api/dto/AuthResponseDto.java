package com.walletwise.api.dto;

public class AuthResponseDto {
    private String token;
    private String message;
    private Integer userId;
    private String email;
    private String role;
    private boolean onboardingRequired;
    private boolean isOnboardingComplete;

    public AuthResponseDto() {
    }

    public AuthResponseDto(String token, String message, Integer userId, String email, String role, boolean onboardingRequired, boolean isOnboardingComplete) {
        this.token = token;
        this.message = message;
        this.userId = userId;
        this.email = email;
        this.role = role;
        this.onboardingRequired = onboardingRequired;
        this.isOnboardingComplete = isOnboardingComplete;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public Integer getUserId() {
        return userId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public boolean isOnboardingRequired() {
        return onboardingRequired;
    }

    public void setOnboardingRequired(boolean onboardingRequired) {
        this.onboardingRequired = onboardingRequired;
    }

    public boolean isOnboardingComplete() {
        return isOnboardingComplete;
    }

    public void setOnboardingComplete(boolean isOnboardingComplete) {
        this.isOnboardingComplete = isOnboardingComplete;
    }
}
