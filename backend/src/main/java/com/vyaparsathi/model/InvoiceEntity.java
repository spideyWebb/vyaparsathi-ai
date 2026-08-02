package com.vyaparsathi.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.ZonedDateTime;
import java.util.UUID;

@Entity
@Table(name = "invoices")
public class InvoiceEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(nullable = false)
    private UUID userId;

    @Column(nullable = false, length = 50)
    private String invoiceNumber;

    private UUID customerId;

    @Column(nullable = false)
    private LocalDate invoiceDate;

    @Column(nullable = false)
    private LocalDate dueDate;

    @Column(nullable = false)
    private BigDecimal subtotal;

    private BigDecimal discountAmount = BigDecimal.ZERO;

    @Column(nullable = false)
    private BigDecimal taxableAmount;

    private BigDecimal cgstTotal = BigDecimal.ZERO;
    private BigDecimal sgstTotal = BigDecimal.ZERO;
    private BigDecimal igstTotal = BigDecimal.ZERO;

    @Column(nullable = false)
    private BigDecimal totalAmount;

    private BigDecimal amountPaid = BigDecimal.ZERO;
    private String status = "draft";
    private String paymentMode;
    private String upiTransactionId;
    private String notes;
    private String terms;
    private Boolean isGstInvoice = true;
    private String eWayBillNo;

    private ZonedDateTime createdAt = ZonedDateTime.now();

    public InvoiceEntity() {}

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public UUID getUserId() { return userId; }
    public void setUserId(UUID userId) { this.userId = userId; }
    public String getInvoiceNumber() { return invoiceNumber; }
    public void setInvoiceNumber(String invoiceNumber) { this.invoiceNumber = invoiceNumber; }
    public UUID getCustomerId() { return customerId; }
    public void setCustomerId(UUID customerId) { this.customerId = customerId; }
    public LocalDate getInvoiceDate() { return invoiceDate; }
    public void setInvoiceDate(LocalDate invoiceDate) { this.invoiceDate = invoiceDate; }
    public LocalDate getDueDate() { return dueDate; }
    public void setDueDate(LocalDate dueDate) { this.dueDate = dueDate; }
    public BigDecimal getSubtotal() { return subtotal; }
    public void setSubtotal(BigDecimal subtotal) { this.subtotal = subtotal; }
    public BigDecimal getDiscountAmount() { return discountAmount; }
    public void setDiscountAmount(BigDecimal discountAmount) { this.discountAmount = discountAmount; }
    public BigDecimal getTaxableAmount() { return taxableAmount; }
    public void setTaxableAmount(BigDecimal taxableAmount) { this.taxableAmount = taxableAmount; }
    public BigDecimal getCgstTotal() { return cgstTotal; }
    public void setCgstTotal(BigDecimal cgstTotal) { this.cgstTotal = cgstTotal; }
    public BigDecimal getSgstTotal() { return sgstTotal; }
    public void setSgstTotal(BigDecimal sgstTotal) { this.sgstTotal = sgstTotal; }
    public BigDecimal getIgstTotal() { return igstTotal; }
    public void setIgstTotal(BigDecimal igstTotal) { this.igstTotal = igstTotal; }
    public BigDecimal getTotalAmount() { return totalAmount; }
    public void setTotalAmount(BigDecimal totalAmount) { this.totalAmount = totalAmount; }
    public BigDecimal getAmountPaid() { return amountPaid; }
    public void setAmountPaid(BigDecimal amountPaid) { this.amountPaid = amountPaid; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getPaymentMode() { return paymentMode; }
    public void setPaymentMode(String paymentMode) { this.paymentMode = paymentMode; }
    public String getUpiTransactionId() { return upiTransactionId; }
    public void setUpiTransactionId(String upiTransactionId) { this.upiTransactionId = upiTransactionId; }
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
    public String getTerms() { return terms; }
    public void setTerms(String terms) { this.terms = terms; }
    public Boolean getIsGstInvoice() { return isGstInvoice; }
    public void setIsGstInvoice(Boolean isGstInvoice) { this.isGstInvoice = isGstInvoice; }
    public String geteWayBillNo() { return eWayBillNo; }
    public void seteWayBillNo(String eWayBillNo) { this.eWayBillNo = eWayBillNo; }
    public ZonedDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(ZonedDateTime createdAt) { this.createdAt = createdAt; }
}
