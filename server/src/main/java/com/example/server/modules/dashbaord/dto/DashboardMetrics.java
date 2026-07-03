package com.example.server.modules.dashbaord.dto;

import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DashboardMetrics {
    private BigDecimal revenueToday;
    private BigDecimal outstandingAmount;
    private Long overdueInvoices;
    private Long totalCustomers;
}
