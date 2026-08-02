package com.vyaparsathi.controller;

import com.vyaparsathi.dto.ApiResponse;
import com.vyaparsathi.dto.SearchDtos.SearchResponse;
import com.vyaparsathi.service.SearchService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/search")
@CrossOrigin(origins = "*")
public class SearchController {

    private final SearchService searchService;

    public SearchController(SearchService searchService) {
        this.searchService = searchService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<SearchResponse>> search(
        @RequestParam String q,
        @RequestParam UUID userId,
        @RequestParam(defaultValue = "10") int limit
    ) {
        SearchResponse response = new SearchResponse(q, searchService.search(q, userId, Math.min(Math.max(limit, 1), 20)));
        return ResponseEntity.ok(ApiResponse.success("Search results", response));
    }
}
