package com.vyaparsathi.dto;

import java.util.List;

public class SearchDtos {

    public static class SearchResult {
        private String type;
        private String id;
        private String title;
        private String subtitle;
        private Double score;
        private String url;

        public SearchResult() {}

        public SearchResult(String type, String id, String title, String subtitle, Double score, String url) {
            this.type = type;
            this.id = id;
            this.title = title;
            this.subtitle = subtitle;
            this.score = score;
            this.url = url;
        }

        public String getType() { return type; }
        public void setType(String type) { this.type = type; }
        public String getId() { return id; }
        public void setId(String id) { this.id = id; }
        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }
        public String getSubtitle() { return subtitle; }
        public void setSubtitle(String subtitle) { this.subtitle = subtitle; }
        public Double getScore() { return score; }
        public void setScore(Double score) { this.score = score; }
        public String getUrl() { return url; }
        public void setUrl(String url) { this.url = url; }
    }

    public static class SearchResponse {
        private String query;
        private List<SearchResult> results;

        public SearchResponse() {}

        public SearchResponse(String query, List<SearchResult> results) {
            this.query = query;
            this.results = results;
        }

        public String getQuery() { return query; }
        public void setQuery(String query) { this.query = query; }
        public List<SearchResult> getResults() { return results; }
        public void setResults(List<SearchResult> results) { this.results = results; }
    }

    public static class UploadResponse {
        private String fileName;
        private String contentType;
        private long size;
        private String storageKey;
        private String url;

        public UploadResponse() {}

        public UploadResponse(String fileName, String contentType, long size, String storageKey, String url) {
            this.fileName = fileName;
            this.contentType = contentType;
            this.size = size;
            this.storageKey = storageKey;
            this.url = url;
        }

        public String getFileName() { return fileName; }
        public void setFileName(String fileName) { this.fileName = fileName; }
        public String getContentType() { return contentType; }
        public void setContentType(String contentType) { this.contentType = contentType; }
        public long getSize() { return size; }
        public void setSize(long size) { this.size = size; }
        public String getStorageKey() { return storageKey; }
        public void setStorageKey(String storageKey) { this.storageKey = storageKey; }
        public String getUrl() { return url; }
        public void setUrl(String url) { this.url = url; }
    }
}
