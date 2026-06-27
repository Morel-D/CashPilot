package com.example.server.modules.payment.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class PaymentRequest {

    @NotNull
    private Long invoiceId;

    @NotNull
    @Positive
    private BigDecimal paidAmount;

    @NotNull
    private String paymentMethod;
}