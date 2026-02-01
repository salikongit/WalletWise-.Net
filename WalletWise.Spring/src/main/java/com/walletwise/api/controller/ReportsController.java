package com.walletwise.api.controller;

import com.walletwise.api.repository.UserRepository;
import com.walletwise.api.service.PdfService;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@RestController
@RequestMapping({"/api/Reports", "/api/reports"})
@Tag(name = "Reports")
public class ReportsController {

    @Autowired
    private PdfService pdfService;
    @Autowired
    private UserRepository userRepository;

    private Integer getUserId(Authentication auth) {
        return userRepository.findByEmail(auth.getName()).orElseThrow().getUserId();
    }

    @GetMapping("/financial-report")
    public ResponseEntity<?> generateFinancialReport(Authentication auth) {
        try {
            Integer userId = getUserId(auth);
            byte[] pdfBytes = pdfService.generateFinancialReport(userId);
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            String filename = "FinancialReport_" + userId + "_" + LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd")) + ".pdf";
            headers.setContentDispositionFormData("attachment", filename);
            headers.setCacheControl("must-revalidate, post-check=0, pre-check=0");

            return new ResponseEntity<>(pdfBytes, headers, HttpStatus.OK);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }
}
