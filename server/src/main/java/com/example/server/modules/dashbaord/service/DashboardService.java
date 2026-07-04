package com.example.server.modules.dashbaord.service;

import com.example.server.modules.dashbaord.dto.DashboardMetrics;
import com.example.server.modules.dashbaord.dto.PendingInvoiceResponse;
import com.example.server.modules.dashbaord.dto.RecentTransactionResponse;
import com.example.server.modules.invoice.model.Invoice;
import com.example.server.modules.invoice.repository.InvoiceRepository;
import com.example.server.modules.ledger.model.LedgerEntry;
import com.example.server.modules.ledger.repository.LedgerEntryRepository;
import com.example.server.modules.customer.repository.CustomerRepository;
import com.example.server.modules.tenant.TenantContext;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.Sort;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final InvoiceRepository invoiceRepository;
    private final CustomerRepository customerRepository;
    private final RedisTemplate<String, Object> redisTemplate;
    private final ObjectMapper objectMapper;   // Inject ObjectMapper
    private final LedgerEntryRepository ledgerEntryRepository;

    private static final String DASHBOARD_KEY = "dashboard:metrics:";
    private static final long TTL_MINUTES = 5;

    public DashboardMetrics getMetrics() {
        Long companyId = TenantContext.getCurrentCompanyId();
        String cacheKey = DASHBOARD_KEY + companyId;

        try {
            // 1. Check Cache (Cache Aside)
            String cachedJson = (String) redisTemplate.opsForValue().get(cacheKey);

            if (cachedJson != null) {
                System.out.println("✅ Cache HIT for key: " + cacheKey);
                return objectMapper.readValue(cachedJson, DashboardMetrics.class);
            }

            System.out.println("❌ Cache MISS for key: " + cacheKey);

            // 2. Fetch from Database
            DashboardMetrics metrics = calculateMetrics(companyId);

            // 3. Cache the result (as JSON string)
            String jsonToCache = objectMapper.writeValueAsString(metrics);
            redisTemplate.opsForValue().set(cacheKey, jsonToCache, TTL_MINUTES, TimeUnit.MINUTES);

            return metrics;

        } catch (Exception e) {
            System.err.println("Redis error: " + e.getMessage());
            // Fallback to database if Redis fails
            return calculateMetrics(companyId);
        }
    }


    public List<RecentTransactionResponse> getRecentTransactions() {
        Long companyId = TenantContext.getCurrentCompanyId();
        Pageable pageable = PageRequest.of(0, 4, Sort.by("occurredAt").descending());

        Page<LedgerEntry> entries = ledgerEntryRepository.findByCompanyId(companyId, pageable);

        return entries.stream()
                .map(this::mapToRecentTransaction)
                .collect(Collectors.toList());
    }

    public List<PendingInvoiceResponse> getPendingInvoices() {
    Long companyId = TenantContext.getCurrentCompanyId();

    List<Invoice> invoices = invoiceRepository.findPendingInvoices(companyId);

    return invoices.stream()
            .map(this::mapToPendingInvoice)
            .collect(Collectors.toList());
}


    private DashboardMetrics calculateMetrics(Long companyId) {
        LocalDate today = LocalDate.now();

        return new DashboardMetrics(
                invoiceRepository.calculateRevenueToday(companyId, today),
                invoiceRepository.calculateOutstanding(companyId),
                invoiceRepository.countOverdue(companyId, LocalDateTime.now()),
                customerRepository.countByCompanyId(companyId)
        );
    }

    // Call this after any data change (payment, invoice update, etc.)
    public void invalidateCache() {
        Long companyId = TenantContext.getCurrentCompanyId();
        String cacheKey = DASHBOARD_KEY + companyId;
        redisTemplate.delete(cacheKey);
    }

    // Mapping methods
    private RecentTransactionResponse mapToRecentTransaction(LedgerEntry entry) {
        return new RecentTransactionResponse(
                entry.getId(),
                entry.getDescription(),
                entry.getAmount(),
                entry.getType().name(),
                entry.getOccurredAt(),
                entry.getPayment() != null ? entry.getPayment().getInvoice().getNumber() : null
        );
    }

    private PendingInvoiceResponse mapToPendingInvoice(Invoice invoice) {
        return new PendingInvoiceResponse(
                invoice.getId(),
                invoice.getNumber(),
                invoice.getTitle(),
                invoice.getAmount(),
                invoice.getDueAt(),
                invoice.getCustomer() != null ? invoice.getCustomer().getName() : null
        );
    }
}