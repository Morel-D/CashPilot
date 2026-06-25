package com.example.server.modules.auth.controller;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.server.common.api.ApiResponse;
import com.example.server.modules.auth.dto.AuthResponse;
import com.example.server.modules.auth.dto.LoginRequest;
import com.example.server.modules.auth.dto.RegisterRequest;
import com.example.server.modules.auth.service.AuthService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;


    @PostMapping("/register")
    public ResponseEntity<ApiResponse<AuthResponse>> register(@RequestBody RegisterRequest request) {
        AuthResponse response = authService.register(request);
        return ResponseEntity.ok(ApiResponse.success(response, "DONE"));
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(ApiResponse.success(response, "DONE"));
    }

    @PostMapping("/refresh")
    public ResponseEntity<ApiResponse<AuthResponse>> refreshToken(@RequestBody Map<String, String> request) {
    String refreshToken = request.get("refreshToken");
    
    if (refreshToken == null) {
        throw new IllegalArgumentException("REFRESH_TOKEN_REQUIRED");
    }

    AuthResponse response = authService.refreshToken(refreshToken);
    
    return ResponseEntity.ok(
        ApiResponse.success(response, "DONE")
    );
}

}
