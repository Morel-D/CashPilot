package com.example.server.modules.payment.model;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.example.server.modules.invoice.model.Invoice;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "payment")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "invoice_id", nullable = false)
    private Invoice invoice;

    @Column(unique = true, nullable = false)
    private Long uid;

    @Column(nullable = false)
    private BigDecimal amount;

    @Column(nullable = false)
    private String method;

    @Column(name = "paid_at", nullable = false)
    private LocalDateTime paidAt;

    @Builder.Default
    @Column(nullable = false)
    private String status = "true";
}
