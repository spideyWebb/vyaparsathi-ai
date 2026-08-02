package com.vyaparsathi.model;

import jakarta.persistence.*;
import java.time.ZonedDateTime;
import java.util.UUID;

@Entity
@Table(name = "user_sessions")
public class OtpTokenEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(nullable = false)
    private String phone;

    @Column(nullable = false)
    private String otpCode;

    @Column(nullable = false)
    private ZonedDateTime expiresAt;

    private Boolean isUsed = false;

    private ZonedDateTime createdAt = ZonedDateTime.now();

    public OtpTokenEntity() {}

    public OtpTokenEntity(String phone, String otpCode, ZonedDateTime expiresAt) {
        this.phone = phone;
        this.otpCode = otpCode;
        this.expiresAt = expiresAt;
        this.isUsed = false;
        this.createdAt = ZonedDateTime.now();
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
    public String getOtpCode() { return otpCode; }
    public void setOtpCode(String otpCode) { this.otpCode = otpCode; }
    public ZonedDateTime getExpiresAt() { return expiresAt; }
    public void setExpiresAt(ZonedDateTime expiresAt) { this.expiresAt = expiresAt; }
    public Boolean getIsUsed() { return isUsed; }
    public void setIsUsed(Boolean isUsed) { this.isUsed = isUsed; }
    public ZonedDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(ZonedDateTime createdAt) { this.createdAt = createdAt; }
}
