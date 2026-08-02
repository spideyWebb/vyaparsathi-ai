package com.vyaparsathi.service;

import com.vyaparsathi.dto.SearchDtos.UploadResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnExpression;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.io.IOException;
import java.util.UUID;

@Service
@ConditionalOnExpression("'${storage.provider:local}'.equalsIgnoreCase('s3') || '${storage.provider:local}'.equalsIgnoreCase('r2')")
public class CloudDocumentStorageService implements DocumentStorageService {

    private final S3Client s3Client;

    @Value("${storage.bucket:}")
    private String bucket;

    @Value("${storage.public-base-url:}")
    private String publicBaseUrl;

    public CloudDocumentStorageService(S3Client s3Client) {
        this.s3Client = s3Client;
    }

    @Override
    public UploadResponse store(MultipartFile file, String folder, String ownerId) {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("File is required");
        }
        if (bucket == null || bucket.isBlank()) {
            throw new IllegalArgumentException("STORAGE_BUCKET is required for cloud storage");
        }

        String safeFolder = folder == null || folder.isBlank() ? "documents" : folder.replaceAll("[^a-zA-Z0-9/_-]", "_");
        String safeOwner = ownerId == null || ownerId.isBlank() ? "public" : ownerId.replaceAll("[^a-zA-Z0-9_-]", "_");
        String original = file.getOriginalFilename() == null ? "upload.bin" : file.getOriginalFilename().replaceAll("[\\\\/]", "_");
        String storageKey = safeFolder + "/" + safeOwner + "/" + UUID.randomUUID() + "-" + original;

        try {
            PutObjectRequest request = PutObjectRequest.builder()
                .bucket(bucket)
                .key(storageKey)
                .contentType(file.getContentType())
                .build();

            s3Client.putObject(request, RequestBody.fromInputStream(file.getInputStream(), file.getSize()));
            return new UploadResponse(original, file.getContentType(), file.getSize(), storageKey, buildPublicUrl(storageKey));
        } catch (IOException ex) {
            throw new IllegalStateException("Unable to upload file", ex);
        }
    }

    private String buildPublicUrl(String storageKey) {
        if (publicBaseUrl != null && !publicBaseUrl.isBlank()) {
            return publicBaseUrl.replaceAll("/$", "") + "/" + storageKey;
        }
        return "s3://" + bucket + "/" + storageKey;
    }
}
