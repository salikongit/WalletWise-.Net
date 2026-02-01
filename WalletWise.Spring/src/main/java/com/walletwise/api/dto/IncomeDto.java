package com.walletwise.api.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class IncomeDto {
    private Integer incomeId;
    private String incomeSource;
    private BigDecimal amount;
    private java.time.LocalDate incomeDate;
    private String description;
    private String category;

    public IncomeDto() {
    }

    public IncomeDto(Integer incomeId, String incomeSource, BigDecimal amount, java.time.LocalDate incomeDate, String description, String category) {
        this.incomeId = incomeId;
        this.incomeSource = incomeSource;
        this.amount = amount;
        this.incomeDate = incomeDate;
        this.description = description;
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

    public java.time.LocalDate getIncomeDate() {
        return incomeDate;
    }

    public void setIncomeDate(java.time.LocalDate incomeDate) {
        this.incomeDate = incomeDate;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }
}
