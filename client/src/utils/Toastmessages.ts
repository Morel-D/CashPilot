// ─── Server message → human-readable string ───────────────────────────────────
// Add new backend codes here as the API evolves.

const MESSAGE_MAP: Record<string, string> = {
  // ── Auth ──────────────────────────────────────────────────────────────────
  INVALID_CREDENTIALS:        'Incorrect email or password.',
  ACCESS_DENIED:              'You do not have permission to perform this action.',
  USER_NOT_FOUND:             'No account found with this email address.',
  EMAIL_ALREADY_EXIST:        'This email is already registered.',

  // ── Company ───────────────────────────────────────────────────────────────
  NO_COMPANY_FOUND:           'No company associated with this account.',
  COMPANY_NAME_ALREADY_EXIST: 'A company with this name already exists.',

  // ── Token ─────────────────────────────────────────────────────────────────
  INVALID_REFRESH_TOKEN:      'Your session is invalid. Please sign in again.',
  REFRESH_TOKEN_EXPIRED:      'Your session has expired. Please sign in again.',

  // ── Validation & server ───────────────────────────────────────────────────
  VALIDATION_FAILED:          'Some fields are invalid. Please review your input.',
  INTERNAL_SERVER_ERROR:      'An unexpected server error occurred. Please try again.',

  // ── Success ───────────────────────────────────────────────────────────────
  done:                       'Operation completed successfully.',
};

export function formatMessage(msg: string | undefined | null): string {
  if (!msg) return 'Something went wrong. Please try again.';
  return MESSAGE_MAP[msg] ?? msg.replace(/_/g, ' ');
}