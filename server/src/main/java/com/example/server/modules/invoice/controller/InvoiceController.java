package com.example.server.modules.invoice.controller;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.server.common.api.ApiResponse;
import com.example.server.modules.invoice.dto.InvoiceRequest;
import com.example.server.modules.invoice.dto.InvoiceResponse;
import com.example.server.modules.invoice.service.InvoiceService;
import com.example.server.modules.payment.dto.PaymentRequest;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/invoices")
@RequiredArgsConstructor
public class InvoiceController {

    private final InvoiceService invoiceService;

    // Create a new invoice (starts as DRAFT)
    @PostMapping
    public ResponseEntity<ApiResponse<InvoiceResponse>> createInvoice(@RequestBody InvoiceRequest request) {
        InvoiceResponse response = invoiceService.createInvoice(request);
        return ResponseEntity.ok(
            ApiResponse.success(response, "DONE")
        );
    }

    // Get all invoices with pagination
    @GetMapping
    public ResponseEntity<ApiResponse<Page<InvoiceResponse>>> getAllInvoices(Pageable pageable) {
        Page<InvoiceResponse> invoices = invoiceService.getAllInvoices(pageable);
        return ResponseEntity.ok(
            ApiResponse.success(invoices, "DONE")
        );
    }

    // Get invoice by ID
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<InvoiceResponse>> getInvoiceById(@PathVariable Long id) {
        InvoiceResponse response = invoiceService.getInvoiceById(id);
        return ResponseEntity.ok(
            ApiResponse.success(response, "DONE")
        );
    }

    // Issue an invoice (DRAFT → ISSUED)
    @PostMapping("/{id}/issue")
    public ResponseEntity<ApiResponse<InvoiceResponse>> issueInvoice(@PathVariable Long id) {
        InvoiceResponse response = invoiceService.issueInvoice(id);
        return ResponseEntity.ok(
            ApiResponse.success(response, "DONE")
        );
    }

    // Send an invoice (ISSUED → SENT)
    @PostMapping("/{id}/send")
    public ResponseEntity<ApiResponse<InvoiceResponse>> sendInvoice(@PathVariable Long id) {
        InvoiceResponse response = invoiceService.sendInvoice(id);
        return ResponseEntity.ok(
            ApiResponse.success(response, "DONE")
        );
    }

    // Mark invoice as paid
    @PostMapping("/{id}/pay")
    public ResponseEntity<ApiResponse<InvoiceResponse>> markAsPaid(@PathVariable Long id, @RequestBody PaymentRequest paymentRequest) {
        InvoiceResponse response = invoiceService.markAsPaid(id, paymentRequest);
        return ResponseEntity.ok(
            ApiResponse.success(response, "DONE")
        );
    }

    // Cancel invoice
    @PostMapping("/{id}/cancel")
    public ResponseEntity<ApiResponse<InvoiceResponse>> cancelInvoice(@PathVariable Long id) {
        InvoiceResponse response = invoiceService.cancelInvoice(id);
        return ResponseEntity.ok(
            ApiResponse.success(response, "DONE")
        );
    }


    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<InvoiceResponse>> updateInvoice(
        @PathVariable Long id, 
        @RequestBody InvoiceRequest request) {
    
    InvoiceResponse response = invoiceService.updateInvoice(id, request);
    
    return ResponseEntity.ok(
        ApiResponse.success(response, "DONE")
    );
}



}
