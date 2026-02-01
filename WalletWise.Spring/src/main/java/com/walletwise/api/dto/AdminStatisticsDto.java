package com.walletwise.api.dto;

import java.util.List;
import java.math.BigDecimal;

public class AdminStatisticsDto {
    private Integer totalUsers;
    private Integer activeUsers;
    private Integer inactiveUsers;
    private Integer totalLoans;
    private Integer totalInvestments;
    private BigDecimal totalLoanAmount;
    private BigDecimal totalInvestmentAmount;
    private List<UserStatisticsDto> userStatistics;

    public AdminStatisticsDto() {
    }

    public AdminStatisticsDto(Integer totalUsers, Integer activeUsers, Integer inactiveUsers, Integer totalLoans, Integer totalInvestments, BigDecimal totalLoanAmount, BigDecimal totalInvestmentAmount, List<UserStatisticsDto> userStatistics) {
        this.totalUsers = totalUsers;
        this.activeUsers = activeUsers;
        this.inactiveUsers = inactiveUsers;
        this.totalLoans = totalLoans;
        this.totalInvestments = totalInvestments;
        this.totalLoanAmount = totalLoanAmount;
        this.totalInvestmentAmount = totalInvestmentAmount;
        this.userStatistics = userStatistics;
    }

    public Integer getTotalUsers() {
        return totalUsers;
    }

    public void setTotalUsers(Integer totalUsers) {
        this.totalUsers = totalUsers;
    }

    public Integer getActiveUsers() {
        return activeUsers;
    }

    public void setActiveUsers(Integer activeUsers) {
        this.activeUsers = activeUsers;
    }

    public Integer getInactiveUsers() {
        return inactiveUsers;
    }

    public void setInactiveUsers(Integer inactiveUsers) {
        this.inactiveUsers = inactiveUsers;
    }

    public Integer getTotalLoans() {
        return totalLoans;
    }

    public void setTotalLoans(Integer totalLoans) {
        this.totalLoans = totalLoans;
    }

    public Integer getTotalInvestments() {
        return totalInvestments;
    }

    public void setTotalInvestments(Integer totalInvestments) {
        this.totalInvestments = totalInvestments;
    }

    public BigDecimal getTotalLoanAmount() {
        return totalLoanAmount;
    }

    public void setTotalLoanAmount(BigDecimal totalLoanAmount) {
        this.totalLoanAmount = totalLoanAmount;
    }

    public BigDecimal getTotalInvestmentAmount() {
        return totalInvestmentAmount;
    }

    public void setTotalInvestmentAmount(BigDecimal totalInvestmentAmount) {
        this.totalInvestmentAmount = totalInvestmentAmount;
    }

    public List<UserStatisticsDto> getUserStatistics() {
        return userStatistics;
    }

    public void setUserStatistics(List<UserStatisticsDto> userStatistics) {
        this.userStatistics = userStatistics;
    }
}
