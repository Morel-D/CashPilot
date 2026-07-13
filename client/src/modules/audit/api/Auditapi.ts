import apiClient from '../../../utils/Axios';
import type {
  AuditPageResponse,
  AuditDetailResponse,
  AuditPageParams,
  AuditSearchParams,
} from '../Audittypes';

export const auditApi = {
  // GET /api/audit?action=&entity=&fromDate=&toDate=
  getAll: (params: AuditPageParams = {}) =>
    apiClient.get<AuditPageResponse>('/api/audit', {
      params: {
        page:                    params.page ?? 0,
        size:                    params.size ?? 25,
        ...(params.sort       ? { sort:       params.sort       } : {}),
        ...(params.action     ? { action:     params.action     } : {}),
        ...(params.entityType ? { entity:     params.entityType } : {}), // backend param is "entity"
        ...(params.fromDate   ? { fromDate:   params.fromDate   } : {}),
        ...(params.toDate     ? { toDate:     params.toDate     } : {}),
      },
    }),
 
  // GET /api/audit/search?action=&entityType=&search=
  search: (params: AuditSearchParams) =>
    apiClient.get<AuditPageResponse>('/api/audit/search', {
      params: {
        page:                       params.page ?? 0,
        size:                       params.size ?? 25,
        ...(params.action     ? { action:     params.action     } : {}),
        ...(params.entityType ? { entityType: params.entityType } : {}),
        ...(params.q          ? { search:     params.q          } : {}), // backend param is "search"
      },
    }),
 
  getById: (id: number) =>
    apiClient.get<AuditDetailResponse>(`/api/audit/${id}`),
};