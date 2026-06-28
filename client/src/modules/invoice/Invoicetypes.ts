import type { Page } from '../../types/page';
import type { ApiResponse } from '../../utils/Axios';
import type { Customer } from '../customers/Customertypes';

// ─── Enums ────────────────────────────────────────────────────────────────────

export type InvoiceStatus =
  | 'DRAFT'
  | 'ISSUED'
  | 'SENT'
  | 'PARTIALLY_PAID'
  | 'PAID'
  | 'OVERDUE'
  | 'CANCELLED'
  | 'VOIDED';

// ─── Entity ───────────────────────────────────────────────────────────────────

export interface Invoice {
  id:          number;
  uid:         number;
  number:      string;
  title:       string;
  description: string | null;
  amount:      number;
  status:      InvoiceStatus;
  issuedAt:    string;
  dueAt:       string;
  dateOf:      string;
  updateOf:    string;
  customer:    Customer | null; 
}

// ─── Requests ─────────────────────────────────────────────────────────────────

export interface CreateInvoiceRequest {
  number:      string;
  title:       string;
  description: string;
  amount:      number;
  issuedAt:    string; // ISO datetime
  dueAt:       string;
  customerId:  number | null; // null = internal
}

export type UpdateInvoiceRequest = Partial<CreateInvoiceRequest>;

export interface PayInvoiceRequest {
  invoiceId:     number;
  paidAmount:    number;
  paymentMethod: string;
}

// ─── Invoice source type (UI only) ───────────────────────────────────────────

export type InvoiceSource = 'customer' | 'internal';

// ─── Pageable params ──────────────────────────────────────────────────────────

export interface InvoicePageParams {
  page?:   number;
  size?:   number;
  sort?:   string;
  status?: InvoiceStatus;
}

// ─── API responses ────────────────────────────────────────────────────────────

export type InvoicePageResponse = ApiResponse<Page<Invoice>>;
export type InvoiceResponse     = ApiResponse<Invoice>;