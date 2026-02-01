package com.walletwise.api.dto;

import java.math.BigDecimal;
import java.util.List;

public class EmiResponseDto {
    private BigDecimal emiAmount;
    private BigDecimal totalAmount;
    private BigDecimal totalInterest;
    private List<AmortizationScheduleDto> amortizationSchedule;

    public EmiResponseDto() {
    }

    public EmiResponseDto(BigDecimal emiAmount, BigDecimal totalAmount, BigDecimal totalInterest, List<AmortizationScheduleDto> amortizationSchedule) {
        this.emiAmount = emiAmount;
        this.totalAmount = totalAmount;
        this.totalInterest = totalInterest;
        this.amortizationSchedule = amortizationSchedule;
    }

    public BigDecimal getEmiAmount() {
        return emiAmount;
    }

    public void setEmiAmount(BigDecimal emiAmount) {
        this.emiAmount = emiAmount;
    }

    public BigDecimal getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(BigDecimal totalAmount) {
        this.totalAmount = totalAmount;
    }

    public BigDecimal getTotalInterest() {
        return totalInterest;
    }

    public void setTotalInterest(BigDecimal totalInterest) {
        this.totalInterest = totalInterest;
    }

    public List<AmortizationScheduleDto> getAmortizationSchedule() {
        return amortizationSchedule;
    }

    public void setAmortizationSchedule(List<AmortizationScheduleDto> amortizationSchedule) {
        this.amortizationSchedule = amortizationSchedule;
    }
}
