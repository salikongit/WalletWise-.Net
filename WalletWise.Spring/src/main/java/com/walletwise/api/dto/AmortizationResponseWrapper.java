package com.walletwise.api.dto;

import java.util.List;

public class AmortizationResponseWrapper {
    private List<AmortizationScheduleDto> amortizationSchedule;

    public AmortizationResponseWrapper(List<AmortizationScheduleDto> amortizationSchedule) {
        this.amortizationSchedule = amortizationSchedule;
    }

    public List<AmortizationScheduleDto> getAmortizationSchedule() {
        return amortizationSchedule;
    }

    public void setAmortizationSchedule(List<AmortizationScheduleDto> amortizationSchedule) {
        this.amortizationSchedule = amortizationSchedule;
    }
}
