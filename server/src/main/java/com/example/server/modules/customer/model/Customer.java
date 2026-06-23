package com.example.server.modules.customer.model;
import com.example.server.modules.company.model.Company;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;


@Entity
@Table(name = "customer")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Customer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "company_id", nullable = false)
    private Company company;

    @Column(unique = true, nullable = false)
    private Long uid;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String email;

    private String phone;

    @Column(name = "date_of", nullable = false)
    private LocalDateTime dateOf;

    @Column(name = "update_of", nullable = false)
    private LocalDateTime updateOf;

    @Builder.Default
    @Column(nullable = false)
    private String status = "true";
}
