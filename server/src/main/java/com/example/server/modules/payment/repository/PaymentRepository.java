package com.example.server.modules.payment.repository;


import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.server.modules.payment.model.Payment;

import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {

    // Multi-Tenancy filtering
    Page<Payment> findByInvoiceCompanyId(Long companyId, Pageable pageable);

    Optional<Payment> findByIdAndInvoiceCompanyId(Long id, Long companyId);

    Page<Payment> findByInvoiceId(Long invoiceId, Pageable pageable);

    boolean existsByUid(Long uid);
}