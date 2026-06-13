package com.example.spendmanagement.service;

import com.example.spendmanagement.entity.MonthlyBalance;
import com.example.spendmanagement.repository.ExpenseRepository;
import com.example.spendmanagement.repository.MonthlyBalanceRepository;
import com.example.spendmanagement.repository.SalaryRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.YearMonth;
import java.util.*;

@Service
public class MonthlyBalanceService {

    private final MonthlyBalanceRepository repo;
    private final ExpenseRepository expenseRepo;
    private final SalaryRepository salaryRepo;

    public MonthlyBalanceService(MonthlyBalanceRepository repo,
                                 ExpenseRepository expenseRepo,
                                 SalaryRepository salaryRepo) {
        this.repo = repo;
        this.expenseRepo = expenseRepo;
        this.salaryRepo = salaryRepo;
    }

    @Transactional
    public List<MonthlyBalance> recalculate() {
        // Sum expenses per month
        Map<YearMonth, BigDecimal> expByMonth = new HashMap<>();
        expenseRepo.findAll().forEach(e -> expByMonth.merge(
                YearMonth.from(e.getDate()), e.getAmount(), BigDecimal::add));

        // Sum salary per month
        Map<YearMonth, BigDecimal> salByMonth = new HashMap<>();
        salaryRepo.findAll().forEach(s -> salByMonth.merge(
                YearMonth.from(s.getDate()), s.getAmount(), BigDecimal::add));

        // All known months
        Set<YearMonth> months = new TreeSet<>();
        months.addAll(expByMonth.keySet());
        months.addAll(salByMonth.keySet());

        repo.deleteAll();

        List<MonthlyBalance> results = new ArrayList<>();
        for (YearMonth ym : months) {
            BigDecimal sal = salByMonth.getOrDefault(ym, BigDecimal.ZERO);
            BigDecimal exp = expByMonth.getOrDefault(ym, BigDecimal.ZERO);
            MonthlyBalance mb = new MonthlyBalance();
            mb.setDate(ym.atDay(1));
            mb.setAmount(sal.subtract(exp));
            results.add(repo.save(mb));
        }
        return results;
    }

    public List<MonthlyBalance> findAll() { return repo.findAll(); }

    public MonthlyBalance findById(UUID id) {
        return repo.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("MonthlyBalance not found: " + id));
    }

    public MonthlyBalance create(MonthlyBalance mb) { return repo.save(mb); }

    public MonthlyBalance update(UUID id, MonthlyBalance updated) {
        MonthlyBalance existing = findById(id);
        existing.setDate(updated.getDate());
        existing.setAmount(updated.getAmount());
        return repo.save(existing);
    }

    public void delete(UUID id) {
        findById(id);
        repo.deleteById(id);
    }
}
