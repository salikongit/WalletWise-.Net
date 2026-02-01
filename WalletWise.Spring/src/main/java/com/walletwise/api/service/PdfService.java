package com.walletwise.api.service;

import com.lowagie.text.*;
import com.lowagie.text.pdf.*;
import com.walletwise.api.dto.AmortizationScheduleDto;
import com.walletwise.api.dto.EmiCalculationDto;
import com.walletwise.api.dto.EmiResponseDto;
import com.walletwise.api.model.Expense;
import com.walletwise.api.model.Income;
import com.walletwise.api.model.Loan;
import com.walletwise.api.model.User;
import com.walletwise.api.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.awt.Color;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class PdfService {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private IncomeRepository incomeRepository;
    @Autowired
    private ExpenseRepository expenseRepository;
    @Autowired
    private LoanRepository loanRepository;
    @Autowired
    private FinancialCalculationService calculationService;

    public byte[] generateFinancialReport(Integer userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        List<Income> incomes = incomeRepository.findByUserId(userId);
        List<Expense> expenses = expenseRepository.findByUserId(userId);
        List<Loan> loans = loanRepository.findByUserId(userId);

        BigDecimal totalIncome = incomes.stream().map(Income::getAmount).reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal totalExpense = expenses.stream().map(Expense::getAmount).reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal savings = totalIncome.subtract(totalExpense);

        // Calculate EMIs
        BigDecimal totalMonthlyEmi = BigDecimal.ZERO;
        for (Loan loan : loans) {
            EmiResponseDto emiRes = calculationService.calculateEmi(new EmiCalculationDto(
                    loan.getPrincipalAmount(), loan.getInterestRate(), loan.getTenureMonths()
            ));
            totalMonthlyEmi = totalMonthlyEmi.add(emiRes.getEmiAmount());
        }
        BigDecimal savingsAfterEmi = savings.subtract(totalMonthlyEmi);

        try (ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Document document = new Document(PageSize.A4, 30, 30, 30, 30);
            PdfWriter writer = PdfWriter.getInstance(document, out);
            
            // Event helper for Watermark/Footer could be added here
            
            document.open();

            // HEADER
            PdfPTable headerTable = new PdfPTable(2);
            headerTable.setWidthPercentage(100);
            
            PdfPCell titleCell = new PdfPCell();
            titleCell.setBorder(Rectangle.NO_BORDER);
            titleCell.addElement(new Phrase("WalletWise", FontFactory.getFont(FontFactory.HELVETICA_BOLD, 22, new Color(25, 118, 210))));
            titleCell.addElement(new Phrase("Personal Finance & Investment Report", FontFactory.getFont(FontFactory.HELVETICA, 10, Color.GRAY)));
            headerTable.addCell(titleCell);

            PdfPCell dateCell = new PdfPCell(new Phrase("Generated: " + LocalDateTime.now().format(DateTimeFormatter.ofPattern("dd MMM yyyy")), FontFactory.getFont(FontFactory.HELVETICA, 9, Color.GRAY)));
            dateCell.setBorder(Rectangle.NO_BORDER);
            dateCell.setHorizontalAlignment(Element.ALIGN_RIGHT);
            dateCell.setVerticalAlignment(Element.ALIGN_MIDDLE);
            headerTable.addCell(dateCell);

            document.add(headerTable);
            document.add(new Paragraph("\n"));

            // USER INFO
            document.add(new Paragraph("Name: " + user.getFirstName() + " " + user.getLastName(), FontFactory.getFont(FontFactory.HELVETICA_BOLD)));
            document.add(new Paragraph("Email: " + user.getEmail()));
            document.add(new Paragraph("\n"));

            // SUMMARY TABLE (Simulating Box)
            PdfPTable summaryTable = new PdfPTable(1);
            summaryTable.setWidthPercentage(100);
            PdfPCell summaryCell = new PdfPCell();
            summaryCell.setBackgroundColor(new Color(245, 245, 245));
            summaryCell.setPadding(10);
            summaryCell.setBorder(Rectangle.NO_BORDER);

            summaryCell.addElement(new Paragraph("Financial Summary", FontFactory.getFont(FontFactory.HELVETICA_BOLD, 13)));
            summaryCell.addElement(new Paragraph("Total Income: ₹" + totalIncome));
            summaryCell.addElement(new Paragraph("Total Expenses: ₹" + totalExpense));
            summaryCell.addElement(new Paragraph("Savings: ₹" + savings));
            summaryCell.addElement(new Paragraph("Total Monthly EMI: ₹" + totalMonthlyEmi));
            
            Font savingsFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD);
            savingsFont.setColor(savingsAfterEmi.compareTo(BigDecimal.ZERO) >= 0 ? new Color(56, 142, 60) : new Color(211, 47, 47));
            summaryCell.addElement(new Paragraph("Savings After EMI: ₹" + savingsAfterEmi, savingsFont));
            
            summaryTable.addCell(summaryCell);
            document.add(summaryTable);
            document.add(new Paragraph("\n"));

            // VISUALIZATION (Simple Bar Chart)
            PdfContentByte canvas = writer.getDirectContent();
            float x = 36; // Left margin
            float y = writer.getVerticalPosition(true) - 20;
            float width = 520;
            float height = 20;

            if (totalIncome.compareTo(BigDecimal.ZERO) > 0) {
                // Background (Total Income)
                canvas.saveState();
                canvas.setColorFill(new Color(224, 224, 224)); // Grey
                canvas.rectangle(x, y, width, height);
                canvas.fill();
                
                // Expense Bar (Red)
                float expenseWidth = (totalExpense.divide(totalIncome, 2, java.math.RoundingMode.HALF_UP).floatValue()) * width;
                if (expenseWidth > width) expenseWidth = width;
                canvas.setColorFill(new Color(211, 47, 47));
                canvas.rectangle(x, y, expenseWidth, height);
                canvas.fill();

                // Savings Bar (Green) - Remaining
                float savingsWidth = width - expenseWidth;
                if (savingsWidth < 0) savingsWidth = 0;
                // canvas.setColorFill(new Color(56, 142, 60));
                // canvas.rectangle(x + expenseWidth, y, savingsWidth, height);
                // canvas.fill();
                
                // Text labels
                ColumnText.showTextAligned(canvas, Element.ALIGN_LEFT, new Phrase("Expenses (" + (expenseWidth/width*100) + "%)", FontFactory.getFont(FontFactory.HELVETICA, 8)), x + 2, y + 5, 0);
                // ColumnText.showTextAligned(canvas, Element.ALIGN_RIGHT, new Phrase("Savings", FontFactory.getFont(FontFactory.HELVETICA, 8)), x + width - 2, y + 5, 0);
                
                canvas.restoreState();
                
                document.add(new Paragraph("\n"));
                document.add(new Paragraph("\n")); // Space for the chart
            }

            // LOANS
            for (Loan loan : loans) {
                document.add(new Paragraph("Loan: " + loan.getLoanName(), FontFactory.getFont(FontFactory.HELVETICA_BOLD, 12)));
                document.add(new Paragraph(
                        String.format("Principal: ₹%s | Interest: %s%% | Tenure: %d months",
                                loan.getPrincipalAmount(), loan.getInterestRate(), loan.getTenureMonths()),
                        FontFactory.getFont(FontFactory.HELVETICA, 10)
                ));
                
                // Amortization Table
                EmiResponseDto emiRes = calculationService.calculateEmi(new EmiCalculationDto(
                        loan.getPrincipalAmount(), loan.getInterestRate(), loan.getTenureMonths()
                ));
                
                PdfPTable amoTable = new PdfPTable(5);
                amoTable.setWidthPercentage(100);
                amoTable.setSpacingBefore(5f);
                amoTable.setWidths(new float[]{1, 2, 2, 2, 2});

                addHeaderCell(amoTable, "Month");
                addHeaderCell(amoTable, "EMI");
                addHeaderCell(amoTable, "Principal");
                addHeaderCell(amoTable, "Interest");
                addHeaderCell(amoTable, "Balance");

                // Limit rows like .NET logic (first 12 + last 3 or similar)
                List<AmortizationScheduleDto> schedule = emiRes.getAmortizationSchedule();
                int count = 0;
                for (AmortizationScheduleDto row : schedule) {
                    count++;
                    if (schedule.size() > 15 && count > 12 && count < schedule.size() - 2) {
                        if (count == 13) {
                             PdfPCell cell = new PdfPCell(new Phrase("..."));
                             cell.setColspan(5);
                             cell.setHorizontalAlignment(Element.ALIGN_CENTER);
                             amoTable.addCell(cell);
                        }
                        continue;
                    }

                    addBodyCell(amoTable, row.getMonth().toString());
                    addBodyCell(amoTable, "₹" + row.getPrincipal().add(row.getInterest()));
                    addBodyCell(amoTable, "₹" + row.getPrincipal());
                    addBodyCell(amoTable, "₹" + row.getInterest());
                    addBodyCell(amoTable, "₹" + row.getBalance());
                }
                
                document.add(amoTable);
                document.add(new Paragraph("\n"));
            }

            document.close();
            return out.toByteArray();
        } catch (DocumentException | IOException e) {
            throw new RuntimeException("PDF Generation failed: " + e.getMessage());
        }
    }

    private void addHeaderCell(PdfPTable table, String text) {
        PdfPCell cell = new PdfPCell(new Phrase(text, FontFactory.getFont(FontFactory.HELVETICA_BOLD, 10)));
        cell.setBackgroundColor(new Color(224, 224, 224));
        cell.setHorizontalAlignment(Element.ALIGN_CENTER);
        cell.setPadding(5);
        table.addCell(cell);
    }

    private void addBodyCell(PdfPTable table, String text) {
        PdfPCell cell = new PdfPCell(new Phrase(text, FontFactory.getFont(FontFactory.HELVETICA, 9)));
        cell.setPadding(5);
        table.addCell(cell);
    }
}
