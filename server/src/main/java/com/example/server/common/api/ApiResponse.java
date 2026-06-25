package com.example.server.common.api;

import java.time.LocalDateTime;

public class ApiResponse<T> {

    private boolean success;
    private T data;
    private String message;
    private Object errors;
    private LocalDateTime timestamp;
    
    public ApiResponse(boolean success, T data, String message, Object errors, LocalDateTime timestamp) {
        this.success = success;
        this.data = data;
        this.message = message;
        this.errors = errors;
        this.timestamp = timestamp;
    }


    // Success Response
    public static <T> ApiResponse<T> success(T data, String message) {
        return new ApiResponse<>(true, data, message, null, LocalDateTime.now());
    }


    // Error Response
    public static <T> ApiResponse<T> error(String message, Object errors) {
        return new ApiResponse<>(false, null, message, errors, LocalDateTime.now());
    }

    public boolean isSuccess() {
        return success;
    }
    public void setSuccess(boolean success) {
        this.success = success;
    }
    public T getData() {
        return data;
    }
    public void setData(T data) {
        this.data = data;
    }
    public String getMessage() {
        return message;
    }
    public void setMessage(String message) {
        this.message = message;
    }
    public Object getErrors() {
        return errors;
    }

    public void setErrors(Object errors) {
        this.errors = errors;
    }
    public LocalDateTime getTimestamp() {
        return timestamp;
    }
    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }


    
}
