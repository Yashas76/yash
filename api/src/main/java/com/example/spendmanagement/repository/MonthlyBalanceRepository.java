package com.example.spendmanagement.repository;

import com.example.spendmanagement.entity.MonthlyBalance;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;

public interface MonthlyBalanceRepository extends JpaRepository<MonthlyBalance, UUID> {
}
