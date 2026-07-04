package com.example.server.modules.dashbaord.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class PendingInvoiceResponse {
private Long id;
    private String number;
    private String title;
    private BigDecimal amount;
    private LocalDateTime dueAt;
    private String customerName;
}
