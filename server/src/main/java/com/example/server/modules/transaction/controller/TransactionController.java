package com.example.server.modules.transaction.controller;


import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.server.common.api.ApiResponse;
import com.example.server.modules.transaction.dto.TransactionResponse;
import com.example.server.modules.transaction.service.TransactionService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/transactions")
@RequiredArgsConstructor
public class TransactionController {

    private final TransactionService transactionService;
    
    @GetMapping
    public ResponseEntity<ApiResponse<Page<TransactionResponse>>> getAllTransactions(Pageable pageable) {
        Page<TransactionResponse> transactions = transactionService.getAllTransactions(pageable);
        
        return ResponseEntity.ok(
            ApiResponse.success(transactions, "DONE")
        );
    }
}
