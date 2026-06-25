package com.example.server.modules.auth.model;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import com.example.server.modules.company.model.Company;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(name = "full_name", nullable = false)
    private String fullName;

    private String phone;

    @Builder.Default
    @Column(nullable = false)
    private String status = "true";

    @Column(name = "date_of", nullable = false)
    private LocalDateTime dateOf;

    @Column(name = "update_of", nullable = false)
    private LocalDateTime updateOf;

    // One user can own multiple companies
    @Builder.Default
    @OneToMany(mappedBy = "owner", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Company> companies = new ArrayList<>();

}
