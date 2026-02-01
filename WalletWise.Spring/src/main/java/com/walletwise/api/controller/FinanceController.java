package com.walletwise.api.controller;

import com.walletwise.api.dto.EmiCalculationDto;
import com.walletwise.api.dto.InvestmentCalculationDto;
import com.walletwise.api.service.FinancialCalculationService;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping({"/api/Finance", "/api/finance"})
@Tag(name = "Finance")
public class FinanceController {

    @Autowired
    private FinancialCalculationService calculationService;

    @PostMapping("/calculate-emi")
    public ResponseEntity<?> calculateEmi(@RequestBody EmiCalculationDto request) {
        try {
            return ResponseEntity.ok(calculationService.calculateEmi(request));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }

    @PostMapping("/calculate-investment")
    public ResponseEntity<?> calculateInvestment(@RequestBody InvestmentCalculationDto request) {
        try {
            return ResponseEntity.ok(calculationService.calculateInvestment(request));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }
}
