package com.vyaparsathi.config;

import com.vyaparsathi.service.RateLimitService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.time.Duration;

@Component
public class RateLimitFilter extends OncePerRequestFilter {

    private final RateLimitService rateLimitService;

    @Value("${app.rate-limit.auth-limit:20}")
    private int authLimit;

    @Value("${app.rate-limit.auth-window-seconds:60}")
    private int authWindowSeconds;

    @Value("${app.rate-limit.upload-limit:25}")
    private int uploadLimit;

    @Value("${app.rate-limit.upload-window-seconds:60}")
    private int uploadWindowSeconds;

    public RateLimitFilter(RateLimitService rateLimitService) {
        this.rateLimitService = rateLimitService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
        throws ServletException, IOException {

        if (!shouldLimit(request)) {
            filterChain.doFilter(request, response);
            return;
        }

        String bucketKey = bucketKey(request);
        int limit = isUpload(request) ? uploadLimit : authLimit;
        Duration window = Duration.ofSeconds(isUpload(request) ? uploadWindowSeconds : authWindowSeconds);

        if (!rateLimitService.allow(bucketKey, limit, window)) {
            response.setStatus(429);
            response.setContentType("application/json");
            response.getWriter().write("{\"success\":false,\"message\":\"Too many requests. Please try again later.\",\"data\":null}");
            return;
        }

        filterChain.doFilter(request, response);
    }

    private boolean shouldLimit(HttpServletRequest request) {
        String path = request.getRequestURI();
        return isAuth(request) || isUpload(request);
    }

    private boolean isAuth(HttpServletRequest request) {
        return "POST".equalsIgnoreCase(request.getMethod()) && request.getRequestURI().contains("/auth/");
    }

    private boolean isUpload(HttpServletRequest request) {
        return "POST".equalsIgnoreCase(request.getMethod()) && request.getRequestURI().contains("/files/upload");
    }

    private String bucketKey(HttpServletRequest request) {
        String ip = request.getHeader("X-Forwarded-For");
        if (ip == null || ip.isBlank()) {
            ip = request.getRemoteAddr();
        }
        return "rl:" + request.getMethod() + ":" + request.getRequestURI() + ":" + ip;
    }
}
