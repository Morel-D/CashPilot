import type { Page } from '../../types/page';
import type { ApiResponse } from '../../utils/Axios';

// ─── Customer entity ──────────────────────────────────────────────────────────

export interface Customer {
  id:        number;
  name:      string;
  email:     string;
  phone:     string;
  createdAt?: string;
  updatedAt?: string;
}


// ─── Requests ─────────────────────────────────────────────────────────────────

export interface CreateCustomerRequest {
  name:  string;
  email: string;
  phone: string;
}

export type UpdateCustomerRequest = Partial<CreateCustomerRequest>;

// ─── Pageable query params ────────────────────────────────────────────────────

export interface CustomerPageParams {
  page?: number;
  size?: number;
  sort?: string;
}

// ─── API responses ────────────────────────────────────────────────────────────

export type CustomerPageResponse   = ApiResponse<Page<Customer>>;
export type CustomerResponse       = ApiResponse<Customer>;