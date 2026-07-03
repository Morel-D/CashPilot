package com.example.server.modules.invoice.repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.example.server.modules.invoice.model.Invoice;

import io.lettuce.core.dynamic.annotation.Param;

@Repository
public interface InvoiceRepository extends JpaRepository<Invoice, Long> {

    // Dashboard Metrics Methods
    
@Query("SELECT COALESCE(SUM(i.amount), 0) FROM Invoice i " +
       "WHERE i.company.id = :companyId " +
       "AND i.status = 'PAID' " +
       "AND FUNCTION('DATE', i.issuedAt) = :today")
    BigDecimal calculateRevenueToday(@Param("companyId") Long companyId, @Param("today") LocalDate today);

    @Query("SELECT COALESCE(SUM(i.amount), 0) FROM Invoice i " +
           "WHERE i.company.id = :companyId AND i.status IN ('DRAFT', 'ISSUED', 'SENT', 'PARTIALLY_PAID')")
    BigDecimal calculateOutstanding(@Param("companyId") Long companyId);

    @Query("SELECT COUNT(i) FROM Invoice i " +
           "WHERE i.company.id = :companyId AND i.status != 'PAID' " +
           "AND i.dueAt < :now")
    Long countOverdue(@Param("companyId") Long companyId, @Param("now") LocalDateTime now);

    Page<Invoice> findByCompanyId(Long companyId, Pageable pageable);

    Page<Invoice> findByCompanyIdAndStatus(Long companyId, String status, Pageable pageable);

    boolean existsByNumberAndCompanyId(String number, Long companyId);

    Optional<Invoice> findByIdAndCompanyId(Long id, Long companyId);
}
