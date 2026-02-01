package com.walletwise.api.controller;

import com.walletwise.api.dto.InvestmentDto;
import com.walletwise.api.dto.RiskBenefitDto;
import com.walletwise.api.repository.UserRepository;
import com.walletwise.api.service.InvestmentService;
import com.walletwise.api.service.StockService;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping({"/api/Investments", "/api/investments"})
@Tag(name = "Investments")
public class InvestmentsController {

    @Autowired
    private InvestmentService investmentService;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private StockService stockService;

    private Integer getUserId(Authentication auth) {
        return userRepository.findByEmail(auth.getName()).orElseThrow().getUserId();
    }

    @GetMapping
    public ResponseEntity<List<InvestmentDto>> getInvestments(Authentication auth) {
        return ResponseEntity.ok(investmentService.getUserInvestments(getUserId(auth)));
    }

    @PostMapping
    public ResponseEntity<?> createInvestment(Authentication auth, @RequestBody InvestmentDto dto) {
        try {
            return ResponseEntity.status(HttpStatus.CREATED).body(investmentService.createInvestment(getUserId(auth), dto));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/risk-benefit")
    public ResponseEntity<RiskBenefitDto> getRiskBenefit(@RequestParam("investmentType") Integer typeId) {
        // Convert integer (ordinal) to Enum
        // None=0, SIP=1, Lumpsum=2, Equity=3, FD=4
        if (typeId < 0 || typeId >= com.walletwise.api.model.InvestmentType.values().length) {
            return ResponseEntity.badRequest().build();
        }
        com.walletwise.api.model.InvestmentType type = com.walletwise.api.model.InvestmentType.values()[typeId];
        return ResponseEntity.ok(stockService.getRiskBenefit(type));
    }

    @GetMapping("/realtime")
    public ResponseEntity<List<com.walletwise.api.dto.InvestmentOptionDto>> getRealTimeData(
            @RequestParam(required = false) Integer investmentType,
            @RequestParam(required = false) String searchTerm
    ) {
        com.walletwise.api.model.InvestmentType type = null;
        if (investmentType != null && investmentType >= 0 && investmentType < com.walletwise.api.model.InvestmentType.values().length) {
            type = com.walletwise.api.model.InvestmentType.values()[investmentType];
        }
        return ResponseEntity.ok(stockService.getRealTimeInvestmentData(type, searchTerm));
    }
}
