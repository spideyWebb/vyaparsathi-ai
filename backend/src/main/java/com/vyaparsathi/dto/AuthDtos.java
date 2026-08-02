package com.vyaparsathi.dto;

public class AuthDtos {

    public static class RegisterRequest {
        private String phone;
        private String email;
        private String ownerName;
        private String businessName;
        private String password;
        private String languagePref;

        public String getPhone() { return phone; }
        public void setPhone(String phone) { this.phone = phone; }
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getOwnerName() { return ownerName; }
        public void setOwnerName(String ownerName) { this.ownerName = ownerName; }
        public String getBusinessName() { return businessName; }
        public void setBusinessName(String businessName) { this.businessName = businessName; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
        public String getLanguagePref() { return languagePref; }
        public void setLanguagePref(String languagePref) { this.languagePref = languagePref; }
    }

    public static class LoginRequest {
        private String phone;
        private String password;

        public String getPhone() { return phone; }
        public void setPhone(String phone) { this.phone = phone; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
    }

    public static class VerifyOtpRequest {
        private String phone;
        private String otp;

        public String getPhone() { return phone; }
        public void setPhone(String phone) { this.phone = phone; }
        public String getOtp() { return otp; }
        public void setOtp(String otp) { this.otp = otp; }
    }

    public static class RefreshTokenRequest {
        private String refreshToken;

        public String getRefreshToken() { return refreshToken; }
        public void setRefreshToken(String refreshToken) { this.refreshToken = refreshToken; }
    }

    public static class UserDto {
        private String id;
        private String phone;
        private String email;
        private String ownerName;
        private String businessName;
        private String gstin;
        private String businessType;
        private String languagePref;
        private boolean isVerified;

        public UserDto() {}

        public UserDto(String id, String phone, String email, String ownerName, String businessName, String gstin, String businessType, String languagePref, boolean isVerified) {
            this.id = id;
            this.phone = phone;
            this.email = email;
            this.ownerName = ownerName;
            this.businessName = businessName;
            this.gstin = gstin;
            this.businessType = businessType;
            this.languagePref = languagePref;
            this.isVerified = isVerified;
        }

        public String getId() { return id; }
        public void setId(String id) { this.id = id; }
        public String getPhone() { return phone; }
        public void setPhone(String phone) { this.phone = phone; }
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getOwnerName() { return ownerName; }
        public void setOwnerName(String ownerName) { this.ownerName = ownerName; }
        public String getBusinessName() { return businessName; }
        public void setBusinessName(String businessName) { this.businessName = businessName; }
        public String getGstin() { return gstin; }
        public void setGstin(String gstin) { this.gstin = gstin; }
        public String getBusinessType() { return businessType; }
        public void setBusinessType(String businessType) { this.businessType = businessType; }
        public String getLanguagePref() { return languagePref; }
        public void setLanguagePref(String languagePref) { this.languagePref = languagePref; }
        public boolean isIsVerified() { return isVerified; }
        public void setIsVerified(boolean isVerified) { this.isVerified = isVerified; }
    }

    public static class AuthResponse {
        private String accessToken;
        private String refreshToken;
        private UserDto user;

        public AuthResponse() {}

        public AuthResponse(String accessToken, String refreshToken, UserDto user) {
            this.accessToken = accessToken;
            this.refreshToken = refreshToken;
            this.user = user;
        }

        public String getAccessToken() { return accessToken; }
        public void setAccessToken(String accessToken) { this.accessToken = accessToken; }
        public String getRefreshToken() { return refreshToken; }
        public void setRefreshToken(String refreshToken) { this.refreshToken = refreshToken; }
        public UserDto getUser() { return user; }
        public void setUser(UserDto user) { this.user = user; }
    }
}
