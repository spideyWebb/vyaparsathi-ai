package com.vyaparsathi.repository;

import com.vyaparsathi.model.GstReturnEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface GstReturnRepository extends JpaRepository<GstReturnEntity, UUID> {
    List<GstReturnEntity> findByUserId(UUID userId);
}
