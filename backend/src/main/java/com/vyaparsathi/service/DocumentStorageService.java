package com.vyaparsathi.service;

import com.vyaparsathi.dto.SearchDtos.UploadResponse;
import org.springframework.web.multipart.MultipartFile;

public interface DocumentStorageService {
    UploadResponse store(MultipartFile file, String folder, String ownerId);
}
