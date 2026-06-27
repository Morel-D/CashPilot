package com.example.server.modules.invoice.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.example.server.common.enums.InvoiceStatus;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class InvoiceResponse {

    private Long id;
    private Long uid;
    private String number;
    private String title;
    private String description;
    private BigDecimal amount;
    private InvoiceStatus status;
    private LocalDateTime issuedAt;
    private LocalDateTime dueAt;
    private LocalDateTime dateOf;
    private LocalDateTime updateOf;
}