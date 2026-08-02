package com.vyaparsathi.service;

import com.vyaparsathi.dto.AuthDtos.AuthResponse;
import com.vyaparsathi.dto.AuthDtos.LoginRequest;
import com.vyaparsathi.dto.AuthDtos.RegisterRequest;
import com.vyaparsathi.dto.AuthDtos.UserDto;
import com.vyaparsathi.model.UserEntity;
import com.vyaparsathi.repository.UserRepository;
import com.vyaparsathi.util.JwtTokenProvider;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final JwtTokenProvider jwtTokenProvider;
    private final PasswordEncoder passwordEncoder;

    public AuthService(UserRepository userRepository, JwtTokenProvider jwtTokenProvider, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.jwtTokenProvider = jwtTokenProvider;
        this.passwordEncoder = passwordEncoder;
    }

    public AuthResponse signup(RegisterRequest request) {
        String phone = normalizePhone(request.getPhone());
        if (phone == null) {
            throw new IllegalArgumentException("Phone number is required");
        }
        if (userRepository.existsByPhone(phone)) {
            throw new IllegalArgumentException("An account already exists for this phone number");
        }
        if (request.getPassword() == null || request.getPassword().trim().length() < 6) {
            throw new IllegalArgumentException("Password must be at least 6 characters");
        }

        UserEntity user = new UserEntity();
        user.setPhone(phone);
        user.setEmail(normalizeEmail(request.getEmail()));
        user.setOwnerName(emptyToNull(request.getOwnerName()));
        user.setBusinessName(defaultString(request.getBusinessName(), "New Business"));
        user.setLanguagePref(defaultString(request.getLanguagePref(), "hinglish"));
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setIsVerified(true);

        UserEntity saved = userRepository.save(user);
        return buildAuthResponse(saved, "Account created successfully");
    }

    public AuthResponse login(LoginRequest request) {
        String phone = normalizePhone(request.getPhone());
        if (phone == null || request.getPassword() == null) {
            throw new IllegalArgumentException("Phone and password are required");
        }

        UserEntity user = userRepository.findByPhone(phone)
            .orElseThrow(() -> new IllegalArgumentException("No account found for this phone number"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new IllegalArgumentException("Invalid password");
        }

        return buildAuthResponse(user, "Login successful");
    }

    public AuthResponse refresh(String refreshToken) {
        String subject = jwtTokenProvider.extractUsername(refreshToken);
        UserEntity user = userRepository.findByPhone(subject)
            .orElseThrow(() -> new IllegalArgumentException("User not found"));

        return buildAuthResponse(user, "Token refreshed");
    }

    public UserDto onboarding(UserDto request) {
        UserEntity user = userRepository.findByPhone(request.getPhone())
            .orElseThrow(() -> new IllegalArgumentException("User not found"));

        user.setBusinessName(defaultString(request.getBusinessName(), user.getBusinessName()));
        user.setGstin(request.getGstin());
        user.setBusinessType(request.getBusinessType());
        user.setLanguagePref(defaultString(request.getLanguagePref(), user.getLanguagePref()));
        user.setIsVerified(true);
        UserEntity saved = userRepository.save(user);
        return toDto(saved);
    }

    public AuthResponse verifyOtp(String phone) {
        String normalizedPhone = normalizePhone(phone);
        if (normalizedPhone == null) {
            throw new IllegalArgumentException("Phone number is required");
        }

        UserEntity user = userRepository.findByPhone(normalizedPhone).orElseGet(() -> {
            UserEntity created = new UserEntity();
            created.setPhone(normalizedPhone);
            created.setBusinessName("New Business");
            created.setLanguagePref("hinglish");
            created.setIsVerified(false);
            return userRepository.save(created);
        });

        return buildAuthResponse(user, "OTP verified successfully");
    }

    public String sendOtp(String phone) {
        return "OTP sent to +91 " + normalizePhone(phone);
    }

    private AuthResponse buildAuthResponse(UserEntity user, String message) {
        String phone = user.getPhone();
        String accessToken = jwtTokenProvider.generateToken(phone);
        String refreshToken = jwtTokenProvider.generateRefreshToken(phone);
        return new AuthResponse(accessToken, refreshToken, toDto(user));
    }

    private UserDto toDto(UserEntity user) {
        UUID id = user.getId();
        return new UserDto(
            id != null ? id.toString() : null,
            user.getPhone(),
            user.getEmail(),
            user.getOwnerName(),
            user.getBusinessName(),
            user.getGstin(),
            user.getBusinessType(),
            user.getLanguagePref(),
            Boolean.TRUE.equals(user.getIsVerified())
        );
    }

    private String normalizePhone(String phone) {
        if (phone == null) return null;
        String normalized = phone.trim();
        return normalized.isEmpty() ? null : normalized;
    }

    private String normalizeEmail(String email) {
        if (email == null) return null;
        String normalized = email.trim();
        return normalized.isEmpty() ? null : normalized.toLowerCase();
    }

    private String defaultString(String value, String fallback) {
        return value == null || value.trim().isEmpty() ? fallback : value.trim();
    }

    private String emptyToNull(String value) {
        if (value == null) return null;
        String trimmed = value.trim();
        return trimmed.isEmpty() ? null : trimmed;
    }
}
