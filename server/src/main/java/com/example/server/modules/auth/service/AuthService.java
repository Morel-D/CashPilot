package com.example.server.modules.auth.service;

import java.time.LocalDateTime;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.server.config.JwtUtil;
import com.example.server.modules.auth.dto.AuthResponse;
import com.example.server.modules.auth.dto.LoginRequest;
import com.example.server.modules.auth.dto.RegisterRequest;
import com.example.server.modules.auth.model.User;
import com.example.server.modules.auth.repository.UserRepository;
import com.example.server.modules.company.dto.CompanyRequest;
import com.example.server.modules.company.model.Company;
import com.example.server.modules.company.service.CompanyService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    private final CompanyService companyService;


    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email already exists");
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

        String token = jwtUtil.generateToken(user.getEmail(), company.getId());

        return new AuthResponse(token, user.getEmail(), company.getId(), user.getFullName());
    }



    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("Invalid credentials"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new IllegalArgumentException("Invalid credentials");
        }

        // For now use first company (will be enhanced)
        Long companyId = 1L;

        String token = jwtUtil.generateToken(user.getEmail(), companyId);

        return new AuthResponse(token, user.getEmail(), companyId, user.getFullName());
    }

}
