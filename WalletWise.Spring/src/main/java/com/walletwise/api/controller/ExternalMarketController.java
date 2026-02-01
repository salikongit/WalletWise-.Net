package com.walletwise.api.controller;

import com.walletwise.api.service.YahooFinanceService;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

@RestController
@RequestMapping("/api/ExternalMarket")
@Tag(name = "ExternalMarket")
public class ExternalMarketController {

    @Autowired
    private YahooFinanceService yahooFinanceService;

    // Direct NSE scraping is flaky and depends on cookies, but implementing naive port
    @GetMapping("/nse-list")
    public ResponseEntity<?> getNseList() {
        try {
            RestTemplate restTemplate = new RestTemplate();
            HttpHeaders headers = new HttpHeaders();
            headers.add("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64)");
            headers.add("Accept", "application/json, text/plain, */*");
            
            HttpEntity<String> entity = new HttpEntity<>(headers);
            // NSE often blocks direct calls without cookie handshake. This might fail.
            // But we migrate logic as requested.
            String url = "https://www.nseindia.com/api/equity-stockIndices?index=NIFTY%2050";
            
            // Note: In real production this needs a proxy or browser automation logic for cookies
            ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, entity, String.class);
            return ResponseEntity.ok(response.getBody());
        } catch (Exception e) {
            // Return error but formatted as JSON
             return ResponseEntity.status(500).body("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }

    @GetMapping("/yahoo/{symbol}")
    public ResponseEntity<?> getYahooQuote(@PathVariable String symbol) {
        return ResponseEntity.ok(yahooFinanceService.getQuote(symbol));
    }
}
