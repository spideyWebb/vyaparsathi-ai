package com.vyaparsathi.repository;

import com.vyaparsathi.model.OtpTokenEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface OtpTokenRepository extends JpaRepository<OtpTokenEntity, UUID> {
    Optional<OtpTokenEntity> findFirstByPhoneAndIsUsedFalseOrderByCreatedAtDesc(String phone);
}
