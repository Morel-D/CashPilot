package com.example.server.modules.audit.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.server.common.enums.AuditAction;
import com.example.server.modules.audit.model.AuditLog;

import java.time.LocalDateTime;
import java.util.List;

public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {

    // Basic queries with multi-tenancy
    Page<AuditLog> findByCompanyIdOrderByTimestampDesc(Long companyId, Pageable pageable);

    Page<AuditLog> findByCompanyIdAndActionInOrderByTimestampDesc(
            String companyId, 
            java.util.List<AuditAction> actions, 
            Pageable pageable);
    
    // Search by entity
    Page<AuditLog> findByCompanyIdAndEntityTypeAndEntityIdOrderByTimestampDesc(
            String companyId, String entityType, String entityId, Pageable pageable);
    
    // Date range filter
    Page<AuditLog> findByCompanyIdAndTimestampBetweenOrderByTimestampDesc(
            String companyId, LocalDateTime startDate, LocalDateTime endDate, Pageable pageable);

    // Combined search (most useful for UI)
    @Query("SELECT a FROM AuditLog a WHERE a.companyId = :companyId " +
           "AND (:action IS NULL OR a.action = :action) " +
           "AND (:entityType IS NULL OR a.entityType = :entityType) " +
           "AND (:search IS NULL OR LOWER(a.description) LIKE LOWER(CONCAT('%', :search, '%')) " +
           "OR LOWER(a.username) LIKE LOWER(CONCAT('%', :search, '%'))) " +
           "ORDER BY a.timestamp DESC")
    Page<AuditLog> searchAuditLogs(
            @Param("companyId") Long companyId,
            @Param("action") AuditAction action,
            @Param("entityType") String entityType,
            @Param("search") String search,
            Pageable pageable);

    // Recent activity (for dashboard)
    List<AuditLog> findTop50ByCompanyIdOrderByTimestampDesc(Long companyId);

    // Count by action type
    long countByCompanyIdAndAction(String companyId, AuditAction action);


    @Query("SELECT a FROM AuditLog a WHERE " +
           "(:action IS NULL OR a.action = :action) AND " +
           "(:entity IS NULL OR a.entityType = :entity) AND " +
           "a.timestamp >= :start AND a.timestamp < :end " +
           "ORDER BY a.timestamp DESC")
    Page<AuditLog> findAuditLogs(
            @Param("action") String action,
            @Param("entity") String entity,
            @Param("start") LocalDateTime start,
            @Param("end") LocalDateTime end,
            Pageable pageable);

}
