package com.walletwise.api.dto;

import java.util.List;

public class RiskBenefitDto {
    private String riskLevel;
    private List<String> benefits;
    private List<String> risks;

    public RiskBenefitDto() {
    }

    public RiskBenefitDto(String riskLevel, List<String> benefits, List<String> risks) {
        this.riskLevel = riskLevel;
        this.benefits = benefits;
        this.risks = risks;
    }

    public String getRiskLevel() {
        return riskLevel;
    }

    public void setRiskLevel(String riskLevel) {
        this.riskLevel = riskLevel;
    }

    public List<String> getBenefits() {
        return benefits;
    }

    public void setBenefits(List<String> benefits) {
        this.benefits = benefits;
    }

    public List<String> getRisks() {
        return risks;
    }

    public void setRisks(List<String> risks) {
        this.risks = risks;
    }
}
