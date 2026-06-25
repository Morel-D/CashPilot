package com.example.server.modules.company.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CompanyRequest {
    @NotBlank
    private String name;

    private String currency = "USD";
    private String description;
    private String notice;
}
