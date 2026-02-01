package com.walletwise.api.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class ExpenseDto {
    private String description;
    private String category;
    private Integer expenseId;
    private String expenseName;
    private BigDecimal amount;
    private java.time.LocalDate expenseDate;

    public ExpenseDto() {
    }

    public ExpenseDto(Integer expenseId, String expenseName, BigDecimal amount, java.time.LocalDate expenseDate, String description, String category) {
        this.expenseId = expenseId;
        this.expenseName = expenseName;
        this.amount = amount;
        this.expenseDate = expenseDate;
        this.description = description;
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

    public java.time.LocalDate getExpenseDate() {
        return expenseDate;
    }

    public void setExpenseDate(java.time.LocalDate expenseDate) {
        this.expenseDate = expenseDate;
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
