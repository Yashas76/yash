package com.example.spendmanagement.dto;

import java.math.BigDecimal;

public class MonthlySummary {
    private String month;          // "YYYY-MM"
    private String monthLabel;     // "June 2026"
    private BigDecimal totalSalary;
    private BigDecimal totalExpenses;
    private BigDecimal remaining;

    public MonthlySummary(String month, String monthLabel,
                          BigDecimal totalSalary, BigDecimal totalExpenses) {
        this.month = month;
        this.monthLabel = monthLabel;
        this.totalSalary = totalSalary;
        this.totalExpenses = totalExpenses;
        this.remaining = totalSalary.subtract(totalExpenses);
    }

    public String getMonth() { return month; }
    public String getMonthLabel() { return monthLabel; }
    public BigDecimal getTotalSalary() { return totalSalary; }
    public BigDecimal getTotalExpenses() { return totalExpenses; }
    public BigDecimal getRemaining() { return remaining; }
}
