package com.example.server.modules.company.model;

import java.time.LocalDateTime;

import com.example.server.modules.auth.model.User;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "company")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Company {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private Long uid;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, length = 3)
    private String currency;

    private String description;
    private String notice;

    @Column(name = "date_of", nullable = false)
    private LocalDateTime dateOf;

    @Column(name = "update_of", nullable = false)
    private LocalDateTime updateOf;

    @Builder.Default
    @Column(nullable = false)
    private String status = "true";


    // === Multi-Tenancy Relationship ===
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_id", nullable = false)
    private User owner;
}
