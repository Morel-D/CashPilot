package com.example.server.modules.dashbaord.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.server.common.api.ApiResponse;
import com.example.server.modules.dashbaord.dto.DashboardMetrics;
import com.example.server.modules.dashbaord.dto.PendingInvoiceResponse;
import com.example.server.modules.dashbaord.dto.RecentTransactionResponse;
import com.example.server.modules.dashbaord.service.DashboardService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/metrics")
    public ResponseEntity<ApiResponse<DashboardMetrics>> getMetrics() {
        DashboardMetrics metrics = dashboardService.getMetrics();

        return ResponseEntity.ok(
            ApiResponse.success(metrics, "DONE")
        );
    }

    @GetMapping("/recent-transactions")
    public ResponseEntity<ApiResponse<List<RecentTransactionResponse>>> getRecentTransactions() {
        List<RecentTransactionResponse> transactions = dashboardService.getRecentTransactions();
        return ResponseEntity.ok(
            ApiResponse.success(transactions, "DONE")
        );
    }

    @GetMapping("/pending-invoices")
    public ResponseEntity<ApiResponse<List<PendingInvoiceResponse>>> getPendingInvoices() {
        List<PendingInvoiceResponse> invoices = dashboardService.getPendingInvoices();
        return ResponseEntity.ok(
            ApiResponse.success(invoices, "DONE")
        );
    }

}
