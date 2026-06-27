package com.example.server.modules.payment.service;

import java.time.LocalDateTime;

import org.springframework.stereotype.Service;

import com.example.server.common.enums.InvoiceStatus;
import com.example.server.common.enums.LedgerEntryType;
import com.example.server.modules.invoice.model.Invoice;
import com.example.server.modules.invoice.repository.InvoiceRepository;
import com.example.server.modules.ledger.model.LedgerEntry;
import com.example.server.modules.payment.dto.PaymentRequest;
import com.example.server.modules.payment.dto.PaymentResponse;
import com.example.server.modules.payment.model.Payment;
import com.example.server.modules.payment.repository.PaymentRepository;
import com.example.server.modules.tenant.TenantContext;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final InvoiceRepository invoiceRepository;
    // private final LedgerEntryRepository ledgerEntryRepository;


    // Pay an invoice -> Creates Payment + Ledger Entry
    @Transactional
    public PaymentResponse payInvoice(PaymentRequest request) {
        Long companyId = TenantContext.getCurrentCompanyId();

        // 1. Get Invoice
        Invoice invoice = invoiceRepository.findByIdAndCompanyId(request.getInvoiceId(), companyId)
                .orElseThrow(() -> new IllegalArgumentException("NO_COMPANY_CONTEXT"));

        if (invoice.getStatus() == InvoiceStatus.PAID) {
            throw new IllegalArgumentException("INVOICE_PAID");
        }

        // 2. Create Payment
        Payment payment = Payment.builder()
                .uid(System.currentTimeMillis())
                .invoice(invoice)
                .amount(request.getPaidAmount())
                .method(request.getPaymentMethod())
                .paidAt(LocalDateTime.now())
                .status("true")
                .build();

        Payment savedPayment = paymentRepository.save(payment);


        // 3. Create Ledger Entry (Income)
        LedgerEntry ledgerEntry = LedgerEntry.builder()
                .uid(System.currentTimeMillis())
                .company(invoice.getCompany())
                .payment(savedPayment)
                .type(LedgerEntryType.CREDIT)
                .description("Payment for invoice #" + invoice.getNumber())
                .amount(request.getPaidAmount())
                .occurredAt(payment.getPaidAt())
                .status("true")
                .build();

        // ledgerEntryRepository.save(ledgerEntry);

        // 4. Update Invoice Status
        invoice.setStatus(InvoiceStatus.PAID);
        invoice.setUpdateOf(LocalDateTime.now());
        invoiceRepository.save(invoice);

        return mapToResponse(savedPayment);
    }


    private PaymentResponse mapToResponse(Payment payment) {
        return new PaymentResponse(
                payment.getId(),
                payment.getUid(),
                payment.getAmount(),
                payment.getMethod(),
                payment.getPaidAt(),
                payment.getStatus()
        );
    }

}
