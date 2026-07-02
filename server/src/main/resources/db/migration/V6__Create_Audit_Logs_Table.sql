-- V6__Create_Audit_Logs_Table.sql

CREATE TABLE audit_logs (
    id              BIGSERIAL PRIMARY KEY,
    company_id      VARCHAR(50) NOT NULL,
    user_id         VARCHAR(50) NOT NULL,
    username        VARCHAR(255) NOT NULL,
    
    action          VARCHAR(100) NOT NULL,
    entity_type     VARCHAR(100) NOT NULL,
    entity_id       VARCHAR(100),
    
    description     TEXT,
    old_value       TEXT,
    new_value       TEXT,
    
    timestamp       TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    ip_address      VARCHAR(50),
    user_agent      TEXT,
    
    CONSTRAINT audit_logs_company_id_idx 
        INDEX (company_id, timestamp DESC),
    
    CONSTRAINT audit_logs_action_idx 
        INDEX (company_id, action, timestamp DESC),
    
    CONSTRAINT audit_logs_entity_idx 
        INDEX (company_id, entity_type, entity_id, timestamp DESC)
);

-- Additional useful indexes
CREATE INDEX idx_audit_logs_timestamp ON audit_logs (timestamp DESC);
CREATE INDEX idx_audit_logs_company_action ON audit_logs (company_id, action);
CREATE INDEX idx_audit_logs_entity_type ON audit_logs (company_id, entity_type);

-- Comment for documentation
COMMENT ON TABLE audit_logs IS 'Audit trail for all important actions in the system';
COMMENT ON COLUMN audit_logs.company_id IS 'Multi-tenancy key';
COMMENT ON COLUMN audit_logs.action IS 'Type of action (LOGIN, CUSTOMER_CREATED, INVOICE_PAID, etc.)';
COMMENT ON COLUMN audit_logs.description IS 'Human readable description of the event';