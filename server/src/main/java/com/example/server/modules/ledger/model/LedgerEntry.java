package com.example.server.modules.ledger.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.example.server.common.enums.LedgerEntryType;
import com.example.server.modules.company.model.Company;
import com.example.server.modules.payment.model.Payment;

@Entity
@Table(name = "ledger_entry")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LedgerEntry {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "company_id", nullable = false)
    private Company company;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "payment_id")
    private Payment payment;

    @Column(unique = true, nullable = false)
    private Long uid;

    @Enumerated(EnumType.STRING)
    @Column(name = "types", nullable = false)
    private LedgerEntryType type;

    private String description;

    @Column(nullable = false)
    private BigDecimal amount;

    @Column(name = "occurred_at")
    private LocalDateTime occurredAt;

    @Builder.Default
    @Column(nullable = false)
    private String status = "true";
}
