package com.example.server.job;

import java.time.LocalDateTime;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.example.server.common.enums.InvoiceStatus;
import com.example.server.modules.dashbaord.service.DashboardService;
import com.example.server.modules.invoice.repository.InvoiceRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Component
@RequiredArgsConstructor
@Slf4j
public class OverdueInvoiceJob {

    private final InvoiceRepository invoiceRepository;
    private final DashboardService dashboardService;

    @Scheduled(cron = "0 0 2 * * *")  
    @Transactional
    public void checkOverdueInvoices() {
        System.out.println("🔄 Starting overdue invoice check job...");

        LocalDateTime now = LocalDateTime.now();

        int updatedCount = invoiceRepository.updateOverdueInvoices(InvoiceStatus.OVERDUE, now);

        if (updatedCount > 0) {
            dashboardService.invalidateCache();   // Clear dashboard cache
            System.out.println("✅ Updated {} invoices to OVERDUE status."+ updatedCount);
        } else {
            System.out.println("No overdue invoices found.");
        }

}

}
