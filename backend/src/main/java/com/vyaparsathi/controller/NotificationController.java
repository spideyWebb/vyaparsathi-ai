package com.vyaparsathi.controller;

import com.vyaparsathi.dto.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/notifications")
@CrossOrigin(origins = "*")
public class NotificationController {

    private final List<Map<String, Object>> notifications = new ArrayList<>();

    public NotificationController() {
        notifications.add(Map.of("id", "n_1", "title", "Low Stock Alert", "message", "Amul Butter 500g is down to 4 units!", "timestamp", "10 mins ago", "type", "WARNING", "isRead", false, "link", "/inventory"));
        notifications.add(Map.of("id", "n_2", "title", "Payment Received", "message", "Gupta General Store paid ₹5,057 via UPI", "timestamp", "1 hour ago", "type", "SUCCESS", "isRead", false, "link", "/sales"));
        notifications.add(Map.of("id", "n_3", "title", "GST Deadline Alert", "message", "GSTR-3B for July due in 12 days. Net liability: ₹6,500", "timestamp", "3 hours ago", "type", "ALERT", "isRead", true, "link", "/gst"));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getNotifications() {
        return ResponseEntity.ok(ApiResponse.success(notifications));
    }

    @GetMapping("/unread-count")
    public ResponseEntity<ApiResponse<Map<String, Integer>>> getUnreadCount() {
        long count = notifications.stream().filter(n -> !((Boolean) n.get("isRead"))).count();
        return ResponseEntity.ok(ApiResponse.success(Map.of("count", (int) count)));
    }

    @PatchMapping("/{id}/read")
    public ResponseEntity<ApiResponse<Map<String, Boolean>>> markAsRead(@PathVariable String id) {
        for (Map<String, Object> n : notifications) {
            if (id.equals(n.get("id"))) {
                Map<String, Object> updated = new HashMap<>(n);
                updated.put("isRead", true);
                return ResponseEntity.ok(ApiResponse.success(Map.of("success", true)));
            }
        }
        return ResponseEntity.ok(ApiResponse.success(Map.of("success", true)));
    }
}
