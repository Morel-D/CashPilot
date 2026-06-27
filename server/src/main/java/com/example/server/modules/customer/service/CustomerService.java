package com.example.server.modules.customer.service;

import java.time.LocalDateTime;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.example.server.modules.company.model.Company;
import com.example.server.modules.company.repository.CompanyRepository;
import com.example.server.modules.customer.dto.CustomerRequest;
import com.example.server.modules.customer.dto.CustomerResponse;
import com.example.server.modules.customer.model.Customer;
import com.example.server.modules.customer.repository.CustomerRepository;
import com.example.server.modules.tenant.TenantContext;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CustomerService {

    private final CustomerRepository customerRepository;
    private final CompanyRepository companyRepository;


    @Transactional
    public CustomerResponse createCustomer(CustomerRequest request) {
        Long currentCompanyId = TenantContext.getCurrentCompanyId();

        if (currentCompanyId == null) {
            throw new IllegalArgumentException("NO_COMPANY_CONTEXT");
        }

        // Check duplicate email in this company
        if (customerRepository.existsByEmailAndCompanyId(request.getEmail(), currentCompanyId)) {
            throw new IllegalArgumentException("CUSTOMER_EMAIL_EXIST");
        }

        Company company = companyRepository.findById(currentCompanyId)
            .orElseThrow(() -> new IllegalArgumentException("NO_COMPANY_FOUND"));

        Customer customer = Customer.builder()
                .company(company)
                .uid(System.currentTimeMillis())
                .name(request.getName())
                .email(request.getEmail())
                .phone(request.getPhone())
                .status("true")
                .dateOf(LocalDateTime.now())
                .updateOf(LocalDateTime.now())
                .build();

        Customer saved = customerRepository.save(customer);

        return mapToResponse(saved);
    }

    public Page<CustomerResponse> getAllCustomers(Pageable pageable) {
        Long currentCompanyId = TenantContext.getCurrentCompanyId();
        Page<Customer> customers = customerRepository.findByCompanyId(currentCompanyId, pageable);
        return customers.map(this::mapToResponse);
    }

    public CustomerResponse getCustomerById(Long id) {
        Long currentCompanyId = TenantContext.getCurrentCompanyId();
        Customer customer = customerRepository.findByIdAndCompanyId(id, currentCompanyId)
                .orElseThrow(() -> new IllegalArgumentException("CUSTOMER_NOT_FOUND"));
        return mapToResponse(customer);
    }


    @Transactional
    public CustomerResponse updateCustomer(Long id, CustomerRequest request) {
        Long currentCompanyId = TenantContext.getCurrentCompanyId();
        Customer customer = customerRepository.findByIdAndCompanyId(id, currentCompanyId)
                .orElseThrow(() -> new IllegalArgumentException("CUSTOMER_NOT_FOUND"));

        customer.setName(request.getName());
        customer.setEmail(request.getEmail());
        customer.setPhone(request.getPhone());
        customer.setUpdateOf(LocalDateTime.now());

        Customer updated = customerRepository.save(customer);
        return mapToResponse(updated);
    }

    @Transactional
    public void deleteCustomer(Long id) {
        Long currentCompanyId = TenantContext.getCurrentCompanyId();
        Customer customer = customerRepository.findByIdAndCompanyId(id, currentCompanyId)
                .orElseThrow(() -> new IllegalArgumentException("CUSTOMER_NOT_FOUND"));

        customerRepository.delete(customer);
    }
    
    
    private CustomerResponse mapToResponse(Customer customer) {
        return new CustomerResponse(
                customer.getId(),
                customer.getUid(),
                customer.getName(),
                customer.getEmail(),
                customer.getPhone(),
                customer.getStatus(),
                customer.getDateOf(),
                customer.getUpdateOf()
        );
    }


}
