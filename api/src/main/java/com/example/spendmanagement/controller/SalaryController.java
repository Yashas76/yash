package com.example.spendmanagement.controller;

import com.example.spendmanagement.dto.MonthlySummary;
import com.example.spendmanagement.entity.Salary;
import com.example.spendmanagement.service.SalaryService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/salary")
public class SalaryController {

    private final SalaryService service;

    public SalaryController(SalaryService service) {
        this.service = service;
    }

    @GetMapping
    public List<Salary> getAll() { return service.findAll(); }

    @GetMapping("/summary")
    public List<MonthlySummary> getSummary() { return service.getMonthlySummary(); }

    @GetMapping("/{id}")
    public Salary getById(@PathVariable UUID id) { return service.findById(id); }

    @PostMapping
    public ResponseEntity<Salary> create(@Valid @RequestBody Salary salary) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.create(salary));
    }

    @PutMapping("/{id}")
    public Salary update(@PathVariable UUID id, @Valid @RequestBody Salary salary) {
        return service.update(id, salary);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
