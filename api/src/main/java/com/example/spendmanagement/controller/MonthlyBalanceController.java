package com.example.spendmanagement.controller;

import com.example.spendmanagement.entity.MonthlyBalance;
import com.example.spendmanagement.service.MonthlyBalanceService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/monthly-balance")
public class MonthlyBalanceController {

    private final MonthlyBalanceService service;

    public MonthlyBalanceController(MonthlyBalanceService service) {
        this.service = service;
    }

    @PostMapping("/recalculate")
    public List<MonthlyBalance> recalculate() {
        return service.recalculate();
    }

    @GetMapping
    public List<MonthlyBalance> getAll() { return service.findAll(); }

    @GetMapping("/{id}")
    public MonthlyBalance getById(@PathVariable UUID id) { return service.findById(id); }

    @PostMapping
    public ResponseEntity<MonthlyBalance> create(@Valid @RequestBody MonthlyBalance mb) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.create(mb));
    }

    @PutMapping("/{id}")
    public MonthlyBalance update(@PathVariable UUID id, @Valid @RequestBody MonthlyBalance mb) {
        return service.update(id, mb);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
