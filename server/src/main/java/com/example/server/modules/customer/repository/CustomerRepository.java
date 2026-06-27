package com.example.server.modules.customer.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.server.modules.customer.model.Customer;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, Long> {

    // Find customers by company
    Page<Customer> findByCompanyId(Long companyId, Pageable pageable);

    List<Customer> findByCompanyId(Long companyId);

    Optional<Customer> findByIdAndCompanyId(Long id, Long companyId);

    boolean existsByEmailAndCompanyId(String email, Long companyId);

    Page<Customer> findByCompanyIdAndNameContainingIgnoreCaseOrEmailContainingIgnoreCase(
            Long companyId, String name, String email, Pageable pageable);
}
