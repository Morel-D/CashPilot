package com.example.server.modules.dashbaord.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.server.common.api.ApiResponse;
import com.example.server.modules.dashbaord.dto.DashboardMetrics;
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

}
