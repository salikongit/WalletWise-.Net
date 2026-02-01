package com.walletwise.api.service;

import com.walletwise.api.dto.InvestmentOptionDto;
import com.walletwise.api.repository.EquityStockRepository;
import com.walletwise.api.repository.FixedDepositRepository;
import com.walletwise.api.repository.SipFundRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class MarketDataService {

    @Autowired
    private SipFundRepository sipFundRepository;

    @Autowired
    private EquityStockRepository equityStockRepository;

    @Autowired
    private FixedDepositRepository fixedDepositRepository;

    public List<InvestmentOptionDto> getSipFunds(BigDecimal maxMonthlyAmount) {
        return sipFundRepository.findByIsActiveTrueAndMinMonthlyAmountLessThanEqual(maxMonthlyAmount).stream()
                .map(s -> {
                    InvestmentOptionDto dto = new InvestmentOptionDto();
                    dto.setSymbol(s.getFundCode());
                    dto.setName(s.getFundName());
                    dto.setCategory("SIP - " + s.getCategory());
                    dto.setMinInvestment(s.getMinMonthlyAmount());
                    dto.setMaxInvestment(s.getMaxMonthlyAmount());
                    dto.setExpectedReturn(s.getExpectedReturn());
                    dto.setDescription("Lock-in: " + s.getLockInYears() + " years | Risk: " + s.getRiskLevel());
                    return dto;
                })
                .collect(Collectors.toList());
    }

    public List<InvestmentOptionDto> getEquityStocks(BigDecimal budget) {
        // Fallback hardcoded if DB empty, similar to .NET example
        List<InvestmentOptionDto> dbStocks = equityStockRepository.findByIsActiveTrueAndCurrentPriceLessThanEqual(budget).stream()
                .map(e -> {
                    InvestmentOptionDto dto = new InvestmentOptionDto();
                    dto.setSymbol(e.getSymbol());
                    dto.setName(e.getCompanyName());
                    dto.setCategory("Equity");
                    dto.setPrice(e.getCurrentPrice());
                    dto.setCurrentPrice(e.getCurrentPrice());
                    dto.setMinInvestment(e.getCurrentPrice());
                    //.maxInvestment(e.getCurrentPrice().multiply(BigDecimal.valueOf(100)))
                    dto.setRiskLevel(e.getRiskLevel());
                    return dto;
                })
                .collect(Collectors.toList());

        if (!dbStocks.isEmpty()) return dbStocks;

        // Hardcoded fallback as seen in .NET
        List<InvestmentOptionDto> fallback = new ArrayList<>();
        InvestmentOptionDto fallbackDto = new InvestmentOptionDto();
        fallbackDto.setSymbol("TCS");
        fallbackDto.setName("Tata Consultancy Services");
        fallbackDto.setCategory("Equity");
        fallbackDto.setPrice(BigDecimal.valueOf(3850));
        fallbackDto.setCurrentPrice(BigDecimal.valueOf(3850));
        fallbackDto.setMinInvestment(BigDecimal.valueOf(3850));
        fallbackDto.setMaxInvestment(BigDecimal.valueOf(385000));
        fallbackDto.setRiskLevel("Medium");
        fallbackDto.setDescription("Blue-chip IT stock");
        fallback.add(fallbackDto);
        
        return fallback;
    }

    public List<InvestmentOptionDto> getFixedDeposits(BigDecimal amount) {
        return fixedDepositRepository.findByIsActiveTrueAndMinInvestmentLessThanEqual(amount).stream()
                .map(f -> {
                    InvestmentOptionDto dto = new InvestmentOptionDto();
                    dto.setSymbol(f.getBankName());
                    dto.setName(f.getBankName() + " FD (" + f.getTenureYears() + " Years)");
                    dto.setCategory("Fixed Deposit");
                    dto.setMinInvestment(f.getMinInvestment());
                    dto.setMaxInvestment(f.getMaxInvestment());
                    dto.setExpectedReturn(f.getInterestRate());
                    dto.setDescription("Guaranteed returns");
                    return dto;
                })
                .collect(Collectors.toList());
    }
}
