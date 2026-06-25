-- =============================================
-- V2__Add_Users_And_Update_Company.sql
-- =============================================

-- 1. Create users table
CREATE TABLE IF NOT EXISTS users (
    id              BIGSERIAL PRIMARY KEY,
    email           VARCHAR(100) UNIQUE NOT NULL,
    password        VARCHAR(255) NOT NULL,
    full_name       VARCHAR(150) NOT NULL,
    phone           VARCHAR(30),
    status          VARCHAR(5) DEFAULT 'true' NOT NULL,
    date_of         TIMESTAMP NOT NULL DEFAULT NOW(),
    update_of       TIMESTAMP NOT NULL DEFAULT NOW()
);

-- 2. Add owner_id column to company table
ALTER TABLE company 
ADD COLUMN IF NOT EXISTS owner_id BIGINT;

-- 3. Add foreign key constraint
ALTER TABLE company 
ADD CONSTRAINT fk_company_owner 
FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE;

-- 4. Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_company_owner_id ON company(owner_id);

-- Optional: Add comment
COMMENT ON TABLE users IS 'User accounts for authentication';
COMMENT ON COLUMN company.owner_id IS 'Owner of this company';