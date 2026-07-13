package com.example.server.modules.audit.service;

import org.springframework.transaction.annotation.Propagation;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.server.common.enums.AuditAction;
import com.example.server.modules.audit.model.AuditLog;
import com.example.server.modules.audit.repository.AuditLogRepository;
import com.example.server.modules.tenant.TenantContext;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuditService {

    private final AuditLogRepository auditLogRepository;

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void log(AuditAction action, String entityType, String entityId,
                    String description, String oldValue, String newValue,
                    String companyId, String userId, String username,
                    String ipAddress, String userAgent) {

                        AuditLog log = AuditLog.builder()
                            .companyId(companyId)
                            .userId(userId)
                            .username(username)
                            .action(action)
                            .entityType(entityType)
                            .entityId(entityId)
                            .description(description)
                            .oldValue(oldValue)
                            .newValue(newValue)
                            .ipAddress(ipAddress)
                            .userAgent(userAgent)
                            .build();
                            
                    auditLogRepository.save(log);
                        
                }

    public void logInvoiceCreated(String invoiceId, String description, String companyId, 
                                  String userId, String username, String ip, String userAgent) {
        log(AuditAction.INVOICE_CREATED, "Invoice", invoiceId, description, null, null,
            companyId, userId, username, ip, userAgent);
    }

    public void logInvoicePaid(String invoiceId, String description, String companyId, 
                               String userId, String username, String ip, String userAgent) {
        log(AuditAction.INVOICE_PAID, "Invoice", invoiceId, description, null, null,
            companyId, userId, username, ip, userAgent);
    }


    public void logCustomerCreated(String customerId, String description, String companyId, 
                                   String userId, String username, String ip, String userAgent) {
        log(AuditAction.CUSTOMER_CREATED, "Customer", customerId, description, null, null,
            companyId, userId, username, ip, userAgent);
    }


    public void logLogin(String userId, String username, String companyId, 
                         String ip, String userAgent) {
        log(AuditAction.LOGIN, "User", userId, "User logged in", null, null,
            companyId, userId, username, ip, userAgent);
    }



    // Get paginated audit logs for a company (most common use case)
    @Transactional(readOnly = true)
    public Page<AuditLog> getAuditLogs(Pageable pageable) {
        Long currentCompanyId = TenantContext.getCurrentCompanyId();
        return auditLogRepository.findByCompanyIdOrderByTimestampDesc(currentCompanyId, pageable);
    }



    @Transactional(readOnly = true)
    public Page<AuditLog> searchAuditLogs(
                                          AuditAction action,
                                          String entityType,
                                          String search,
                                          Pageable pageable) {
         Long currentCompanyId = TenantContext.getCurrentCompanyId();
        return auditLogRepository.searchAuditLogs(currentCompanyId, action, entityType, search, pageable);
    }

    @Transactional(readOnly = true)
    public Page<AuditLog> getAuditLogsByEntity(String companyId, String entityType, 
                                               String entityId, Pageable pageable) {
        return auditLogRepository.findByCompanyIdAndEntityTypeAndEntityIdOrderByTimestampDesc(
                companyId, entityType, entityId, pageable);
    }


    // Get a single audit record by ID (with company validation)
    @SuppressWarnings("unlikely-arg-type")
    @Transactional(readOnly = true)
    public Optional<AuditLog> getAuditLogById(Long auditLogId) {
        Long currentCompanyId = TenantContext.getCurrentCompanyId();
        Optional<AuditLog> log = auditLogRepository.findById(auditLogId);
        // Security: ensure the log belongs to the requesting company
        if (log.isPresent() && !log.get().getCompanyId().equals(currentCompanyId)) {
            return Optional.empty();
        }
        return log;
    }

    // Get recent activity (for dashboard)
    @Transactional(readOnly = true)
    public List<AuditLog> getRecentActivity(int limit) {
        Long currentCompanyId = TenantContext.getCurrentCompanyId();
        return auditLogRepository.findTop50ByCompanyIdOrderByTimestampDesc(currentCompanyId)
                .stream()
                .limit(limit)
                .toList();
    }

    public Page<AuditLog> getAuditLogs(
            String action, 
            String entity, 
            LocalDate fromDate, 
            LocalDate toDate, 
            Pageable pageable) {

        LocalDateTime start = (fromDate != null) ? fromDate.atStartOfDay() : LocalDate.now().atStartOfDay();
        LocalDateTime end = (toDate != null) ? toDate.plusDays(1).atStartOfDay() : LocalDate.now().plusDays(1).atStartOfDay();

        return auditLogRepository.findAuditLogs(
                action, entity, start, end, pageable);
    }


}
