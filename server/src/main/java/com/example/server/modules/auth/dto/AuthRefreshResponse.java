package com.example.server.modules.auth.dto;


import com.example.server.modules.company.dto.CompanyResponse;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AuthRefreshResponse {

    private String email;
    private String fullName;
    private CompanyResponse company;
}