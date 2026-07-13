package com.example.server.modules.ledger.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.example.server.common.enums.LedgerEntryType;
import com.example.server.modules.ledger.model.LedgerEntry;

public interface LedgerEntryRepository extends JpaRepository<LedgerEntry, Long> {

    Page<LedgerEntry> findByCompanyId(Long companyId, Pageable pageable);
    Page<LedgerEntry> findByCompanyIdAndType(Long companyId, String type, Pageable pageable);

    Page<LedgerEntry> findByCompanyIdAndType(Long companyId, LedgerEntryType type, Pageable pageable);

}
