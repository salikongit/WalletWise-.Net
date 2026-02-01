package com.walletwise.api.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "EquityStocks")
public class EquityStock {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    
    private String symbol;
    private String companyName;

    @Column(precision = 18, scale = 2)
    private BigDecimal currentPrice;
    
    @Column(precision = 18, scale = 2)
    private BigDecimal previousClose;
    
    @Column(precision = 5, scale = 2)
    private BigDecimal changePercent;
    
    private Long volume;
    private String riskLevel;

    @Column(precision = 18, scale = 2)
    private BigDecimal minInvestment;
    
    @Column(precision = 18, scale = 2)
    private BigDecimal maxInvestment;

    private boolean isActive = true;
    
    private LocalDateTime lastUpdated = LocalDateTime.now();

    public EquityStock() {
    }

    public EquityStock(Integer id, String symbol, String companyName, BigDecimal currentPrice, BigDecimal previousClose, BigDecimal changePercent, Long volume, String riskLevel, BigDecimal minInvestment, BigDecimal maxInvestment, boolean isActive, LocalDateTime lastUpdated) {
        this.id = id;
        this.symbol = symbol;
        this.companyName = companyName;
        this.currentPrice = currentPrice;
        this.previousClose = previousClose;
        this.changePercent = changePercent;
        this.volume = volume;
        this.riskLevel = riskLevel;
        this.minInvestment = minInvestment;
        this.maxInvestment = maxInvestment;
        this.isActive = isActive;
        this.lastUpdated = lastUpdated;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getSymbol() {
        return symbol;
    }

    public void setSymbol(String symbol) {
        this.symbol = symbol;
    }

    public String getCompanyName() {
        return companyName;
    }

    public void setCompanyName(String companyName) {
        this.companyName = companyName;
    }

    public BigDecimal getCurrentPrice() {
        return currentPrice;
    }

    public void setCurrentPrice(BigDecimal currentPrice) {
        this.currentPrice = currentPrice;
    }

    public BigDecimal getPreviousClose() {
        return previousClose;
    }

    public void setPreviousClose(BigDecimal previousClose) {
        this.previousClose = previousClose;
    }

    public BigDecimal getChangePercent() {
        return changePercent;
    }

    public void setChangePercent(BigDecimal changePercent) {
        this.changePercent = changePercent;
    }

    public Long getVolume() {
        return volume;
    }

    public void setVolume(Long volume) {
        this.volume = volume;
    }

    public String getRiskLevel() {
        return riskLevel;
    }

    public void setRiskLevel(String riskLevel) {
        this.riskLevel = riskLevel;
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

    public boolean isActive() {
        return isActive;
    }

    public void setActive(boolean isActive) {
        this.isActive = isActive;
    }

    public LocalDateTime getLastUpdated() {
        return lastUpdated;
    }

    public void setLastUpdated(LocalDateTime lastUpdated) {
        this.lastUpdated = lastUpdated;
    }
}
