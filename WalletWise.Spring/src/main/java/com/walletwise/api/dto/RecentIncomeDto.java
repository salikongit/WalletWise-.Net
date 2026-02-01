package com.walletwise.api.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class RecentIncomeDto {
    private Integer incomeId;
    private String incomeSource;
    private BigDecimal amount;
    private LocalDateTime incomeDate;
    private String category;

    public RecentIncomeDto() {
    }

    public RecentIncomeDto(Integer incomeId, String incomeSource, BigDecimal amount, LocalDateTime incomeDate, String category) {
        this.incomeId = incomeId;
        this.incomeSource = incomeSource;
        this.amount = amount;
        this.incomeDate = incomeDate;
        this.category = category;
    }

    public Integer getIncomeId() {
        return incomeId;
    }

    public void setIncomeId(Integer incomeId) {
        this.incomeId = incomeId;
    }

    public String getIncomeSource() {
        return incomeSource;
    }

    public void setIncomeSource(String incomeSource) {
        this.incomeSource = incomeSource;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public LocalDateTime getIncomeDate() {
        return incomeDate;
    }

    public void setIncomeDate(LocalDateTime incomeDate) {
        this.incomeDate = incomeDate;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }
}
