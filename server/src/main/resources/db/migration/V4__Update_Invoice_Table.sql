-- V4__Update_Invoice_Table.sql

-- Add title and description
ALTER TABLE invoice 
ADD COLUMN IF NOT EXISTS title VARCHAR(255) NOT NULL;

ALTER TABLE invoice 
ADD COLUMN IF NOT EXISTS description TEXT;

-- Add audit fields
ALTER TABLE invoice 
ADD COLUMN IF NOT EXISTS date_of TIMESTAMP NOT NULL DEFAULT NOW();

ALTER TABLE invoice 
ADD COLUMN IF NOT EXISTS update_of TIMESTAMP NOT NULL DEFAULT NOW();

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_invoice_company_id ON invoice(company_id);
CREATE INDEX IF NOT EXISTS idx_invoice_status ON invoice(status);
CREATE INDEX IF NOT EXISTS idx_invoice_due_at ON invoice(due_at);