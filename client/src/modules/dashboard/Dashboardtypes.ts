import type { ApiResponse } from '../../utils/Axios';

export interface DashboardMetrics {
  revenueToday:       number;
  outstandingAmount:  number;
  overdueInvoices:    number;
  totalCustomers:     number;
}

export type DashboardMetricsResponse = ApiResponse<DashboardMetrics>;

 
// ─── Recent transaction (dashboard slice) ────────────────────────────────────
 
export interface RecentTransaction {
  id:            number;
  description:   string | null;
  amount:        number;
  type:          'CREDIT' | 'DEBIT';
  occurredAt:    string;
  invoiceNumber: string | null;
}
 
// ─── Pending invoice (dashboard slice) ───────────────────────────────────────
 
export interface PendingInvoice {
  id:           number;
  number:       string;
  title:        string;
  amount:       number;
  dueAt:        string;
  customerName: string | null;
}
 
export type RecentTransactionsResponse = ApiResponse<RecentTransaction[]>;
export type PendingInvoicesResponse    = ApiResponse<PendingInvoice[]>;