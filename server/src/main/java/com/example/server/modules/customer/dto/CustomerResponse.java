package com.example.server.modules.customer.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CustomerResponse {

    private Long id;
    private Long uid;
    private String name;
    private String email;
    private String phone;
    private String status;
    private LocalDateTime dateOf;
    private LocalDateTime updateOf;
}
