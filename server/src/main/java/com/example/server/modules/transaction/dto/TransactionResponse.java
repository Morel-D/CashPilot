package com.example.server.modules.transaction.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TransactionResponse {
private Long id;
    private Long uid;
    private String type; 
    private String description;
    private BigDecimal amount;
    private LocalDateTime occurredAt;
    private String status;
    private String invoiceNumber; 
    private String customerName;
}
