package com.example.server.modules.invoice.model;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.example.server.common.enums.InvoiceStatus;
import com.example.server.modules.company.model.Company;
import com.example.server.modules.customer.model.Customer;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "invoice")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Invoice {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "company_id", nullable = false)
    private Company company;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id", nullable = false)
    private Customer customer;

    @Column(unique = true, nullable = false)
    private Long uid;

    @Column(nullable = false)
    private String number;

    @Column(nullable = false)
    private String title; 

    private String description;

    @Column(nullable = false)
    private BigDecimal amount;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private InvoiceStatus status;

    @Column(name = "issued_at", nullable = false)
    private LocalDateTime issuedAt;

    @Column(name = "due_at", nullable = false)
    private LocalDateTime dueAt;

    @Column(name = "date_of", nullable = false)
    private LocalDateTime dateOf;

    @Column(name = "update_of", nullable = false)
    private LocalDateTime updateOf;
}
