import apiClient from '../../../utils/Axios';
import type { DashboardMetricsResponse, PendingInvoicesResponse, RecentTransactionsResponse } from '../Dashboardtypes';

export const dashboardApi = {
  getMetrics: () =>
    apiClient.get<DashboardMetricsResponse>('/api/dashboard/metrics'),

  getRecentTransactions: () =>
    apiClient.get<RecentTransactionsResponse>('/api/dashboard/recent-transactions'),
 
  getPendingInvoices: () =>
    apiClient.get<PendingInvoicesResponse>('/api/dashboard/pending-invoices'),
};