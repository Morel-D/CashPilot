package com.example.server.modules.company.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.server.common.api.ApiResponse;
import com.example.server.config.SecurityUtils;
import com.example.server.modules.company.dto.CompanyRequest;
import com.example.server.modules.company.model.Company;
import com.example.server.modules.company.service.CompanyService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/companies")
@RequiredArgsConstructor
public class CompanyController {

    private final CompanyService companyService;
    private final SecurityUtils securityUtils;

    @PostMapping
    public ResponseEntity<ApiResponse<Company>> createCompany(@RequestBody CompanyRequest request) {
        Long currentUserId = securityUtils.getCurrentUserId();

        Company company = companyService.createCompany(currentUserId, request);
        
        return ResponseEntity.ok(
            ApiResponse.success(company, "done")
        );
    }


    @GetMapping
    public ResponseEntity<ApiResponse<List<Company>>> getUserCompanies() {
        Long currentUserId = securityUtils.getCurrentUserId();

        List<Company> companies = companyService.getUserCompanies(currentUserId);
        
        return ResponseEntity.ok(
            ApiResponse.success(companies, "done")
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Company>> getCompanyById(@PathVariable Long id) {
        Long currentUserId = securityUtils.getCurrentUserId();

        Company company = companyService.getCompanyById(id, currentUserId);
        
        return ResponseEntity.ok(
            ApiResponse.success(company, "done")
        );
    }


    @PostMapping("/{id}/switch")
    public ResponseEntity<ApiResponse<String>> switchCompany(@PathVariable Long id) {
        Long currentUserId = securityUtils.getCurrentUserId();

        companyService.switchCompany(id, currentUserId);
        
        return ResponseEntity.ok(
            ApiResponse.success("Switched to company successfully", "done")
        );
    }

}
