package com.walletwise.api.controller;

import com.walletwise.api.service.MarketDataService;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/market")
@Tag(name = "Market")
public class MarketController {

    @Autowired
    private MarketDataService marketService;

    @GetMapping("/sip")
    public ResponseEntity<?> getSipFunds(@RequestParam BigDecimal monthlyAmount) {
        if (monthlyAmount.compareTo(BigDecimal.ZERO) <= 0) {
            return ResponseEntity.badRequest().body("{\"error\": \"Monthly amount must be greater than zero\"}");
        }
        return ResponseEntity.ok(marketService.getSipFunds(monthlyAmount));
    }

    @GetMapping("/equity")
    public ResponseEntity<?> getEquityStocks(@RequestParam BigDecimal budget) {
        if (budget.compareTo(BigDecimal.ZERO) <= 0) {
            return ResponseEntity.badRequest().body("{\"error\": \"Budget must be greater than zero\"}");
        }
        return ResponseEntity.ok(marketService.getEquityStocks(budget));
    }

    @GetMapping("/fd")
    public ResponseEntity<?> getFDs(@RequestParam BigDecimal amount) {
        if (amount.compareTo(BigDecimal.ZERO) <= 0) {
            return ResponseEntity.badRequest().body("{\"error\": \"Amount must be greater than zero\"}");
        }
        return ResponseEntity.ok(marketService.getFixedDeposits(amount));
    }

    @GetMapping("/equity/prices")
    public ResponseEntity<?> getEquityPrices() {
        List<Map<String, Object>> prices = new ArrayList<>();
        prices.add(Map.of("Name", "Tata Consultancy Services", "Price", 3850));
        prices.add(Map.of("Name", "Infosys Ltd", "Price", 1520));
        prices.add(Map.of("Name", "HDFC Bank", "Price", 1685));
        return ResponseEntity.ok(prices);
    }

    @GetMapping("/sip/nav")
    public ResponseEntity<?> getSipNav() {
        List<Map<String, Object>> navs = new ArrayList<>();
        navs.add(Map.of("Name", "HDFC SIP", "Nav", 102.45));
        navs.add(Map.of("Name", "ICICI SIP", "Nav", 98.30));
        navs.add(Map.of("Name", "Axis SIP", "Nav", 110.10));
        return ResponseEntity.ok(navs);
    }
}
