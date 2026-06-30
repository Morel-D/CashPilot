-- V5__Fix_Ledger_Types_Check.sql

-- Drop existing constraint if it exists
ALTER TABLE ledger_entry DROP CONSTRAINT IF EXISTS ledger_entry_types_check;

-- Add correct check constraint
ALTER TABLE ledger_entry 
ADD CONSTRAINT ledger_entry_types_check 
CHECK (types IN ('INCOME', 'EXPENSE', 'TRANSFER', 'ADJUSTMENT', 'DEBIT', 'CREDIT'));