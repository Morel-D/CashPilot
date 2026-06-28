import type { CreateInvoiceRequest, PayInvoiceRequest } from '../Invoicetypes';

export type InvoiceFormErrors = Partial<Record<keyof CreateInvoiceRequest, string>>;
export type PayFormErrors     = Partial<Record<'paidAmount' | 'paymentMethod', string>>;

export function validateCreateInvoice(data: CreateInvoiceRequest): InvoiceFormErrors {
  const errors: InvoiceFormErrors = {};

  if (!data.number.trim())
    errors.number = 'Invoice number is required.';

  if (!data.title.trim())
    errors.title = 'Title is required.';

  if (!data.amount || data.amount <= 0)
    errors.amount = 'Amount must be a positive number.';

  if (!data.issuedAt)
    errors.issuedAt = 'Issue date is required.';

  if (!data.dueAt)
    errors.dueAt = 'Due date is required.';

  if (data.issuedAt && data.dueAt && new Date(data.dueAt) <= new Date(data.issuedAt))
    errors.dueAt = 'Due date must be after the issue date.';

  return errors;
}

export function validatePayInvoice(
  data: Pick<PayInvoiceRequest, 'paidAmount' | 'paymentMethod'>
): PayFormErrors {
  const errors: PayFormErrors = {};

  if (!data.paidAmount || data.paidAmount <= 0)
    errors.paidAmount = 'Payment amount must be positive.';

  if (!data.paymentMethod.trim())
    errors.paymentMethod = 'Payment method is required.';

  return errors;
}