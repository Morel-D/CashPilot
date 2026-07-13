import type { ApiResponse } from '../../../utils/Axios';
import apiClient from '../../../utils/Axios';
import type {
  CreateCustomerRequest,
  UpdateCustomerRequest,
  CustomerPageResponse,
  CustomerResponse,
  CustomerPageParams,
} from '../Customertypes';

export const customerApi = {
  getAll: (params: CustomerPageParams = {}) =>
    apiClient.get<CustomerPageResponse>('/api/customers', {
      params: {
        page: params.page ?? 0,
        size: params.size ?? 10,
        ...(params.sort ? { sort: params.sort } : {}),
      },
    }),

  getById: (id: number) =>
    apiClient.get<CustomerResponse>(`/api/customers/${id}`),

  create: (body: CreateCustomerRequest) =>
    apiClient.post<CustomerResponse>('/api/customers', body),

  update: (id: number, body: UpdateCustomerRequest) =>
    apiClient.put<CustomerResponse>(`/api/customers/${id}`, body),

  delete: (id: number) =>
    apiClient.delete<ApiResponse<null>>(`/api/customers/${id}`),

  search: (name: string, params: CustomerPageParams = {}) =>
    apiClient.get<CustomerPageResponse>('/api/customers/search', {
      params: {
        name,
        page: params.page ?? 0,
        size: params.size ?? 10,
      },
    }),
};

