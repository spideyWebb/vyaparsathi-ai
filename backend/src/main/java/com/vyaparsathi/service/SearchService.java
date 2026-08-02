package com.vyaparsathi.service;

import com.vyaparsathi.dto.SearchDtos.SearchResult;
import com.vyaparsathi.model.InvoiceEntity;
import com.vyaparsathi.model.ProductEntity;
import com.vyaparsathi.repository.InvoiceRepository;
import com.vyaparsathi.repository.ProductRepository;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Value;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.UUID;

@Service
public class SearchService {

    private final ProductRepository productRepository;
    private final InvoiceRepository invoiceRepository;
    private final String searchMode;

    public SearchService(ProductRepository productRepository, InvoiceRepository invoiceRepository, @Value("${search.mode:postgres-fuzzy}") String searchMode) {
        this.productRepository = productRepository;
        this.invoiceRepository = invoiceRepository;
        this.searchMode = searchMode;
    }

    public List<SearchResult> search(String query, UUID userId, int limit) {
        String normalized = query == null ? "" : query.trim();
        if (normalized.isEmpty() || userId == null) {
            return List.of();
        }

        if (!"postgres-fuzzy".equalsIgnoreCase(searchMode)) {
            return searchInMemory(normalized, userId, limit);
        }

        List<SearchResult> results = new ArrayList<>();

        List<ProductEntity> products = productRepository.searchProducts(userId, normalized, limit);
        for (ProductEntity product : products) {
            results.add(new SearchResult(
                "product",
                product.getId() != null ? product.getId().toString() : null,
                product.getName(),
                buildProductSubtitle(product),
                scoreForProduct(product, normalized),
                "/inventory"
            ));
        }

        List<InvoiceEntity> invoices = invoiceRepository.searchInvoices(userId, normalized, limit);
        for (InvoiceEntity invoice : invoices) {
            results.add(new SearchResult(
                "invoice",
                invoice.getId() != null ? invoice.getId().toString() : null,
                invoice.getInvoiceNumber(),
                buildInvoiceSubtitle(invoice),
                scoreForInvoice(invoice, normalized),
                "/sales"
            ));
        }

        return results.stream()
            .sorted(Comparator.comparing(SearchResult::getScore, Comparator.nullsLast(Comparator.reverseOrder())))
            .limit(limit)
            .toList();
    }

    private List<SearchResult> searchInMemory(String query, UUID userId, int limit) {
        String needle = query.toLowerCase();
        List<SearchResult> results = new ArrayList<>();

        for (ProductEntity product : productRepository.findAll()) {
            if (!userId.equals(product.getUserId())) continue;
            boolean match = contains(product.getName(), needle) || contains(product.getSku(), needle) || contains(product.getDescription(), needle);
            if (match) {
                results.add(new SearchResult(
                    "product",
                    product.getId() != null ? product.getId().toString() : null,
                    product.getName(),
                    buildProductSubtitle(product),
                    scoreForProduct(product, needle),
                    "/inventory"
                ));
            }
        }

        for (InvoiceEntity invoice : invoiceRepository.findAll()) {
            if (!userId.equals(invoice.getUserId())) continue;
            boolean match = contains(invoice.getInvoiceNumber(), needle) || contains(invoice.getNotes(), needle) || contains(invoice.getStatus(), needle);
            if (match) {
                results.add(new SearchResult(
                    "invoice",
                    invoice.getId() != null ? invoice.getId().toString() : null,
                    invoice.getInvoiceNumber(),
                    buildInvoiceSubtitle(invoice),
                    scoreForInvoice(invoice, needle),
                    "/sales"
                ));
            }
        }

        return results.stream()
            .sorted(Comparator.comparing(SearchResult::getScore, Comparator.nullsLast(Comparator.reverseOrder())))
            .limit(limit)
            .toList();
    }

    private String buildProductSubtitle(ProductEntity product) {
        BigDecimal stock = BigDecimal.valueOf(product.getCurrentStock() != null ? product.getCurrentStock() : 0);
        return product.getSku() + " • Stock " + stock + " • Rs " + product.getSellingPrice();
    }

    private String buildInvoiceSubtitle(InvoiceEntity invoice) {
        return "Due " + invoice.getDueDate() + " • Status " + invoice.getStatus() + " • Rs " + invoice.getTotalAmount();
    }

    private Double scoreForProduct(ProductEntity product, String query) {
        double score = 0.0;
        if (product.getName() != null && product.getName().toLowerCase().contains(query.toLowerCase())) score += 1.0;
        if (product.getSku() != null && product.getSku().toLowerCase().contains(query.toLowerCase())) score += 0.8;
        if (product.getDescription() != null && product.getDescription().toLowerCase().contains(query.toLowerCase())) score += 0.5;
        return score;
    }

    private Double scoreForInvoice(InvoiceEntity invoice, String query) {
        double score = 0.0;
        if (invoice.getInvoiceNumber() != null && invoice.getInvoiceNumber().toLowerCase().contains(query.toLowerCase())) score += 1.0;
        if (invoice.getNotes() != null && invoice.getNotes().toLowerCase().contains(query.toLowerCase())) score += 0.4;
        return score;
    }

    private boolean contains(String value, String needle) {
        return value != null && value.toLowerCase().contains(needle);
    }
}
