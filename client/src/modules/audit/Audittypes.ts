import type { Page } from '../../types/page';
import type { ApiResponse } from '../../utils/Axios';


// ─── Known audit actions (extend as backend grows) ────────────────────────────

export type AuditAction =
  | 'CREATE'
  | 'UPDATE'
  | 'DELETE'
  | 'LOGIN'
  | 'LOGOUT'
  | 'REGISTER'
  | 'STATUS_CHANGE'
  | 'PAYMENT'
  | string; // open-ended fallback

// ─── Entity ───────────────────────────────────────────────────────────────────

export interface AuditLog {
  id:          number;
  companyId:   string;
  userId:      string;
  username:    string;
  action:      AuditAction;
  entityType:  string;
  entityId:    string | null;
  description: string | null;
  oldValue:    string | null;
  newValue:    string | null;
  timestamp:   string;
  ipAddress:   string | null;
  userAgent:   string | null;
}

// ─── Query params ─────────────────────────────────────────────────────────────

export interface AuditPageParams {
  page?:       number;
  size?:       number;
  sort?:       string;
  action?:     AuditAction;
  entityType?: string;
  username?:   string;
}

export interface AuditSearchParams {
  q:     string;
  page?: number;
  size?: number;
}

// ─── API responses ────────────────────────────────────────────────────────────

export type AuditPageResponse   = ApiResponse<Page<AuditLog>>;
export type AuditDetailResponse = ApiResponse<AuditLog>;