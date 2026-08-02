package com.vyaparsathi.controller;

import com.vyaparsathi.dto.ApiResponse;
import com.vyaparsathi.model.ExpenseEntity;
import com.vyaparsathi.model.UserEntity;
import com.vyaparsathi.repository.ExpenseRepository;
import com.vyaparsathi.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/finance")
@CrossOrigin(origins = "*")
public class FinanceController {

    @Autowired
    private ExpenseRepository expenseRepository;

    @Autowired
    private UserRepository userRepository;

    private UserEntity getOrSeedUser() {
        return userRepository.findByPhone("9876543210").orElseGet(() -> {
            UserEntity u = new UserEntity();
            u.setPhone("9876543210");
            u.setBusinessName("New Business");
            u.setIsVerified(true);
            return userRepository.save(u);
        });
    }

    @GetMapping("/pnl")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getPnlReport() {
        UserEntity user = getOrSeedUser();
        List<ExpenseEntity> userExpenses = expenseRepository.findByUserId(user.getId());

        double totalOperatingExp = userExpenses.stream()
                .mapToDouble(e -> e.getAmount().doubleValue())
                .sum();

        double grossSales = 0;
        double cogs = 0;
        double grossProfit = grossSales - cogs;
        double netProfit = grossProfit - totalOperatingExp;
        double margin = grossSales > 0 ? (netProfit / grossSales) * 100 : 0;

        Map<String, Object> pnl = Map.of(
            "period", "Current Month",
            "grossSales", grossSales,
            "costOfGoodsSold", cogs,
            "grossProfit", grossProfit,
            "operatingExpenses", totalOperatingExp,
            "netProfit", netProfit,
            "profitMarginPercent", Math.round(margin * 100.0) / 100.0
        );

        return ResponseEntity.ok(ApiResponse.success(pnl));
    }

    @GetMapping("/expenses")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getExpenses() {
        UserEntity user = getOrSeedUser();
        List<ExpenseEntity> list = expenseRepository.findByUserId(user.getId());

        List<Map<String, Object>> result = list.stream().map(exp -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", exp.getId().toString());
            map.put("category", exp.getCategory());
            map.put("description", exp.getDescription());
            map.put("amount", exp.getAmount().doubleValue());
            map.put("date", exp.getExpenseDate().toString());
            map.put("paymentMode", exp.getPaymentMode());
            return map;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(ApiResponse.success(result));
    }

    @PostMapping("/expenses")
    public ResponseEntity<ApiResponse<Map<String, Object>>> createExpense(@RequestBody Map<String, Object> body) {
        UserEntity user = getOrSeedUser();
        ExpenseEntity e = new ExpenseEntity();
        e.setUserId(user.getId());
        e.setCategory((String) body.getOrDefault("category", "General"));
        e.setDescription((String) body.getOrDefault("description", "Store Expense"));
        e.setAmount(BigDecimal.valueOf(((Number) body.getOrDefault("amount", 500)).doubleValue()));
        e.setExpenseDate(LocalDate.now());
        e.setPaymentMode((String) body.getOrDefault("paymentMode", "UPI"));

        ExpenseEntity saved = expenseRepository.save(e);
        body.put("id", saved.getId().toString());
        body.put("date", saved.getExpenseDate().toString());

        return ResponseEntity.ok(ApiResponse.success("Expense logged in DB", body));
    }

    @GetMapping("/cashflow")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getCashFlow() {
        return ResponseEntity.ok(ApiResponse.success(Collections.emptyList()));
    }
}
