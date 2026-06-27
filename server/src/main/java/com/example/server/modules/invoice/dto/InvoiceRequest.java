package com.example.server.modules.invoice.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

@Data
public class InvoiceRequest {

    @NotBlank(message = "Invoice number is required")
    private String number;

    @NotBlank(message = "Title is required")
    private String title;

    private String description;

    @NotNull(message = "Amount is required")
    @Positive(message = "Amount must be positive")
    private BigDecimal amount;

    @NotNull(message = "Issued date is required")
    private LocalDateTime issuedAt;

    @NotNull(message = "Due date is required")
    private LocalDateTime dueAt;

    // Optional customer reference (we can expand later)
    private Long customerId;
}