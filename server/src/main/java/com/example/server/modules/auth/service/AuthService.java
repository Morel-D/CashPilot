package com.example.server.modules.auth.service;

import java.time.LocalDateTime;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.server.config.JwtUtil;
import com.example.server.config.SecurityUtils;
import com.example.server.modules.audit.service.AuditService;
import com.example.server.modules.auth.dto.AuthRefreshResponse;
import com.example.server.modules.auth.dto.AuthResponse;
import com.example.server.modules.auth.dto.LoginRequest;
import com.example.server.modules.auth.dto.RegisterRequest;
import com.example.server.modules.auth.model.RefreshToken;
import com.example.server.modules.auth.model.User;
import com.example.server.modules.auth.repository.RefreshTokenRepository;
import com.example.server.modules.auth.repository.UserRepository;
import com.example.server.modules.company.dto.CompanyRequest;
import com.example.server.modules.company.dto.CompanyResponse;
import com.example.server.modules.company.model.Company;
import com.example.server.modules.company.service.CompanyService;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    private final CompanyService companyService;
    private final AuditService auditService;
    private final SecurityUtils securityUtils;


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

        return new AuthResponse(accessToken, refreshTokenStr);
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

        // === AUDIT LOG ===
        auditService.logLogin(
                user.getId().toString(),
                user.getEmail(),
                companyId.toString(),
                securityUtils.getCurrentIpAddress(), 
                securityUtils.getCurrentUserAgent()
        );

        return new AuthResponse(accessToken, refreshTokenStr);
    }

    public AuthRefreshResponse refreshToken(String accessToken) {

        if (!jwtUtil.validateToken(accessToken)) {
                throw new IllegalArgumentException("Invalid or expired token");
        }

        String email = jwtUtil.extractEmail(accessToken);
        Long companyId = jwtUtil.extractCompanyId(accessToken);

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        // Get company and convert to response DTO
        Company company = user.getCompanies().stream()
                .filter(c -> c.getId().equals(companyId))
                .findFirst()
                .orElseGet(() -> user.getCompanies().get(0));

        CompanyResponse companyResponse = new CompanyResponse(
                company.getId(),
                company.getUid(),
                company.getName(),
                company.getCurrency(),
                company.getDescription(),
                company.getNotice(),
                company.getStatus(),
                company.getDateOf(),
                company.getUpdateOf()
        );

        return new AuthRefreshResponse(
                user.getEmail(),
                user.getFullName(),
                companyResponse
        );
        }
}
