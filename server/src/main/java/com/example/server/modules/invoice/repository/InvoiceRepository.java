package com.example.server.modules.invoice.repository;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.server.modules.invoice.model.Invoice;

@Repository
public interface InvoiceRepository extends JpaRepository<Invoice, Long> {

    Page<Invoice> findByCompanyId(Long companyId, Pageable pageable);

    Page<Invoice> findByCompanyIdAndStatus(Long companyId, String status, Pageable pageable);

    boolean existsByNumberAndCompanyId(String number, Long companyId);

    Optional<Invoice> findByIdAndCompanyId(Long id, Long companyId);
}
