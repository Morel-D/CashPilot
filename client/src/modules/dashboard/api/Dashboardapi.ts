import apiClient from '../../../utils/Axios';
import type { DashboardMetricsResponse } from '../Dashboardtypes';

export const dashboardApi = {
  getMetrics: () =>
    apiClient.get<DashboardMetricsResponse>('/api/dashboard/metrics'),
};