package com.example.server.modules.company.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CompanyResponse {

    private Long id;
    private Long uid;
    private String name;
    private String currency;
    private String description;
    private String notice;
    private String status;
    private LocalDateTime dateOf;
    private LocalDateTime updateOf;
}