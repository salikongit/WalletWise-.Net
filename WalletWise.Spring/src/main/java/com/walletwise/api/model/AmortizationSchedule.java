package com.walletwise.api.model;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "AmortizationSchedules")
public class AmortizationSchedule {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer scheduleId;

    @Column(name = "loan_id", insertable = false, updatable = false)
    private Integer loanId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "loan_id")
    private Loan loan;

    @Column(nullable = false)
    private Integer month;

    @Column(nullable = false, precision = 18, scale = 2)
    private BigDecimal principal;

    @Column(nullable = false, precision = 18, scale = 2)
    private BigDecimal interest;

    @Column(nullable = false, precision = 18, scale = 2)
    private BigDecimal balance;

    public AmortizationSchedule() {
    }

    public AmortizationSchedule(Integer scheduleId, Integer loanId, Loan loan, Integer month, BigDecimal principal, BigDecimal interest, BigDecimal balance) {
        this.scheduleId = scheduleId;
        this.loanId = loanId;
        this.loan = loan;
        this.month = month;
        this.principal = principal;
        this.interest = interest;
        this.balance = balance;
    }

    public Integer getScheduleId() {
        return scheduleId;
    }

    public void setScheduleId(Integer scheduleId) {
        this.scheduleId = scheduleId;
    }

    public Integer getLoanId() {
        return loanId;
    }

    public void setLoanId(Integer loanId) {
        this.loanId = loanId;
    }

    public Loan getLoan() {
        return loan;
    }

    public void setLoan(Loan loan) {
        this.loan = loan;
    }

    public Integer getMonth() {
        return month;
    }

    public void setMonth(Integer month) {
        this.month = month;
    }

    public BigDecimal getPrincipal() {
        return principal;
    }

    public void setPrincipal(BigDecimal principal) {
        this.principal = principal;
    }

    public BigDecimal getInterest() {
        return interest;
    }

    public void setInterest(BigDecimal interest) {
        this.interest = interest;
    }

    public BigDecimal getBalance() {
        return balance;
    }

    public void setBalance(BigDecimal balance) {
        this.balance = balance;
    }
}
