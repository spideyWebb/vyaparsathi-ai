package com.vyaparsathi.service;

import org.springframework.beans.factory.ObjectProvider;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.Optional;

@Service
public class AiResponseCacheService {

    private final ObjectProvider<StringRedisTemplate> redisTemplateProvider;

    public AiResponseCacheService(ObjectProvider<StringRedisTemplate> redisTemplateProvider) {
        this.redisTemplateProvider = redisTemplateProvider;
    }

    public Optional<String> get(String key) {
        StringRedisTemplate redis = redisTemplateProvider.getIfAvailable();
        if (redis == null) {
            return Optional.empty();
        }

        try {
            return Optional.ofNullable(redis.opsForValue().get(key));
        } catch (Exception ex) {
            return Optional.empty();
        }
    }

    public void put(String key, String value, Duration ttl) {
        StringRedisTemplate redis = redisTemplateProvider.getIfAvailable();
        if (redis == null) {
            return;
        }

        try {
            redis.opsForValue().set(key, value, ttl);
        } catch (Exception ignored) {
        }
    }
}
