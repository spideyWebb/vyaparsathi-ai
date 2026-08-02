package com.vyaparsathi.controller;

import com.vyaparsathi.dto.ApiResponse;
import com.vyaparsathi.model.ProductEntity;
import com.vyaparsathi.model.UserEntity;
import com.vyaparsathi.repository.ProductRepository;
import com.vyaparsathi.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/inventory")
@CrossOrigin(origins = "*")
public class InventoryController {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

    private UserEntity getOrSeedUser(String phone) {
        return userRepository.findByPhone(phone).orElseGet(() -> {
            UserEntity u = new UserEntity();
            u.setPhone(phone);
            u.setBusinessName("New Business");
            u.setIsVerified(true);
            return userRepository.save(u);
        });
    }

    @GetMapping("/products")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getProducts(
            @RequestHeader(value = "Authorization", required = false) String token,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) Boolean lowStockOnly) {

        UserEntity user = getOrSeedUser("9876543210");
        List<ProductEntity> list = productRepository.findByUserId(user.getId());

        // Zero-data policy: Do not auto-seed default products! Return clean list.
        List<Map<String, Object>> result = list.stream().map(p -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", p.getId().toString());
            map.put("name", p.getName());
            map.put("sku", p.getSku());
            map.put("category", p.getDescription() != null ? p.getDescription() : "Grocery");
            map.put("price", p.getSellingPrice().doubleValue());
            map.put("costPrice", p.getPurchasePrice().doubleValue());
            map.put("stock", p.getCurrentStock());
            map.put("minStockAlert", p.getReorderLevel());
            map.put("unit", p.getUnit());
            map.put("gstRate", p.getGstRate().intValue());
            map.put("updatedAt", p.getUpdatedAt().toLocalDate().toString());
            return map;
        }).collect(Collectors.toList());

        if (search != null && !search.isEmpty()) {
            String q = search.toLowerCase();
            result.removeIf(p -> !((String) p.get("name")).toLowerCase().contains(q) && !((String) p.get("sku")).toLowerCase().contains(q));
        }
        if (category != null && !category.equalsIgnoreCase("All")) {
            result.removeIf(p -> !category.equalsIgnoreCase((String) p.get("category")));
        }
        if (Boolean.TRUE.equals(lowStockOnly)) {
            result.removeIf(p -> (int) p.get("stock") > (int) p.get("minStockAlert"));
        }

        return ResponseEntity.ok(ApiResponse.success(result));
    }

    @PostMapping("/products")
    public ResponseEntity<ApiResponse<Map<String, Object>>> createProduct(@RequestBody Map<String, Object> body) {
        UserEntity user = getOrSeedUser("9876543210");
        ProductEntity p = new ProductEntity();
        p.setUserId(user.getId());
        p.setName((String) body.getOrDefault("name", "New Item"));
        p.setSku((String) body.getOrDefault("sku", "SKU-" + System.currentTimeMillis()));
        p.setDescription((String) body.getOrDefault("category", "Grocery"));
        p.setSellingPrice(BigDecimal.valueOf(((Number) body.getOrDefault("price", 100)).doubleValue()));
        p.setPurchasePrice(BigDecimal.valueOf(((Number) body.getOrDefault("costPrice", 80)).doubleValue()));
        p.setCurrentStock(((Number) body.getOrDefault("stock", 10)).intValue());
        p.setReorderLevel(((Number) body.getOrDefault("minStockAlert", 5)).intValue());
        p.setUnit((String) body.getOrDefault("unit", "Pack"));
        p.setGstRate(BigDecimal.valueOf(((Number) body.getOrDefault("gstRate", 5)).doubleValue()));

        ProductEntity saved = productRepository.save(p);
        body.put("id", saved.getId().toString());
        body.put("updatedAt", saved.getUpdatedAt().toLocalDate().toString());
        return ResponseEntity.ok(ApiResponse.success("Product created in database", body));
    }

    @PatchMapping("/products/{id}/stock")
    public ResponseEntity<ApiResponse<Map<String, Object>>> updateStock(
            @PathVariable String id,
            @RequestBody Map<String, Object> req) {

        int qty = req.containsKey("quantity") ? ((Number) req.get("quantity")).intValue() : 1;
        String type = req.containsKey("type") ? (String) req.get("type") : "ADD";

        try {
            UUID prodId = UUID.fromString(id);
            Optional<ProductEntity> pOpt = productRepository.findById(prodId);
            if (pOpt.isPresent()) {
                ProductEntity p = pOpt.get();
                int current = p.getCurrentStock();
                int updated = type.equals("ADD") ? current + qty : Math.max(0, current - qty);
                p.setCurrentStock(updated);
                productRepository.save(p);

                Map<String, Object> map = Map.of(
                    "id", p.getId().toString(),
                    "name", p.getName(),
                    "stock", p.getCurrentStock(),
                    "unit", p.getUnit()
                );
                return ResponseEntity.ok(ApiResponse.success("Stock updated in DB", map));
            }
        } catch (Exception ignored) {}

        return ResponseEntity.badRequest().body(ApiResponse.error("Product not found"));
    }

    @GetMapping("/reorder-suggestions")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getReorderSuggestions() {
        return ResponseEntity.ok(ApiResponse.success(Collections.emptyList()));
    }
}
