package com.walletwise.api.dto;

import java.math.BigDecimal;

public class InvestmentOptionDto {
    private String symbol;
    private String name;
    private String category;
    private BigDecimal price;
    private BigDecimal currentPrice;
    private BigDecimal minInvestment;
    private BigDecimal maxInvestment;
    private BigDecimal expectedReturn;
    private String riskLevel;
    private String description;

    public InvestmentOptionDto() {
    }

    public InvestmentOptionDto(String symbol, String name, String category, BigDecimal price, BigDecimal currentPrice, BigDecimal minInvestment, BigDecimal maxInvestment, BigDecimal expectedReturn, String riskLevel, String description) {
        this.symbol = symbol;
        this.name = name;
        this.category = category;
        this.price = price;
        this.currentPrice = currentPrice;
        this.minInvestment = minInvestment;
        this.maxInvestment = maxInvestment;
        this.expectedReturn = expectedReturn;
        this.riskLevel = riskLevel;
        this.description = description;
    }

    public String getSymbol() {
        return symbol;
    }

    public void setSymbol(String symbol) {
        this.symbol = symbol;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public BigDecimal getCurrentPrice() {
        return currentPrice;
    }

    public void setCurrentPrice(BigDecimal currentPrice) {
        this.currentPrice = currentPrice;
    }

    public BigDecimal getMinInvestment() {
        return minInvestment;
    }

    public void setMinInvestment(BigDecimal minInvestment) {
        this.minInvestment = minInvestment;
    }

    public BigDecimal getMaxInvestment() {
        return maxInvestment;
    }

    public void setMaxInvestment(BigDecimal maxInvestment) {
        this.maxInvestment = maxInvestment;
    }

    public BigDecimal getExpectedReturn() {
        return expectedReturn;
    }

    public void setExpectedReturn(BigDecimal expectedReturn) {
        this.expectedReturn = expectedReturn;
    }

    public String getRiskLevel() {
        return riskLevel;
    }

    public void setRiskLevel(String riskLevel) {
        this.riskLevel = riskLevel;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}
