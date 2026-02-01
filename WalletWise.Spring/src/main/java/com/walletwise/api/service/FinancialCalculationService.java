package com.walletwise.api.service;

import com.walletwise.api.dto.*;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.MathContext;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;

@Service
public class FinancialCalculationService {

    public EmiResponseDto calculateEmi(EmiCalculationDto request) {
        // Monthly Rate
        BigDecimal monthlyRate = request.getInterestRate()
                .divide(BigDecimal.valueOf(100), MathContext.DECIMAL128)
                .divide(BigDecimal.valueOf(12), MathContext.DECIMAL128);

        BigDecimal principal = request.getPrincipalAmount();
        Integer tenure = request.getTenureMonths();

        BigDecimal emi;
        if (monthlyRate.compareTo(BigDecimal.ZERO) > 0) {
            // P * R * (1+R)^N / ((1+R)^N - 1)
            BigDecimal onePlusR = BigDecimal.ONE.add(monthlyRate);
            BigDecimal power = onePlusR.pow(tenure, MathContext.DECIMAL128);
            
            BigDecimal numerator = principal.multiply(monthlyRate).multiply(power);
            BigDecimal denominator = power.subtract(BigDecimal.ONE);
            
            emi = numerator.divide(denominator, MathContext.DECIMAL128);
        } else {
            emi = principal.divide(BigDecimal.valueOf(tenure), MathContext.DECIMAL128);
        }

        BigDecimal totalAmount = emi.multiply(BigDecimal.valueOf(tenure));
        BigDecimal totalInterest = totalAmount.subtract(principal);

        List<AmortizationScheduleDto> schedule = new ArrayList<>();
        BigDecimal balance = principal;

        for (int month = 1; month <= tenure; month++) {
            BigDecimal interest = balance.multiply(monthlyRate);
            BigDecimal principalPayment = emi.subtract(interest);
            balance = balance.subtract(principalPayment);
            if (balance.compareTo(BigDecimal.ZERO) < 0) balance = BigDecimal.ZERO;

            AmortizationScheduleDto scheduleDto = new AmortizationScheduleDto();
            scheduleDto.setMonth(month);
            scheduleDto.setPrincipal(principalPayment.setScale(2, RoundingMode.HALF_UP));
            scheduleDto.setInterest(interest.setScale(2, RoundingMode.HALF_UP));
            scheduleDto.setBalance(balance.setScale(2, RoundingMode.HALF_UP));
            schedule.add(scheduleDto);
        }

        EmiResponseDto response = new EmiResponseDto();
        response.setEmiAmount(emi.setScale(2, RoundingMode.HALF_UP));
        response.setTotalAmount(totalAmount.setScale(2, RoundingMode.HALF_UP));
        response.setTotalInterest(totalInterest.setScale(2, RoundingMode.HALF_UP));
        response.setAmortizationSchedule(schedule);
        return response;
    }

    public InvestmentResponseDto calculateInvestment(InvestmentCalculationDto request) {
        BigDecimal principal = request.getPrincipalAmount();
        BigDecimal annualRate = request.getExpectedReturnRate().divide(BigDecimal.valueOf(100), MathContext.DECIMAL128);
        int years = request.getInvestmentPeriodYears();

        BigDecimal futureValue;
        BigDecimal totalInvestment;

        if ("SIP".equalsIgnoreCase(request.getInvestmentType().toString())) {
            BigDecimal monthlyRate = annualRate.divide(BigDecimal.valueOf(12), MathContext.DECIMAL128);
            int months = years * 12;

            if (monthlyRate.compareTo(BigDecimal.ZERO) > 0) {
                // FV = P * [((1+r)^n - 1) / r] * (1+r)
                BigDecimal onePlusR = BigDecimal.ONE.add(monthlyRate);
                BigDecimal power = onePlusR.pow(months, MathContext.DECIMAL128);
                
                futureValue = principal.multiply(power.subtract(BigDecimal.ONE))
                        .divide(monthlyRate, MathContext.DECIMAL128)
                        .multiply(onePlusR);
            } else {
                futureValue = principal.multiply(BigDecimal.valueOf(months));
            }
            totalInvestment = principal.multiply(BigDecimal.valueOf(months));
        } else {
            // Lumpsum: FV = P * (1+r)^n
            BigDecimal onePlusR = BigDecimal.ONE.add(annualRate);
            futureValue = principal.multiply(onePlusR.pow(years, MathContext.DECIMAL128));
            totalInvestment = principal;
        }

        BigDecimal totalReturns = futureValue.subtract(totalInvestment);

        InvestmentResponseDto response = new InvestmentResponseDto();
        response.setFutureValue(futureValue.setScale(2, RoundingMode.HALF_UP));
        response.setTotalInvestment(totalInvestment.setScale(2, RoundingMode.HALF_UP));
        response.setTotalReturns(totalReturns.setScale(2, RoundingMode.HALF_UP));
        response.setInvestmentType(request.getInvestmentType());
        return response;
    }
}
