package com.vyaparsathi.service;

import com.vyaparsathi.dto.SearchDtos.UploadResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnExpression;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Service
@ConditionalOnExpression("'${storage.provider:local}'.equalsIgnoreCase('local')")
public class LocalDocumentStorageService implements DocumentStorageService {

    @Value("${storage.provider:local}")
    private String provider;

    @Value("${storage.public-base-url:}")
    private String publicBaseUrl;

    @Value("${storage.local-dir:}")
    private String localDir;

    @Override
    public UploadResponse store(MultipartFile file, String folder, String ownerId) {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("File is required");
        }

        String safeFolder = folder == null || folder.isBlank() ? "misc" : folder.replaceAll("[^a-zA-Z0-9/_-]", "_");
        String safeOwner = ownerId == null || ownerId.isBlank() ? "public" : ownerId.replaceAll("[^a-zA-Z0-9_-]", "_");
        String original = file.getOriginalFilename() == null ? "upload.bin" : file.getOriginalFilename().replaceAll("[\\\\/]", "_");
        String storageKey = safeFolder + "/" + safeOwner + "/" + UUID.randomUUID() + "-" + original;

        try {
            String baseDir = (localDir == null || localDir.isBlank())
                ? System.getProperty("java.io.tmpdir") + "/vyaparsathi-storage"
                : localDir;
            Path root = Paths.get(baseDir);
            Path target = root.resolve(storageKey);
            Files.createDirectories(target.getParent());
            Files.write(target, file.getBytes());

            String url = buildPublicUrl(storageKey);
            return new UploadResponse(original, file.getContentType(), file.getSize(), storageKey, url);
        } catch (IOException ex) {
            throw new IllegalStateException("Unable to store file", ex);
        }
    }

    private String buildPublicUrl(String storageKey) {
        if (publicBaseUrl != null && !publicBaseUrl.isBlank()) {
            return publicBaseUrl.replaceAll("/$", "") + "/" + storageKey;
        }
        return "local://" + storageKey;
    }
}
