-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Table 1: Categories
CREATE TABLE IF NOT EXISTS categories (
    id          UUID        NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name        VARCHAR(100) NOT NULL
);

-- Table 2: Expenses
CREATE TABLE IF NOT EXISTS expenses (
    id          UUID        NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    category_id UUID        NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
    date        DATE        NOT NULL,
    amount      NUMERIC(12, 2) NOT NULL,
    comment     TEXT
);

-- Indexes for common lookups
CREATE INDEX IF NOT EXISTS idx_expenses_category_id ON expenses(category_id);
CREATE INDEX IF NOT EXISTS idx_expenses_date        ON expenses(date);

-- Table 3: Salary
CREATE TABLE IF NOT EXISTS salary (
    id      UUID           NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    date    DATE           NOT NULL,
    amount  NUMERIC(12, 2) NOT NULL
);

-- Table 4: Monthly Balance
CREATE TABLE IF NOT EXISTS monthly_balance (
    id      UUID           NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    date    DATE           NOT NULL,
    amount  NUMERIC(12, 2) NOT NULL
);

-- Seed default categories
INSERT INTO categories (name) VALUES
    ('Grocery'),
    ('Personal Expense'),
    ('House Expense'),
    ('Nihanya Expense'),
    ('Re-Location Expense'),
    ('Bindu Expense'),
    ('Misc')
ON CONFLICT DO NOTHING;
