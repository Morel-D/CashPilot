import apiClient from '../../../utils/Axios';
import type {
  AuditPageResponse,
  AuditDetailResponse,
  AuditPageParams,
  AuditSearchParams,
} from '../Audittypes';

export const auditApi = {
  getAll: (params: AuditPageParams = {}) =>
    apiClient.get<AuditPageResponse>('/api/audit', {
      params: {
        page: params.page ?? 0,
        size: params.size ?? 25,
        ...(params.sort       ? { sort:       params.sort       } : {}),
        ...(params.action     ? { action:     params.action     } : {}),
        ...(params.entityType ? { entityType: params.entityType } : {}),
        ...(params.username   ? { username:   params.username   } : {}),
      },
    }),

  search: (params: AuditSearchParams) =>
    apiClient.get<AuditPageResponse>('/api/audit/search', {
      params: {
        q:    params.q,
        page: params.page ?? 0,
        size: params.size ?? 25,
      },
    }),

  getById: (id: number) =>
    apiClient.get<AuditDetailResponse>(`/api/audit/${id}`),
};