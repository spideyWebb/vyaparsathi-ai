package com.vyaparsathi.controller;

import com.vyaparsathi.dto.ApiResponse;
import com.vyaparsathi.service.AiResponseCacheService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.time.Duration;

@RestController
@RequestMapping("/ai")
@CrossOrigin(origins = "*")
public class AiController {

    private final AiResponseCacheService cacheService;
    private final ObjectMapper objectMapper;

    public AiController(AiResponseCacheService cacheService, ObjectMapper objectMapper) {
        this.cacheService = cacheService;
        this.objectMapper = objectMapper;
    }

    @PostMapping("/chat")
    public ResponseEntity<ApiResponse<Map<String, Object>>> chat(@RequestBody Map<String, Object> req) {
        String message = req.containsKey("message") ? (String) req.get("message") : "";
        String cacheKey = cacheKey(message);
        Optional<String> cached = cacheService.get(cacheKey);
        if (cached.isPresent()) {
            try {
                @SuppressWarnings("unchecked")
                Map<String, Object> reply = objectMapper.readValue(cached.get(), Map.class);
                return ResponseEntity.ok(ApiResponse.success(reply));
            } catch (Exception ignored) {
            }
        }

        String lower = message.toLowerCase();

        String botText = "Namaste! Main aapka VyaparSathi AI assistant hoon. Main aapke business ki inventory, billing aur GST mein madad kar sakta hoon.";
        List<Map<String, Object>> actionItems = null;

        if (lower.contains("stock") || lower.contains("inventory") || lower.contains("saman")) {
            botText = "Aapke pass **Fortune Mustard Oil** (6 bottles left) aur **Amul Butter** (4 packs left) ka stock low hai. Kya main purchase order generate karoon?";
            actionItems = List.of(Map.of("type", "RESTOCK", "payload", Map.of("productId", "p_2"), "label", "Order Stock Now"));
        } else if (lower.contains("gst") || lower.contains("tax") || lower.contains("return")) {
            botText = "July 2026 ke liye aapki net GST liability **₹6,500** hai (ITC adjustment ke baad). Due date 20th August hai.";
            actionItems = List.of(Map.of("type", "FILE_GST", "payload", Map.of("returnId", "ret_4"), "label", "View GST Liability"));
        } else if (lower.contains("sale") || lower.contains("invoice") || lower.contains("bill")) {
            botText = "Aaj total sales **₹12,450** hui hai across 4 invoices. 1 payment ₹1,400 overdue chal rahi hai.";
            actionItems = List.of(Map.of("type", "CREATE_INVOICE", "payload", Map.of(), "label", "Create New Invoice"));
        }

        Map<String, Object> reply = new HashMap<>();
        reply.put("id", "msg_" + System.currentTimeMillis());
        reply.put("sender", "assistant");
        reply.put("text", botText);
        reply.put("timestamp", LocalTime.now().format(DateTimeFormatter.ofPattern("hh:mm a")));
        if (actionItems != null) {
            reply.put("actionItems", actionItems);
        }

        try {
            cacheService.put(cacheKey, objectMapper.writeValueAsString(reply), Duration.ofMinutes(15));
        } catch (Exception ignored) {
        }

        return ResponseEntity.ok(ApiResponse.success(reply));
    }

    @GetMapping("/recommendations")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getRecommendations() {
        List<Map<String, Object>> recs = List.of(
            Map.of("id", "rec_1", "title", "Increase Stock of Fortune Mustard Oil", "description", "Demand for oil expected to surge 25% due to festival season. Restock 30 bottles.", "category", "INVENTORY", "impactScore", "HIGH", "isRead", false, "actionUrl", "/inventory"),
            Map.of("id", "rec_2", "title", "Collect Overdue Payment from Verma Provision Store", "description", "Invoice #INV-2026-091 of ₹1,400 is overdue by 3 days.", "category", "SALES", "impactScore", "HIGH", "isRead", false, "actionUrl", "/sales"),
            Map.of("id", "rec_3", "title", "Input Tax Credit Optimization", "description", "Save approx ₹4,200 on GSTR-3B by reconciling 4 pending vendor invoices.", "category", "TAX_SAVING", "impactScore", "MEDIUM", "isRead", false, "actionUrl", "/gst")
        );
        return ResponseEntity.ok(ApiResponse.success(recs));
    }

    @PostMapping("/voice")
    public ResponseEntity<ApiResponse<Map<String, Object>>> voiceQuery() {
        Map<String, Object> reply = Map.of(
            "id", "v_msg_" + System.currentTimeMillis(),
            "sender", "assistant",
            "text", "Voice Query Received: 'Stock status check karo'. Current stock status: All 6 main categories updated.",
            "timestamp", LocalTime.now().format(DateTimeFormatter.ofPattern("hh:mm a"))
        );
        return ResponseEntity.ok(ApiResponse.success(reply));
    }

    private String cacheKey(String message) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(message.trim().toLowerCase().getBytes(StandardCharsets.UTF_8));
            StringBuilder sb = new StringBuilder("ai:chat:");
            for (byte b : hash) {
                sb.append(String.format("%02x", b));
            }
            return sb.toString();
        } catch (Exception ex) {
            return "ai:chat:" + message.trim().toLowerCase();
        }
    }
}
