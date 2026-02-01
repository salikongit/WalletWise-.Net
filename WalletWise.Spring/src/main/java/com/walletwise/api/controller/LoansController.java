package com.walletwise.api.controller;

import com.walletwise.api.dto.LoanDto;
import com.walletwise.api.repository.UserRepository;
import com.walletwise.api.service.LoanService;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping({"/api/Loans", "/api/loans"})
@Tag(name = "Loans")
public class LoansController {

    @Autowired
    private LoanService loanService;
    @Autowired
    private UserRepository userRepository;

    private Integer getUserId(Authentication auth) {
        return userRepository.findByEmail(auth.getName()).orElseThrow().getUserId();
    }

    @GetMapping
    public ResponseEntity<List<LoanDto>> getLoans(Authentication auth) {
        return ResponseEntity.ok(loanService.getUserLoans(getUserId(auth)));
    }

    @PostMapping
    public ResponseEntity<LoanDto> createLoan(Authentication auth, @RequestBody LoanDto dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(loanService.createLoan(getUserId(auth), dto));
    }
    @GetMapping("/{id}/amortization")
    public ResponseEntity<com.walletwise.api.dto.AmortizationResponseWrapper> getLoanAmortization(@PathVariable Integer id) {
        return ResponseEntity.ok(new com.walletwise.api.dto.AmortizationResponseWrapper(loanService.getLoanAmortization(id)));
    }
}
