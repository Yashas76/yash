package com.example.spendmanagement.service;

import com.example.spendmanagement.dto.MonthlySummary;
import com.example.spendmanagement.entity.Salary;
import com.example.spendmanagement.repository.ExpenseRepository;
import com.example.spendmanagement.repository.SalaryRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
public class SalaryService {

    private final SalaryRepository repo;
    private final ExpenseRepository expenseRepo;

    public SalaryService(SalaryRepository repo, ExpenseRepository expenseRepo) {
        this.repo = repo;
        this.expenseRepo = expenseRepo;
    }

    public List<Salary> findAll() { return repo.findAll(); }

    public Salary findById(UUID id) {
        return repo.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Salary not found: " + id));
    }

    public Salary create(Salary salary) { return repo.save(salary); }

    public Salary update(UUID id, Salary updated) {
        Salary existing = findById(id);
        existing.setDate(updated.getDate());
        existing.setAmount(updated.getAmount());
        return repo.save(existing);
    }

    public void delete(UUID id) {
        findById(id);
        repo.deleteById(id);
    }

    public List<MonthlySummary> getMonthlySummary() {
        Map<YearMonth, BigDecimal> salByMonth = new TreeMap<>();
        repo.findAll().forEach(s -> salByMonth.merge(
                YearMonth.from(s.getDate()), s.getAmount(), BigDecimal::add));

        Map<YearMonth, BigDecimal> expByMonth = new HashMap<>();
        expenseRepo.findAll().forEach(e -> expByMonth.merge(
                YearMonth.from(e.getDate()), e.getAmount(), BigDecimal::add));

        Set<YearMonth> months = new TreeSet<>();
        months.addAll(salByMonth.keySet());
        months.addAll(expByMonth.keySet());

        DateTimeFormatter label = DateTimeFormatter.ofPattern("MMMM yyyy");
        DateTimeFormatter key   = DateTimeFormatter.ofPattern("yyyy-MM");

        List<MonthlySummary> result = new ArrayList<>();
        for (YearMonth ym : months) {
            result.add(new MonthlySummary(
                    ym.format(key),
                    ym.format(label),
                    salByMonth.getOrDefault(ym, BigDecimal.ZERO),
                    expByMonth.getOrDefault(ym, BigDecimal.ZERO)
            ));
        }
        return result;
    }
}
