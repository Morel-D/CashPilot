package com.example.server.modules.auth.service;

import java.time.LocalDateTime;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.server.config.JwtUtil;
import com.example.server.modules.auth.dto.AuthResponse;
import com.example.server.modules.auth.dto.LoginRequest;
import com.example.server.modules.auth.dto.RegisterRequest;
import com.example.server.modules.auth.model.RefreshToken;
import com.example.server.modules.auth.model.User;
import com.example.server.modules.auth.repository.RefreshTokenRepository;
import com.example.server.modules.auth.repository.UserRepository;
import com.example.server.modules.company.dto.CompanyRequest;
import com.example.server.modules.company.model.Company;
import com.example.server.modules.company.service.CompanyService;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    private final CompanyService companyService;


    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("EMAIL_ALREADY_EXIST");
        }

        User user = User.builder()
                .fullName(request.getFullName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .phone(request.getPhone())
                .dateOf(LocalDateTime.now())
                .updateOf(LocalDateTime.now())
                .build();

        user = userRepository.save(user);

        // Create first company for the user (basic)
        CompanyRequest companyRequest = new CompanyRequest();
        companyRequest.setName(request.getCompanyName());
        companyRequest.setCurrency(request.getCurrency());

        Company company = companyService.createCompanyForUser(user.getId(), companyRequest);

        // Generate Tokens
        String accessToken = jwtUtil.generateAccessToken(user.getEmail(), company.getId());
        String refreshTokenStr = jwtUtil.generateRefreshToken(user.getEmail());

        // Save Refresh Token
        RefreshToken refreshToken = RefreshToken.builder()
                .token(refreshTokenStr)
                .user(user)
                .expiryDate(LocalDateTime.now().plusDays(7))
                .build();

        refreshTokenRepository.save(refreshToken);

        return new AuthResponse(accessToken, refreshTokenStr, user.getEmail(), company.getId(), user.getFullName());
    }

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("INVALID_CREDENTIALS"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new IllegalArgumentException("INVALID_CREDENTIALS");
        }

        // TODO: Get user's first company
        Company company = user.getCompanies().stream().findFirst()
                .orElseThrow(() -> new IllegalArgumentException("NO_COMANY_FOUND"));

        Long companyId = company.getId();

        // Generate Tokens
        String accessToken = jwtUtil.generateAccessToken(user.getEmail(), companyId);
        String refreshTokenStr = jwtUtil.generateRefreshToken(user.getEmail());

        // Save Refresh Token
        RefreshToken refreshToken = RefreshToken.builder()
                .token(refreshTokenStr)
                .user(user)
                .expiryDate(LocalDateTime.now().plusDays(7))
                .build();

        refreshTokenRepository.save(refreshToken);

        return new AuthResponse(accessToken, refreshTokenStr, user.getEmail(), companyId, user.getFullName());
    }

    @Transactional
    public AuthResponse refreshToken(String refreshTokenStr) {

        // Find refresh token
        RefreshToken refreshToken = refreshTokenRepository.findByToken(refreshTokenStr)
                .orElseThrow(() -> new IllegalArgumentException("INVALID_REFRESH_TOKEN"));

        // Check if expired or revoked
        if (refreshToken.isExpired() || refreshToken.isRevoked()) {
            throw new IllegalArgumentException("REFRESH_TOKEN_EXPIRED");
        }

        User user = refreshToken.getUser();

        // Get user's current/first company
        Company company = user.getCompanies().stream().findFirst()
                .orElseThrow(() -> new IllegalArgumentException("NO_COMANY_FOUND"));

        // Generate new Access Token
        String newAccessToken = jwtUtil.generateAccessToken(user.getEmail(), company.getId());

        // Optional: Generate new Refresh Token (Refresh Token Rotation - more secure)
        String newRefreshToken = jwtUtil.generateRefreshToken(user.getEmail());

        // Revoke old refresh token
        refreshToken.setRevoked(true);
        refreshTokenRepository.save(refreshToken);

        // Save new refresh token
        RefreshToken newRefreshTokenEntity = RefreshToken.builder()
                .token(newRefreshToken)
                .user(user)
                .expiryDate(LocalDateTime.now().plusDays(7))
                .build();

        refreshTokenRepository.save(newRefreshTokenEntity);

        return new AuthResponse(
                newAccessToken, 
                newRefreshToken, 
                user.getEmail(), 
                company.getId(), 
                user.getFullName()
        );
    }

}
