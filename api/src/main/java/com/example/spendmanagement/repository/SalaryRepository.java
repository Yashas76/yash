package com.example.spendmanagement.repository;

import com.example.spendmanagement.entity.Salary;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;

public interface SalaryRepository extends JpaRepository<Salary, UUID> {
}
