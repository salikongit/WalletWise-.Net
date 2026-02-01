package com.walletwise.api.service;

import com.walletwise.api.dto.InvestmentCalculationDto;
import com.walletwise.api.dto.InvestmentDto;
import com.walletwise.api.dto.InvestmentResponseDto;
import com.walletwise.api.model.Investment;
import com.walletwise.api.model.User;
import com.walletwise.api.repository.InvestmentRepository;
import com.walletwise.api.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class InvestmentService {

    @Autowired
    private InvestmentRepository investmentRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private FinancialCalculationService calculationService;
    @Autowired
    private UserService userService;

    public InvestmentDto createInvestment(Integer userId, InvestmentDto dto) {
        var dashboard = userService.getDashboard(userId);
        if (dto.getPrincipalAmount().compareTo(dashboard.getAvailableForInvestment()) > 0) {
            throw new RuntimeException("Investment amount exceeds available amount");
        }

        InvestmentResponseDto calc = calculationService.calculateInvestment(new InvestmentCalculationDto(
                dto.getPrincipalAmount(), dto.getExpectedReturnRate(), dto.getInvestmentPeriodYears(), dto.getInvestmentType()
        ));

        User user = userRepository.getReferenceById(userId);
        Investment investment = new Investment();
        investment.setUser(user);
        investment.setInvestmentName(dto.getInvestmentName());
        investment.setInvestmentType(dto.getInvestmentType());
        investment.setPrincipalAmount(dto.getPrincipalAmount());
        investment.setExpectedReturnRate(dto.getExpectedReturnRate());
        investment.setInvestmentPeriodYears(dto.getInvestmentPeriodYears());
        investment.setExpectedFutureValue(calc.getFutureValue());
        investment.setCreatedAt(LocalDateTime.now());

        investment = investmentRepository.save(investment);
        dto.setInvestmentId(investment.getInvestmentId());
        return dto;
    }
    
    public List<InvestmentDto> getUserInvestments(Integer userId) {
         return investmentRepository.findByUserId(userId).stream()
                 .map(i -> {
                     InvestmentDto investmentDto = new InvestmentDto();
                     investmentDto.setInvestmentId(i.getInvestmentId());
                     investmentDto.setInvestmentName(i.getInvestmentName());
                     investmentDto.setInvestmentType(i.getInvestmentType());
                     investmentDto.setPrincipalAmount(i.getPrincipalAmount());
                     investmentDto.setExpectedReturnRate(i.getExpectedReturnRate());
                     investmentDto.setInvestmentPeriodYears(i.getInvestmentPeriodYears());
                     return investmentDto;
                 })
                 .collect(Collectors.toList());
    }
}
