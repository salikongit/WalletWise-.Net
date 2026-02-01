package com.walletwise.api.dto;

public class UserStatisticsDto {
    private Integer userId;
    private String email;
    private String name;
    private boolean isActive;
    private Integer loanCount;
    private Integer investmentCount;

    public UserStatisticsDto() {
    }

    public UserStatisticsDto(Integer userId, String email, String name, boolean isActive, Integer loanCount, Integer investmentCount) {
        this.userId = userId;
        this.email = email;
        this.name = name;
        this.isActive = isActive;
        this.loanCount = loanCount;
        this.investmentCount = investmentCount;
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

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public boolean isActive() {
        return isActive;
    }

    public void setActive(boolean isActive) {
        this.isActive = isActive;
    }

    public Integer getLoanCount() {
        return loanCount;
    }

    public void setLoanCount(Integer loanCount) {
        this.loanCount = loanCount;
    }

    public Integer getInvestmentCount() {
        return investmentCount;
    }

    public void setInvestmentCount(Integer investmentCount) {
        this.investmentCount = investmentCount;
    }
}
