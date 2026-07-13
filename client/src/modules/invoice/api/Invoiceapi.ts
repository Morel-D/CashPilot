import apiClient from '../../../utils/Axios';
import type {
  CreateInvoiceRequest,
  UpdateInvoiceRequest,
  PayInvoiceRequest,
  InvoicePageResponse,
  InvoiceResponse,
  InvoicePageParams,
} from '../Invoicetypes';
import type { ApiResponse } from '../../../utils/Axios';

export const invoiceApi = {
 
  getAll: (params: InvoicePageParams = {}) =>
    apiClient.get<InvoicePageResponse>('/api/invoices', {
      params: {
        page: params.page ?? 0,
        size: params.size ?? 10,
        ...(params.sort ? { sort: params.sort } : {}),
      },
    }),
 
  getByStatus: (status: string, params: InvoicePageParams = {}) =>
    apiClient.get<InvoicePageResponse>(`/api/invoices/status/${status}`, {
      params: {
        page: params.page ?? 0,
        size: params.size ?? 10,
      },
    }),
 
  search: (query: string, params: InvoicePageParams = {}) =>
    apiClient.get<InvoicePageResponse>('/api/invoices/search', {
      params: {
        query,
        page: params.page ?? 0,
        size: params.size ?? 10,
      },
    }),
 
  getById: (id: number) =>
    apiClient.get<InvoiceResponse>(`/api/invoices/${id}`),
 
  create: (body: CreateInvoiceRequest) =>
    apiClient.post<InvoiceResponse>('/api/invoices', body),
 
  update: (id: number, body: UpdateInvoiceRequest) =>
    apiClient.put<InvoiceResponse>(`/api/invoices/${id}`, body),
 
  delete: (id: number) =>
    apiClient.delete<ApiResponse<null>>(`/api/invoices/${id}`),
 
  // ── Status transitions ────────────────────────────────────────────────────
 
  issue: (id: number) =>
    apiClient.get<InvoiceResponse>(`/api/invoices/${id}/issue`),
 
  send: (id: number) =>
    apiClient.get<InvoiceResponse>(`/api/invoices/${id}/send`),
 
  pay: (id: number, body: PayInvoiceRequest) =>
    apiClient.post<InvoiceResponse>(`/api/invoices/${id}/pay`, body),
 
  cancel: (id: number) =>
    apiClient.post<InvoiceResponse>(`/api/invoices/${id}/cancel`, {}),
};
 