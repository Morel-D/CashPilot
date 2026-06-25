package com.example.server.modules.company.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import com.example.server.modules.auth.model.User;
import com.example.server.modules.auth.repository.UserRepository;
import com.example.server.modules.company.dto.CompanyRequest;
import com.example.server.modules.company.model.Company;
import com.example.server.modules.company.repository.CompanyRepository;
import com.example.server.modules.tenant.TenantContext;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CompanyService {

    private final UserRepository userRepository;
    private final CompanyRepository companyRepository;

    public Company createCompanyForUser(Long userId, CompanyRequest request) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        Company company = Company.builder()
                .uid(System.currentTimeMillis()) 
                .name(request.getName())
                .currency(request.getCurrency())
                .description(request.getDescription())
                .notice(request.getNotice())
                .status("true")
                .dateOf(LocalDateTime.now())
                .updateOf(LocalDateTime.now())
                .owner(user)
                .build();

        Company savedCompany = companyRepository.save(company);

        // Set as current tenant
        TenantContext.setCurrentCompanyId(savedCompany.getId());

        return savedCompany;
    }

    @Transactional
    public Company createCompany(Long userId, CompanyRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        // Check if user already has a company with same name
        if (companyRepository.existsByNameAndOwnerId(request.getName(), userId)) {
            throw new IllegalArgumentException("Company with this name already exists");
        }

        Company company = Company.builder()
                .uid(System.currentTimeMillis()) // TODO: Improve UID generation later
                .name(request.getName())
                .currency(request.getCurrency())
                .description(request.getDescription())
                .notice(request.getNotice())
                .status("true")
                .dateOf(LocalDateTime.now())
                .updateOf(LocalDateTime.now())
                .owner(user)
                .build();

        Company savedCompany = companyRepository.save(company);

        // Set this company as current tenant for the current request
        TenantContext.setCurrentCompanyId(savedCompany.getId());

        return savedCompany;
    }

    public List<Company> getUserCompanies(Long userId) {
        return companyRepository.findByOwnerId(userId);
    }

    public Company getCompanyById(Long companyId, Long userId) {
        return companyRepository.findByIdAndOwnerId(companyId, userId)
                .orElseThrow(() -> new IllegalArgumentException("Company not found or access denied"));
    }


    public void switchCompany(Long companyId, Long userId) {
        Company company = getCompanyById(companyId, userId);
        TenantContext.setCurrentCompanyId(company.getId());
    }

}
