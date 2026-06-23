-- =============================================
-- CashPilot - Initial Schema
-- V1__Initial_Schema.sql
-- =============================================

-- =============================================
-- Table: company
-- =============================================
CREATE TABLE IF NOT EXISTS company (
    id              BIGSERIAL PRIMARY KEY,
    uid             BIGINT UNIQUE NOT NULL,
    name            VARCHAR(100) NOT NULL,
    currency        CHAR(3) NOT NULL,
    description     TEXT,
    notice          TEXT,
    status          VARCHAR(5) DEFAULT 'true' NOT NULL, 
    date_of         TIMESTAMP NOT NULL DEFAULT NOW(),
    update_of       TIMESTAMP NOT NULL DEFAULT NOW()
);

-- =============================================
-- Table: customer
-- =============================================
CREATE TABLE IF NOT EXISTS customer (
    id              BIGSERIAL PRIMARY KEY,
    company_id      BIGINT NOT NULL,
    uid             BIGINT UNIQUE NOT NULL,
    name            VARCHAR(150) NOT NULL,
    email           VARCHAR(100) NOT NULL,
    phone           VARCHAR(30),
    status          VARCHAR(5) DEFAULT 'true' NOT NULL,
    date_of         TIMESTAMP NOT NULL DEFAULT NOW(),
    update_of       TIMESTAMP NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_customer_company FOREIGN KEY (company_id) 
        REFERENCES company(id) ON DELETE CASCADE
);

-- =============================================
-- Table: invoice
-- =============================================
CREATE TABLE IF NOT EXISTS invoice (
    id              BIGSERIAL PRIMARY KEY,
    company_id      BIGINT NOT NULL,
    customer_id     BIGINT NOT NULL,
    uid             BIGINT UNIQUE NOT NULL,
    number          VARCHAR(50) NOT NULL,
    amount          NUMERIC(15,2) NOT NULL,
    status          VARCHAR(20) NOT NULL,           -- Enum: DRAFT, ISSUED, PAID, etc.
    issued_at       TIMESTAMP NOT NULL,
    due_at          TIMESTAMP NOT NULL,
    date_of         TIMESTAMP NOT NULL DEFAULT NOW(),
    update_of       TIMESTAMP NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_invoice_company FOREIGN KEY (company_id) 
        REFERENCES company(id) ON DELETE CASCADE,
    CONSTRAINT fk_invoice_customer FOREIGN KEY (customer_id) 
        REFERENCES customer(id) ON DELETE RESTRICT
);

-- =============================================
-- Table: payment
-- =============================================
CREATE TABLE IF NOT EXISTS payment (
    id              BIGSERIAL PRIMARY KEY,
    invoice_id      BIGINT NOT NULL,
    uid             BIGINT UNIQUE NOT NULL,
    amount          NUMERIC(15,2) NOT NULL,
    method          VARCHAR(50) NOT NULL,
    paid_at         TIMESTAMP NOT NULL,
    status          VARCHAR(5) DEFAULT 'true' NOT NULL,
    date_of         TIMESTAMP NOT NULL DEFAULT NOW(),
    update_of       TIMESTAMP NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_payment_invoice FOREIGN KEY (invoice_id) 
        REFERENCES invoice(id) ON DELETE CASCADE
);

-- =============================================
-- Table: ledger_entry
-- =============================================
CREATE TABLE IF NOT EXISTS ledger_entry (
    id              BIGSERIAL PRIMARY KEY,
    company_id      BIGINT NOT NULL,
    payment_id      BIGINT,
    uid             BIGINT UNIQUE NOT NULL,
    type            VARCHAR(20) NOT NULL,           -- Enum: INCOME, EXPENSE, etc.
    description     TEXT,
    amount          NUMERIC(15,2) NOT NULL,
    occurred_at     TIMESTAMP,
    status          VARCHAR(5) DEFAULT 'true' NOT NULL,
    date_of         TIMESTAMP NOT NULL DEFAULT NOW(),
    update_of       TIMESTAMP NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_ledger_company FOREIGN KEY (company_id) 
        REFERENCES company(id) ON DELETE CASCADE,
    CONSTRAINT fk_ledger_payment FOREIGN KEY (payment_id) 
        REFERENCES payment(id) ON DELETE SET NULL
);

-- =============================================
-- Indexes for better performance
-- =============================================
CREATE INDEX idx_company_uid ON company(uid);
CREATE INDEX idx_customer_company_id ON customer(company_id);
CREATE INDEX idx_customer_uid ON customer(uid);
CREATE INDEX idx_invoice_company_id ON invoice(company_id);
CREATE INDEX idx_invoice_customer_id ON invoice(customer_id);
CREATE INDEX idx_invoice_status ON invoice(status);
CREATE INDEX idx_payment_invoice_id ON payment(invoice_id);
CREATE INDEX idx_ledger_company_id ON ledger_entry(company_id);
CREATE INDEX idx_ledger_payment_id ON ledger_entry(payment_id);