import type { CreateCustomerRequest, UpdateCustomerRequest } from '../Customertypes';

export type CustomerFormErrors = Partial<Record<keyof CreateCustomerRequest, string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^\+?[\d\s\-().]{7,20}$/;

export function validateCreateCustomer(data: CreateCustomerRequest): CustomerFormErrors {
  const errors: CustomerFormErrors = {};

  if (!data.name.trim())
    errors.name = 'Customer name is required.';
  else if (data.name.trim().length < 2)
    errors.name = 'Name must be at least 2 characters.';

  if (!data.email.trim())
    errors.email = 'Email address is required.';
  else if (!EMAIL_RE.test(data.email))
    errors.email = 'Enter a valid email address.';

  if (!data.phone.trim())
    errors.phone = 'Phone number is required.';
  else if (!PHONE_RE.test(data.phone))
    errors.phone = 'Enter a valid phone number.';

  return errors;
}

export function validateUpdateCustomer(data: UpdateCustomerRequest): CustomerFormErrors {
  const errors: CustomerFormErrors = {};

  if (data.name !== undefined) {
    if (!data.name.trim())       errors.name = 'Customer name is required.';
    else if (data.name.trim().length < 2) errors.name = 'Name must be at least 2 characters.';
  }

  if (data.email !== undefined) {
    if (!data.email.trim())      errors.email = 'Email address is required.';
    else if (!EMAIL_RE.test(data.email)) errors.email = 'Enter a valid email address.';
  }

  if (data.phone !== undefined) {
    if (!data.phone.trim())      errors.phone = 'Phone number is required.';
    else if (!PHONE_RE.test(data.phone)) errors.phone = 'Enter a valid phone number.';
  }

  return errors;
}