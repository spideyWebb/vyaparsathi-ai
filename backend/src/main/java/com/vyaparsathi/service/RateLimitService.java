package com.vyaparsathi.service;

import org.springframework.beans.factory.ObjectProvider;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;

@Service
public class RateLimitService {

    private final ObjectProvider<StringRedisTemplate> redisTemplateProvider;

    public RateLimitService(ObjectProvider<StringRedisTemplate> redisTemplateProvider) {
        this.redisTemplateProvider = redisTemplateProvider;
    }

    public boolean allow(String bucketKey, int limit, Duration window) {
        StringRedisTemplate redis = redisTemplateProvider.getIfAvailable();
        if (redis == null) {
            return true;
        }

        try {
            Long count = redis.opsForValue().increment(bucketKey);
            if (count != null && count == 1L) {
                redis.expire(bucketKey, window);
            }
            return count == null || count <= limit;
        } catch (Exception ex) {
            return true;
        }
    }
}
