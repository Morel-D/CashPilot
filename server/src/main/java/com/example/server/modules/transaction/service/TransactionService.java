package com.example.server.modules.transaction.service;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.example.server.modules.ledger.model.LedgerEntry;
import com.example.server.modules.ledger.repository.LedgerEntryRepository;
import com.example.server.modules.tenant.TenantContext;
import com.example.server.modules.transaction.dto.TransactionResponse;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TransactionService {
    private final LedgerEntryRepository ledgerEntryRepository;

    public Page<TransactionResponse> getAllTransactions(Pageable pageable) {
        Long companyId = TenantContext.getCurrentCompanyId();

        Page<LedgerEntry> ledgerEntries = ledgerEntryRepository.findByCompanyId(companyId, pageable);

        return ledgerEntries.map(this::mapToResponse);
    }


    private TransactionResponse mapToResponse(LedgerEntry entry) {
        return new TransactionResponse(
                entry.getId(),
                entry.getUid(),
                entry.getType().name(),
                entry.getDescription(),
                entry.getAmount(),
                entry.getOccurredAt(),
                entry.getStatus(),
                entry.getPayment() != null ? entry.getPayment().getInvoice().getNumber() : null,
                entry.getPayment() != null && entry.getPayment().getInvoice().getCustomer() != null 
                    ? entry.getPayment().getInvoice().getCustomer().getName() 
                    : null
        );
    }
}
