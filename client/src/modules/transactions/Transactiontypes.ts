import type { Page } from '../../types/page';
import type { ApiResponse } from '../../utils/Axios';

// ─── Enums ────────────────────────────────────────────────────────────────────

export type TransactionType   = 'CREDIT' | 'DEBIT';
export type TransactionStatus = string; // open-ended from backend

// ─── Entity ───────────────────────────────────────────────────────────────────

export interface Transaction {
  uid:           number;
  type:          TransactionType;
  description:   string | null;
  amount:        number;
  occurredAt:    string;
  status:        TransactionStatus;
  invoiceNumber: string | null;
  customerName:  string | null;
}

// ─── Pageable params ──────────────────────────────────────────────────────────

export interface TransactionPageParams {
  page?:   number;
  size?:   number;
  sort?:   string;
  type?:   TransactionType;
  status?: string;
}

// ─── API responses ────────────────────────────────────────────────────────────

export type TransactionPageResponse = ApiResponse<Page<Transaction>>;