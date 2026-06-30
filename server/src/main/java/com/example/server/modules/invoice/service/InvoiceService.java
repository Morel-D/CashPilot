package com.example.server.modules.invoice.service;
import java.time.LocalDateTime;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.example.server.common.enums.InvoiceStatus;
import com.example.server.common.enums.LedgerEntryType;
import com.example.server.modules.company.model.Company;
import com.example.server.modules.company.repository.CompanyRepository;
import com.example.server.modules.customer.dto.CustomerResponse;
import com.example.server.modules.customer.model.Customer;
import com.example.server.modules.customer.repository.CustomerRepository;
import com.example.server.modules.invoice.dto.InvoiceRequest;
import com.example.server.modules.invoice.dto.InvoiceResponse;
import com.example.server.modules.invoice.model.Invoice;
import com.example.server.modules.invoice.repository.InvoiceRepository;
import com.example.server.modules.ledger.model.LedgerEntry;
import com.example.server.modules.ledger.repository.LedgerEntryRepository;
import com.example.server.modules.payment.dto.PaymentRequest;
import com.example.server.modules.payment.model.Payment;
import com.example.server.modules.payment.repository.PaymentRepository;
import com.example.server.modules.tenant.TenantContext;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class InvoiceService {

    private final InvoiceRepository invoiceRepository;
    private final CompanyRepository companyRepository;
    private final CustomerRepository customerRepository;
    private final PaymentRepository paymentRepository;
    private final LedgerEntryRepository ledgerEntryRepository;

    



    // Create a new invoice (starts as DRAFT)
    @Transactional
    public InvoiceResponse createInvoice(InvoiceRequest request) {
        Long companyId = TenantContext.getCurrentCompanyId();

        if (companyId == null) {
            throw new IllegalArgumentException("NO_COMPANY_CONTEXT");
        }

        if (request.getDueAt().isBefore(request.getIssuedAt())) {
            throw new IllegalArgumentException("INVOICE_INVALIDE_PERIODS");
        }

        // if (request.getCustomerId() == null) {
        //     throw new IllegalArgumentException("INVOICE_CUSTOMER_REQUIRED");
        // }

        
        Company company = companyRepository.findById(companyId)
            .orElseThrow(() -> new IllegalArgumentException("NO_COMPANY_FOUND"));

        Customer customer = null;

        if(request.getCustomerId() != null){
                    customer = customerRepository.findByIdAndCompanyId(request.getCustomerId(), companyId)
            .orElseThrow(() -> new IllegalArgumentException("Customer not found or does not belong to this company"));
        }

        Invoice invoice = Invoice.builder()
                .uid(System.currentTimeMillis())
                .company(company)
                .customer(customer)
                .number(request.getNumber())
                .title(request.getTitle())
                .description(request.getDescription())
                .amount(request.getAmount())
                .status(InvoiceStatus.DRAFT)
                .issuedAt(request.getIssuedAt())
                .dueAt(request.getDueAt())
                .dateOf(LocalDateTime.now())
                .updateOf(LocalDateTime.now())
                .build();

        Invoice saved = invoiceRepository.save(invoice);
        return mapToResponse(saved);
    }

    // Issue the invoice (DRAFT → ISSUED)

    @Transactional
    public InvoiceResponse issueInvoice(Long invoiceId) {
        Long companyId = TenantContext.getCurrentCompanyId();
        Invoice invoice = getInvoiceByIdAndCompany(invoiceId, companyId);

        if (invoice.getStatus() != InvoiceStatus.DRAFT) {
            throw new IllegalArgumentException("INVOICE_DRAFT_ONLY");
        }

        invoice.setStatus(InvoiceStatus.ISSUED);
        invoice.setUpdateOf(LocalDateTime.now());

        Invoice updated = invoiceRepository.save(invoice);
        return mapToResponse(updated);
    }

    // Send the invoice (ISSUED → SENT)

    @Transactional
    public InvoiceResponse sendInvoice(Long invoiceId) {
        Long companyId = TenantContext.getCurrentCompanyId();
        Invoice invoice = getInvoiceByIdAndCompany(invoiceId, companyId);
        
        if (invoice.getStatus() != InvoiceStatus.ISSUED) {
            throw new IllegalArgumentException("INVOICE_ISSUED_ONLY");
        }

        invoice.setStatus(InvoiceStatus.SENT);
        invoice.setUpdateOf(LocalDateTime.now());

        Invoice updated = invoiceRepository.save(invoice);
        return mapToResponse(updated);
    }


    // Mark as Paid (any status → PAID)

    @Transactional
    public InvoiceResponse markAsPaid(Long invoiceId, PaymentRequest paymentRequest) {

        System.out.println("Payement Request ---> "+ paymentRequest);
        System.out.println("invoice id ---> "+ invoiceId);
    

        Long companyId = TenantContext.getCurrentCompanyId();
        Invoice invoice = getInvoiceByIdAndCompany(invoiceId, companyId);

        if (invoice.getStatus() == InvoiceStatus.PAID) {
            throw new IllegalArgumentException("INVOICE_PAID");
        }

        Payment payment = Payment.builder()
            .uid(System.currentTimeMillis())
            .invoice(invoice)
            .amount(paymentRequest.getPaidAmount())
            .method(paymentRequest.getPaymentMethod())
            .paidAt(LocalDateTime.now())
            .status("true")
            .build();

        Payment savedPayment = paymentRepository.save(payment);

        LedgerEntryType ledgerType = (invoice.getCustomer() == null) 
            ? LedgerEntryType.DEBIT   // Internal / Expense
            : LedgerEntryType.CREDIT; // Income from customer


        LedgerEntry ledgerEntry = LedgerEntry.builder()
            .uid(System.currentTimeMillis())
            .company(invoice.getCompany())
            .payment(savedPayment)
            .type(ledgerType)
            .description("Payment for invoice #" + invoice.getNumber())
            .amount(paymentRequest.getPaidAmount())
            .occurredAt(payment.getPaidAt())
            .status("true")
            .build();

        ledgerEntryRepository.save(ledgerEntry);
        

        invoice.setStatus(InvoiceStatus.PAID);
        invoice.setUpdateOf(LocalDateTime.now());
        invoiceRepository.save(invoice);

        return mapToResponse(invoice);
    }

    // Cancel invoice

    @Transactional
    public InvoiceResponse cancelInvoice(Long invoiceId) {
        Long companyId = TenantContext.getCurrentCompanyId();
        Invoice invoice = getInvoiceByIdAndCompany(invoiceId, companyId);

        if (invoice.getStatus() == InvoiceStatus.PAID) {
            throw new IllegalArgumentException("INVOICE_PAID_NOT_CANCEL");
        }

        invoice.setStatus(InvoiceStatus.CANCELLED);
        invoice.setUpdateOf(LocalDateTime.now());

        Invoice updated = invoiceRepository.save(invoice);
        return mapToResponse(updated);
    }


    public Page<InvoiceResponse> getAllInvoices(Pageable pageable) {
        Long companyId = TenantContext.getCurrentCompanyId();
        Page<Invoice> invoices = invoiceRepository.findByCompanyId(companyId, pageable);
        return invoices.map(this::mapToResponse);
    }


    public InvoiceResponse getInvoiceById(Long id) {
        Long companyId = TenantContext.getCurrentCompanyId();
        Invoice invoice = getInvoiceByIdAndCompany(id, companyId);
        return mapToResponse(invoice);
    }


    @Transactional
    public InvoiceResponse updateInvoice(Long invoiceId, InvoiceRequest request) {
        Long companyId = TenantContext.getCurrentCompanyId();

        Invoice invoice = getInvoiceByIdAndCompany(invoiceId, companyId);

        // Business Rule: Only DRAFT invoices can be edited
        if (invoice.getStatus() != InvoiceStatus.DRAFT) {
            throw new IllegalArgumentException("INVOICE_EDIT_DRAFT_ONLY");
        }

        // Update fields
        invoice.setNumber(request.getNumber());
        invoice.setTitle(request.getTitle());
        invoice.setDescription(request.getDescription());
        invoice.setAmount(request.getAmount());
        invoice.setIssuedAt(request.getIssuedAt());
        invoice.setDueAt(request.getDueAt());
        invoice.setUpdateOf(LocalDateTime.now());

        // Update Customer if provided (can change from null to a customer)
        if (request.getCustomerId() != null) {
            Customer customer = customerRepository.findByIdAndCompanyId(request.getCustomerId(), companyId)
                    .orElseThrow(() -> new IllegalArgumentException("CUSTOMER_NOT_FOUND"));
            invoice.setCustomer(customer);
        }

        Invoice updated = invoiceRepository.save(invoice);
        return mapToResponse(updated);
    }


    private Invoice getInvoiceByIdAndCompany(Long id, Long companyId) {
        return invoiceRepository.findByIdAndCompanyId(id, companyId)
                .orElseThrow(() -> new IllegalArgumentException("INVOICE_NOT_FOUND"));
    }


    private InvoiceResponse mapToResponse(Invoice invoice) {

        CustomerResponse customerResponse = null;

        if (invoice.getCustomer() != null) {
        customerResponse = new CustomerResponse(
                invoice.getCustomer().getId(),
                invoice.getCustomer().getUid(),
                invoice.getCustomer().getName(),
                invoice.getCustomer().getEmail(),
                invoice.getCustomer().getPhone(),
                invoice.getCustomer().getStatus(),
                invoice.getCustomer().getDateOf(),
                invoice.getCustomer().getUpdateOf()
        );
    }

        return new InvoiceResponse(
                invoice.getId(),
                invoice.getUid(),
                invoice.getNumber(),
                invoice.getTitle(),
                invoice.getDescription(),
                invoice.getAmount(),
                invoice.getStatus(),
                invoice.getIssuedAt(),
                invoice.getDueAt(),
                invoice.getDateOf(),
                invoice.getUpdateOf(),
                customerResponse
        );
    }



}
