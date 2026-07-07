package com.example.server.common.handler;

import com.example.server.common.api.ApiResponse;

import org.slf4j.MDC;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<Object>> handleValidationError(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        for (FieldError error : ex.getBindingResult().getFieldErrors()) {
            errors.put(error.getField(), error.getDefaultMessage());
        }

        String correlationId = MDC.get("correlationId");

        return ResponseEntity.badRequest().body(
            ApiResponse.error("VALIDATION_FAILED", errors, correlationId)
        );
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ApiResponse<Object>> handleBusinessError(IllegalArgumentException ex) {

        String correlationId = MDC.get("correlationId");

        return ResponseEntity.badRequest().body(
            ApiResponse.error(ex.getMessage(), null, correlationId)
        );
    }

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<ApiResponse<Object>> handleBadCredentials(BadCredentialsException ex) {

        String correlationId = MDC.get("correlationId");

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(
            ApiResponse.error("INVALID_CREDENTIALS", null, correlationId)
        );
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ApiResponse<Object>> handleAccessDenied(AccessDeniedException ex) {

        String correlationId = MDC.get("correlationId");

        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(
            ApiResponse.error("ACCESS_DENIED", null, correlationId)
        );
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<Object>> handleGenericError(Exception ex) {
        ex.printStackTrace();

        String correlationId = MDC.get("correlationId");

        return ResponseEntity.internalServerError().body(
            ApiResponse.error("INTERNAL_SERVER_ERROR", null, correlationId)
        );
    }
}