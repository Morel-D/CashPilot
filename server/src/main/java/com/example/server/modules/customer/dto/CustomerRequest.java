package com.example.server.modules.customer.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CustomerRequest {
    
    @NotBlank
    private String name;

    @NotBlank
    @Email
    private String email;

    private String phone;
}
