package com.vyaparsathi.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.ZonedDateTime;
import java.util.UUID;

@Entity
@Table(name = "gst_returns")
public class GstReturnEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(nullable = false)
    private UUID userId;

    @Column(nullable = false, length = 20)
    private String returnType;

    @Column(nullable = false, length = 20)
    private String returnPeriod;

    @Column(nullable = false)
    private LocalDate filingDueDate;

    private LocalDate filingDate;
    private String status = "pending";

    private BigDecimal totalTaxable = BigDecimal.ZERO;
    private BigDecimal totalIgst = BigDecimal.ZERO;
    private BigDecimal totalCgst = BigDecimal.ZERO;
    private BigDecimal totalSgst = BigDecimal.ZERO;
    private BigDecimal totalCess = BigDecimal.ZERO;

    private String ackNumber;

    private ZonedDateTime createdAt = ZonedDateTime.now();

    public GstReturnEntity() {}

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public UUID getUserId() { return userId; }
    public void setUserId(UUID userId) { this.userId = userId; }
    public String getReturnType() { return returnType; }
    public void setReturnType(String returnType) { this.returnType = returnType; }
    public String getReturnPeriod() { return returnPeriod; }
    public void setReturnPeriod(String returnPeriod) { this.returnPeriod = returnPeriod; }
    public LocalDate getFilingDueDate() { return filingDueDate; }
    public void setFilingDueDate(LocalDate filingDueDate) { this.filingDueDate = filingDueDate; }
    public LocalDate getFilingDate() { return filingDate; }
    public void setFilingDate(LocalDate filingDate) { this.filingDate = filingDate; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public BigDecimal getTotalTaxable() { return totalTaxable; }
    public void setTotalTaxable(BigDecimal totalTaxable) { this.totalTaxable = totalTaxable; }
    public BigDecimal getTotalIgst() { return totalIgst; }
    public void setTotalIgst(BigDecimal totalIgst) { this.totalIgst = totalIgst; }
    public BigDecimal getTotalCgst() { return totalCgst; }
    public void setTotalCgst(BigDecimal totalCgst) { this.totalCgst = totalCgst; }
    public BigDecimal getTotalSgst() { return totalSgst; }
    public void setTotalSgst(BigDecimal totalSgst) { this.totalSgst = totalSgst; }
    public BigDecimal getTotalCess() { return totalCess; }
    public void setTotalCess(BigDecimal totalCess) { this.totalCess = totalCess; }
    public String getAckNumber() { return ackNumber; }
    public void setAckNumber(String ackNumber) { this.ackNumber = ackNumber; }
    public ZonedDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(ZonedDateTime createdAt) { this.createdAt = createdAt; }
}
