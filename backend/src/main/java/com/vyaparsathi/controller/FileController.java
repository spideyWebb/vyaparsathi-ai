package com.vyaparsathi.controller;

import com.vyaparsathi.dto.ApiResponse;
import com.vyaparsathi.dto.SearchDtos.UploadResponse;
import com.vyaparsathi.service.DocumentStorageService;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/files")
@CrossOrigin(origins = "*")
public class FileController {

    private final DocumentStorageService storageService;

    public FileController(DocumentStorageService storageService) {
        this.storageService = storageService;
    }

    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<UploadResponse>> upload(
        @RequestParam("file") MultipartFile file,
        @RequestParam(value = "folder", defaultValue = "documents") String folder,
        @RequestParam(value = "ownerId", required = false) String ownerId
    ) {
        try {
            UploadResponse response = storageService.store(file, folder, ownerId);
            return ResponseEntity.ok(ApiResponse.success("File uploaded successfully", response));
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(ApiResponse.error(ex.getMessage()));
        }
    }

    @GetMapping("/{storageKey}")
    public ResponseEntity<ApiResponse<Map<String, String>>> getFileInfo(@PathVariable String storageKey) {
        return ResponseEntity.ok(ApiResponse.success(Map.of("storageKey", storageKey)));
    }
}
