import type { ApiResponse } from '../../utils/Axios';

export interface DashboardMetrics {
  revenueToday:       number;
  outstandingAmount:  number;
  overdueInvoices:    number;
  totalCustomers:     number;
}

export type DashboardMetricsResponse = ApiResponse<DashboardMetrics>;