package com.vyaparsathi.agent;

import org.springframework.stereotype.Service;
import java.util.*;

@Service
public class SupervisorAgent {

    public String classifyIntent(String query) {
        String lower = query.toLowerCase();
        if (lower.contains("stock") || lower.contains("inventory") || lower.contains("item") || lower.contains("saman")) {
            return "inventory";
        }
        if (lower.contains("gst") || lower.contains("tax") || lower.contains("gstr") || lower.contains("return")) {
            return "gst";
        }
        if (lower.contains("sale") || lower.contains("bill") || lower.contains("invoice") || lower.contains("customer")) {
            return "sales";
        }
        if (lower.contains("profit") || lower.contains("expense") || lower.contains("pnl") || lower.contains("kharcha")) {
            return "finance";
        }
        return "general";
    }

    public Map<String, Object> processQuery(String query, String userId, String language) {
        String intent = classifyIntent(query);

        String responseText;
        List<Map<String, Object>> actions = null;

        switch (intent) {
            case "inventory":
                responseText = "Inventory Analysis: Fortune Mustard Oil (6 bottles left) aur Amul Butter (4 packs left) safety level se neeche hain. EOQ formula ke acccording 30 bottles order karna optimal hoga.";
                actions = List.of(Map.of("type", "RESTOCK", "payload", Map.of("productId", "p_2"), "label", "Order Stock Now"));
                break;
            case "gst":
                responseText = "GST Analysis: July 2026 period ke liye total tax liability ₹17,900 hai. ₹11,400 Input Tax Credit (ITC) offset ke baad net payable ₹6,500 banta hai (Due: 20 Aug).";
                actions = List.of(Map.of("type", "FILE_GST", "payload", Map.of("returnId", "ret_4"), "label", "View GST Liability"));
                break;
            case "sales":
                responseText = "Sales Analysis: Is hafte total sales +14.2% up chal rahi hai (₹2,45,000). 1 customer invoice (₹1,400) overdue hai.";
                actions = List.of(Map.of("type", "CREATE_INVOICE", "payload", Map.of(), "label", "Create Invoice"));
                break;
            case "finance":
                responseText = "Finance Analysis: Gross Profit ₹77,000 aur Operating Expenses ₹36,850. Net Profit ₹40,150 (Margin: 16.38%). Electricity bill me 12% spike notice hua hai.";
                break;
            default:
                responseText = "Namaste! Main VyaparSathi AI Supervisor Agent hoon. Main aapke business ki stock tracking, sales, finance aur GST compliance me help kar sakta hoon.";
                break;
        }

        Map<String, Object> result = new HashMap<>();
        result.put("intent", intent);
        result.put("response", responseText);
        if (actions != null) {
            result.put("actions", actions);
        }
        return result;
    }
}
