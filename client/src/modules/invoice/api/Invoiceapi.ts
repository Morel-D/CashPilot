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
        page:   params.page   ?? 0,
        size:   params.size   ?? 10,
        ...(params.sort   ? { sort:   params.sort   } : {}),
        ...(params.status ? { status: params.status } : {}),
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

  pay: (id: number, body: Omit<PayInvoiceRequest, 'invoiceId'>) =>
    apiClient.post<InvoiceResponse>(`/api/invoices/${id}/pay`, {
      invoiceId: id,
      ...body,
    }),

  cancel: (id: number) =>
    apiClient.post<InvoiceResponse>(`/api/invoices/${id}/cancel`, {}),
};