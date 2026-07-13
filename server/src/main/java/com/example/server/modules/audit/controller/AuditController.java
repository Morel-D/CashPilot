package com.example.server.modules.audit.controller;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import com.example.server.common.api.ApiResponse;
import com.example.server.common.enums.AuditAction;
import com.example.server.modules.audit.model.AuditLog;
import com.example.server.modules.audit.service.AuditService;


import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/audit")
@RequiredArgsConstructor
public class AuditController {

    private final AuditService auditService;
    

    @GetMapping
    public ResponseEntity<ApiResponse<Page<AuditLog>>> getAuditLogs(
            @RequestParam(required = false) String action,
            @RequestParam(required = false) String entity,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fromDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate toDate,
            Pageable pageable) {

        Page<AuditLog> logs = auditService.getAuditLogs(action, entity, fromDate, toDate, pageable);

        return ResponseEntity.ok(
            ApiResponse.success(logs, "AUDIT_LOGS_RETRIEVED")
        );
    }



    @GetMapping("/search")
    public ResponseEntity<ApiResponse<Page<AuditLog>>> searchAuditLogs(
            @RequestParam(required = false) String action,
            @RequestParam(required = false) String entityType,
            @RequestParam(required = false) String search,
            @PageableDefault(size = 20) Pageable pageable) {


        Page<AuditLog> auditLogs = auditService.searchAuditLogs(
                action != null ? AuditAction.valueOf(action) : null,
                entityType, 
                search, 
                pageable
        );

        return ResponseEntity.ok(
            ApiResponse.success(auditLogs, "done")
        );
    }


    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<AuditLog>> getAuditLogById(@PathVariable Long id) {


        AuditLog auditLog = auditService.getAuditLogById(id).orElseThrow(() -> new IllegalArgumentException("AUDIT_NOT_FOUND"));

        return ResponseEntity.ok(
            ApiResponse.success(auditLog, "done")
        );
    }


    @GetMapping("/recent")
    public ResponseEntity<ApiResponse<List<AuditLog>>> getRecentActivity(
            @RequestParam(defaultValue = "10") int limit) {

        List<AuditLog> recentLogs = auditService.getRecentActivity(limit);

        return ResponseEntity.ok(
            ApiResponse.success(recentLogs, "done")
        );
    }

}
