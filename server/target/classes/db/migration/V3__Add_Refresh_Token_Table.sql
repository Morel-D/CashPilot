-- =============================================
-- V3__Add_Refresh_Token_Table.sql
-- =============================================

-- Create refresh_token table
CREATE TABLE IF NOT EXISTS refresh_token (
    id              BIGSERIAL PRIMARY KEY,
    token           TEXT UNIQUE NOT NULL,
    user_id         BIGINT NOT NULL,
    expiry_date     TIMESTAMP NOT NULL,
    revoked         BOOLEAN DEFAULT FALSE,
    date_of         TIMESTAMP NOT NULL DEFAULT NOW(),
    update_of       TIMESTAMP NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_refresh_token_user FOREIGN KEY (user_id) 
        REFERENCES users(id) ON DELETE CASCADE
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_refresh_token_token ON refresh_token(token);
CREATE INDEX IF NOT EXISTS idx_refresh_token_user_id ON refresh_token(user_id);
CREATE INDEX IF NOT EXISTS idx_refresh_token_expiry ON refresh_token(expiry_date);

-- Add comment
COMMENT ON TABLE refresh_token IS 'Refresh tokens for authentication';
COMMENT ON COLUMN refresh_token.revoked IS 'Whether this refresh token has been revoked';
