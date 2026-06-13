package com.example.spendmanagement.service;

import com.example.spendmanagement.entity.Category;
import com.example.spendmanagement.entity.Expense;
import com.example.spendmanagement.repository.ExpenseRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class ExpenseService {

    private final ExpenseRepository repo;
    private final CategoryService categoryService;

    public ExpenseService(ExpenseRepository repo, CategoryService categoryService) {
        this.repo = repo;
        this.categoryService = categoryService;
    }

    public List<Expense> findAll() {
        return repo.findAll();
    }

    public List<Expense> findByCategory(UUID categoryId) {
        return repo.findByCategoryId(categoryId);
    }

    public Expense findById(UUID id) {
        return repo.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Expense not found: " + id));
    }

    public Expense create(UUID categoryId, Expense expense) {
        Category category = categoryService.findById(categoryId);
        expense.setCategory(category);
        return repo.save(expense);
    }

    public Expense update(UUID id, UUID categoryId, Expense updated) {
        Expense existing = findById(id);
        Category category = categoryService.findById(categoryId);
        existing.setCategory(category);
        existing.setDate(updated.getDate());
        existing.setAmount(updated.getAmount());
        existing.setComment(updated.getComment());
        return repo.save(existing);
    }

    public void delete(UUID id) {
        findById(id);
        repo.deleteById(id);
    }
}
