import apiClient from '../../../utils/Axios';
import type { TransactionPageResponse, TransactionPageParams } from '../Transactiontypes';

export const transactionApi = {
  getAll: (params: TransactionPageParams = {}) =>
    apiClient.get<TransactionPageResponse>('/api/transactions', {
      params: {
        page: params.page ?? 0,
        size: params.size ?? 20,
        ...(params.sort   ? { sort:   params.sort   } : {}),
        ...(params.type   ? { type:   params.type   } : {}),
        ...(params.status ? { status: params.status } : {}),
      },
    }),
};