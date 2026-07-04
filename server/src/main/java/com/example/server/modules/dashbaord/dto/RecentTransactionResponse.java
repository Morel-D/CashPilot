package com.example.server.modules.dashbaord.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class RecentTransactionResponse {
    private Long id;
    private String description;
    private BigDecimal amount;
    private String type;     
    private LocalDateTime occurredAt;
    private String invoiceNumber;
}
