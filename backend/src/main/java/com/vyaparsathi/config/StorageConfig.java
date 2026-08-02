package com.vyaparsathi.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.boot.autoconfigure.condition.ConditionalOnExpression;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.core.client.config.ClientOverrideConfiguration;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.S3Configuration;

import java.net.URI;
import java.time.Duration;

@Configuration
public class StorageConfig {

    @Bean
    @ConditionalOnExpression("'${storage.provider:local}'.equalsIgnoreCase('s3') || '${storage.provider:local}'.equalsIgnoreCase('r2')")
    public S3Client s3Client(
        @Value("${storage.region:ap-south-1}") String region,
        @Value("${storage.endpoint:}") String endpoint,
        @Value("${storage.access-key-id:}") String accessKeyId,
        @Value("${storage.secret-access-key:}") String secretAccessKey
    ) {
        S3Client.Builder builder = S3Client.builder()
            .region(Region.of(region))
            .serviceConfiguration(S3Configuration.builder().pathStyleAccessEnabled(true).build())
            .overrideConfiguration(ClientOverrideConfiguration.builder()
                .apiCallTimeout(Duration.ofSeconds(30))
                .build())
            .credentialsProvider(StaticCredentialsProvider.create(
                AwsBasicCredentials.create(accessKeyId, secretAccessKey)
            ));

        if (endpoint != null && !endpoint.isBlank()) {
            builder.endpointOverride(URI.create(endpoint));
        }

        return builder.build();
    }
}
