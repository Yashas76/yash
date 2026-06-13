package com.example.spendmanagement.controller;

import com.example.spendmanagement.dto.ExpenseRequest;
import com.example.spendmanagement.entity.Expense;
import com.example.spendmanagement.service.ExpenseService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/expenses")
public class ExpenseController {

    private final ExpenseService service;

    public ExpenseController(ExpenseService service) {
        this.service = service;
    }

    @GetMapping
    public List<Expense> getAll(@RequestParam(required = false) UUID categoryId) {
        if (categoryId != null) {
            return service.findByCategory(categoryId);
        }
        return service.findAll();
    }

    @GetMapping("/{id}")
    public Expense getById(@PathVariable UUID id) {
        return service.findById(id);
    }

    @PostMapping
    public ResponseEntity<Expense> create(@Valid @RequestBody ExpenseRequest request) {
        Expense expense = request.toExpense();
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(service.create(request.getCategoryId(), expense));
    }

    @PutMapping("/{id}")
    public Expense update(@PathVariable UUID id, @Valid @RequestBody ExpenseRequest request) {
        return service.update(id, request.getCategoryId(), request.toExpense());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
