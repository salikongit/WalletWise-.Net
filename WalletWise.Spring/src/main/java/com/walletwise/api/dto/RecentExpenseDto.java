package com.walletwise.api.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class RecentExpenseDto {
    private Integer expenseId;
    private String expenseName;
    private BigDecimal amount;
    private LocalDateTime expenseDate;
    private String category;

    public RecentExpenseDto() {
    }

    public RecentExpenseDto(Integer expenseId, String expenseName, BigDecimal amount, LocalDateTime expenseDate, String category) {
        this.expenseId = expenseId;
        this.expenseName = expenseName;
        this.amount = amount;
        this.expenseDate = expenseDate;
        this.category = category;
    }

    public Integer getExpenseId() {
        return expenseId;
    }

    public void setExpenseId(Integer expenseId) {
        this.expenseId = expenseId;
    }

    public String getExpenseName() {
        return expenseName;
    }

    public void setExpenseName(String expenseName) {
        this.expenseName = expenseName;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public LocalDateTime getExpenseDate() {
        return expenseDate;
    }

    public void setExpenseDate(LocalDateTime expenseDate) {
        this.expenseDate = expenseDate;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }
}
