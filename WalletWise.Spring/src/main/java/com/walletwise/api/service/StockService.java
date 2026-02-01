package com.walletwise.api.service;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.walletwise.api.dto.InvestmentOptionDto;
import com.walletwise.api.dto.RiskBenefitDto;
import com.walletwise.api.model.InvestmentType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
public class StockService {

    @Autowired
    private MarketDataService marketDataService;

    private final RestTemplate restTemplate = new RestTemplate();
    private final String BASE_URL = "https://query1.finance.yahoo.com/v8/finance/chart/";

    public List<InvestmentOptionDto> getInvestmentSuggestions(InvestmentType type, BigDecimal maxBudget) {
        try {
            switch (type) {
                case SIP:
                    return marketDataService.getSipFunds(maxBudget);
                case Equity:
                    return getEquityWithLivePrices(maxBudget);
                case FD:
                    return marketDataService.getFixedDeposits(maxBudget);
                case Lumpsum:
                    List<InvestmentOptionDto> equities = getEquityWithLivePrices(maxBudget);
                    List<InvestmentOptionDto> fds = marketDataService.getFixedDeposits(maxBudget);
                    return Stream.concat(equities.stream(), fds.stream()).collect(Collectors.toList());
                default:
                    return new ArrayList<>();
            }
        } catch (Exception e) {
            e.printStackTrace();
            return new ArrayList<>();
        }
    }

    private List<InvestmentOptionDto> getEquityWithLivePrices(BigDecimal budget) {
        List<InvestmentOptionDto> equities = marketDataService.getEquityStocks(budget);
        for (InvestmentOptionDto eq : equities) {
            if (eq.getSymbol() == null) continue;
            BigDecimal price = getStockPrice(eq.getSymbol());
            if (price != null) {
                eq.setPrice(price);
                eq.setCurrentPrice(price);
                eq.setMinInvestment(price);
                eq.setMaxInvestment(price.multiply(BigDecimal.valueOf(100)));
            }
        }
        return equities;
    }

    public BigDecimal getStockPrice(String symbol) {
        if (!symbol.endsWith(".NS") && !symbol.contains(".")) {
             // Basic assumption for NSE if not provided, though .NET hardcoded symbols had suffix or logic
             // But here looking at .NET Service, it passed symbol directly.
             // If MarketDataService returns symbol like "TCS", we might need suffix for Yahoo.
             // But existing code passed it directly. Let's try direct first.
        }
        
        try {
            // Yahoo requires User-Agent
            org.springframework.http.HttpHeaders headers = new org.springframework.http.HttpHeaders();
            headers.add("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64)");
            org.springframework.http.HttpEntity<String> entity = new org.springframework.http.HttpEntity<>(headers);

            String url = BASE_URL + symbol + "?interval=1d&range=1d";
            ResponseEntity<YahooFinanceResponse> response = restTemplate.exchange(url, org.springframework.http.HttpMethod.GET, entity, YahooFinanceResponse.class);

            if (response.getBody() != null && response.getBody().chart != null 
                    && response.getBody().chart.result != null 
                    && !response.getBody().chart.result.isEmpty()) {
                Double price = response.getBody().chart.result.get(0).meta.regularMarketPrice;
                return price != null ? BigDecimal.valueOf(price) : null;
            }
        } catch (Exception e) {
            // Ignore logic
        }
        return null;
    }

    public RiskBenefitDto getRiskBenefit(InvestmentType type) {
        RiskBenefitDto dto = new RiskBenefitDto();
        switch (type) {
            case SIP:
                dto.setRiskLevel("Medium");
                dto.setBenefits(Arrays.asList("Rupee cost averaging", "Disciplined investing"));
                dto.setRisks(Arrays.asList("Market volatility", "No guaranteed returns"));
                break;
            case Equity:
                dto.setRiskLevel("High");
                dto.setBenefits(Arrays.asList("High growth potential", "Liquidity"));
                dto.setRisks(Arrays.asList("High volatility", "Capital loss risk"));
                break;
            case FD:
                dto.setRiskLevel("Low");
                dto.setBenefits(Arrays.asList("Guaranteed returns", "Capital safety"));
                dto.setRisks(Arrays.asList("Lower returns", "Inflation risk"));
                break;
            case Lumpsum:
                dto.setRiskLevel("Medium");
                dto.setBenefits(Arrays.asList("One-time investment", "Higher compounding potential", "Flexible asset allocation"));
                dto.setRisks(Arrays.asList("Market timing risk", "Short-term volatility"));
                break;
            default:
                break;
        }
        return dto;
    }

    public List<InvestmentOptionDto> getRealTimeInvestmentData(InvestmentType type, String searchTerm) {
        List<InvestmentOptionDto> options = new ArrayList<>();
        if (type != null && type != InvestmentType.Equity) {
            return options;
        }

        String[] stocks = {"RELIANCE.NS", "TCS.NS", "INFY.NS"};
        for (String symbol : stocks) {
            BigDecimal price = getStockPrice(symbol);
            if (price != null) {
                InvestmentOptionDto dto = new InvestmentOptionDto();
                dto.setSymbol(symbol);
                dto.setName(symbol.replace(".NS", ""));
                dto.setCategory("Equity");
                dto.setPrice(price);
                dto.setCurrentPrice(price);
                dto.setMinInvestment(price);
                dto.setMaxInvestment(price.multiply(BigDecimal.valueOf(100)));
                options.add(dto);
            }
        }
        return options;
    }

    // Inner classes for Yahoo Response
    @JsonIgnoreProperties(ignoreUnknown = true)
    private static class YahooFinanceResponse {
        @JsonProperty("chart")
        public ChartData chart;
    }
    @JsonIgnoreProperties(ignoreUnknown = true)
    private static class ChartData {
        @JsonProperty("result")
        public List<ResultData> result;
    }
    @JsonIgnoreProperties(ignoreUnknown = true)
    private static class ResultData {
        @JsonProperty("meta")
        public MetaData meta;
    }
    @JsonIgnoreProperties(ignoreUnknown = true)
    private static class MetaData {
        @JsonProperty("regularMarketPrice")
        public Double regularMarketPrice;
    }
}
