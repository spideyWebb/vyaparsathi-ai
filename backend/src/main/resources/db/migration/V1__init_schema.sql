-- VyaparSathi AI - Flyway Database Schema Migration V1__init_schema.sql
-- PostgreSQL 15+ Core, Inventory, Sales, Finance, GST, AI Agents, UPI, WhatsApp & Vector tables

-- 1. CORE MODULE
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    phone VARCHAR(20) UNIQUE NOT NULL,
    email VARCHAR(100),
    password_hash VARCHAR(255),
    business_name VARCHAR(150) NOT NULL,
    gstin VARCHAR(15),
    business_type VARCHAR(50),
    language_pref VARCHAR(10) DEFAULT 'hi',
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    metadata JSONB
);

CREATE TABLE IF NOT EXISTS business_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    pincode VARCHAR(10),
    pan VARCHAR(10),
    bank_account TEXT, -- Encrypted AES-256
    ifsc VARCHAR(11),
    logo_url TEXT,
    settings JSONB
);

CREATE TABLE IF NOT EXISTS user_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token TEXT NOT NULL,
    device_info JSONB,
    ip_address INET,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS audit_logs (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(100) NOT NULL,
    entity_id VARCHAR(100),
    old_value JSONB,
    new_value JSONB,
    ip_address INET,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. INVENTORY MODULE
CREATE TABLE IF NOT EXISTS categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    parent_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS suppliers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(150) NOT NULL,
    phone VARCHAR(20),
    email VARCHAR(100),
    gstin VARCHAR(15),
    address TEXT,
    payment_terms INT DEFAULT 30,
    is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    sku VARCHAR(100) NOT NULL,
    name VARCHAR(200) NOT NULL,
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    description TEXT,
    unit VARCHAR(20) DEFAULT 'Pack',
    hsn_code VARCHAR(20),
    gst_rate NUMERIC(5, 2) DEFAULT 5.00,
    purchase_price NUMERIC(12, 2) NOT NULL,
    selling_price NUMERIC(12, 2) NOT NULL,
    mrp NUMERIC(12, 2),
    current_stock INT DEFAULT 0,
    reorder_level INT DEFAULT 10,
    reorder_qty INT DEFAULT 50,
    supplier_id UUID REFERENCES suppliers(id) ON DELETE SET NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    metadata JSONB,
    CONSTRAINT uk_user_sku UNIQUE(user_id, sku)
);

CREATE TABLE IF NOT EXISTS stock_movements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    movement_type VARCHAR(20) NOT NULL, -- 'in', 'out', 'adjustment', 'transfer'
    quantity INT NOT NULL,
    unit_cost NUMERIC(12, 2),
    reference_type VARCHAR(50),
    reference_id VARCHAR(100),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    metadata JSONB
);

-- 3. SALES MODULE
CREATE TABLE IF NOT EXISTS customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(150) NOT NULL,
    phone VARCHAR(20),
    email VARCHAR(100),
    gstin VARCHAR(15),
    billing_address TEXT,
    shipping_address TEXT,
    state_code VARCHAR(5),
    credit_limit NUMERIC(12, 2) DEFAULT 0,
    outstanding NUMERIC(12, 2) DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    metadata JSONB
);

CREATE TABLE IF NOT EXISTS invoices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    invoice_number VARCHAR(50) NOT NULL,
    customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
    invoice_date DATE NOT NULL,
    due_date DATE NOT NULL,
    subtotal NUMERIC(12, 2) NOT NULL,
    discount_amount NUMERIC(12, 2) DEFAULT 0,
    taxable_amount NUMERIC(12, 2) NOT NULL,
    cgst_total NUMERIC(12, 2) DEFAULT 0,
    sgst_total NUMERIC(12, 2) DEFAULT 0,
    igst_total NUMERIC(12, 2) DEFAULT 0,
    total_amount NUMERIC(12, 2) NOT NULL,
    amount_paid NUMERIC(12, 2) DEFAULT 0,
    status VARCHAR(20) DEFAULT 'draft', -- 'draft', 'sent', 'paid', 'overdue', 'cancelled'
    payment_mode VARCHAR(30),
    upi_transaction_id VARCHAR(100),
    notes TEXT,
    terms TEXT,
    is_gst_invoice BOOLEAN DEFAULT TRUE,
    e_way_bill_no VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    metadata JSONB,
    CONSTRAINT uk_user_invoice_num UNIQUE(user_id, invoice_number)
);

CREATE TABLE IF NOT EXISTS invoice_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    invoice_id UUID NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE SET NULL,
    description TEXT NOT NULL,
    quantity INT NOT NULL,
    unit VARCHAR(20),
    rate NUMERIC(12, 2) NOT NULL,
    discount_percent NUMERIC(5, 2) DEFAULT 0,
    taxable_value NUMERIC(12, 2) NOT NULL,
    cgst_rate NUMERIC(5, 2) DEFAULT 0,
    cgst_amount NUMERIC(12, 2) DEFAULT 0,
    sgst_rate NUMERIC(5, 2) DEFAULT 0,
    sgst_amount NUMERIC(12, 2) DEFAULT 0,
    igst_rate NUMERIC(5, 2) DEFAULT 0,
    igst_amount NUMERIC(12, 2) DEFAULT 0,
    total NUMERIC(12, 2) NOT NULL
);

CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    invoice_id UUID REFERENCES invoices(id) ON DELETE SET NULL,
    customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
    amount NUMERIC(12, 2) NOT NULL,
    payment_mode VARCHAR(30) NOT NULL,
    upi_id VARCHAR(100),
    transaction_ref VARCHAR(100),
    bank_ref VARCHAR(100),
    status VARCHAR(20) DEFAULT 'success',
    paid_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    reconciled BOOLEAN DEFAULT FALSE,
    reconciliation_data JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. FINANCE MODULE
CREATE TABLE IF NOT EXISTS expense_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    type VARCHAR(20) DEFAULT 'variable', -- 'fixed', 'variable'
    budget_limit NUMERIC(12, 2),
    is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS expenses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    category VARCHAR(100) NOT NULL,
    amount NUMERIC(12, 2) NOT NULL,
    gst_amount NUMERIC(12, 2) DEFAULT 0,
    gstin_vendor VARCHAR(15),
    description TEXT,
    expense_date DATE NOT NULL,
    payment_mode VARCHAR(30) NOT NULL,
    receipt_url TEXT,
    is_recurring BOOLEAN DEFAULT FALSE,
    recurring_freq VARCHAR(20),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    metadata JSONB
);

CREATE TABLE IF NOT EXISTS bank_accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    bank_name VARCHAR(100) NOT NULL,
    account_number TEXT NOT NULL, -- Encrypted
    ifsc VARCHAR(11) NOT NULL,
    account_type VARCHAR(30) DEFAULT 'current',
    current_balance NUMERIC(14, 2) DEFAULT 0,
    is_primary BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS bank_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    account_id UUID NOT NULL REFERENCES bank_accounts(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    transaction_type VARCHAR(10) NOT NULL, -- 'credit', 'debit'
    amount NUMERIC(14, 2) NOT NULL,
    balance_after NUMERIC(14, 2),
    description TEXT,
    reference_no VARCHAR(100),
    transaction_date TIMESTAMP WITH TIME ZONE NOT NULL,
    category VARCHAR(100),
    is_reconciled BOOLEAN DEFAULT FALSE,
    reconciliation_id VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. GST MODULE
CREATE TABLE IF NOT EXISTS gst_returns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    return_type VARCHAR(20) NOT NULL, -- 'GSTR1', 'GSTR3B', 'GSTR9'
    return_period VARCHAR(20) NOT NULL,
    filing_due_date DATE NOT NULL,
    filing_date DATE,
    status VARCHAR(20) DEFAULT 'pending',
    total_taxable NUMERIC(14, 2) DEFAULT 0,
    total_igst NUMERIC(12, 2) DEFAULT 0,
    total_cgst NUMERIC(12, 2) DEFAULT 0,
    total_sgst NUMERIC(12, 2) DEFAULT 0,
    total_cess NUMERIC(12, 2) DEFAULT 0,
    ack_number VARCHAR(100),
    json_payload JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS gst_invoices_uploaded (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    invoice_number VARCHAR(50) NOT NULL,
    party_gstin VARCHAR(15),
    invoice_date DATE NOT NULL,
    invoice_value NUMERIC(12, 2) NOT NULL,
    place_of_supply VARCHAR(100),
    reverse_charge BOOLEAN DEFAULT FALSE,
    invoice_type VARCHAR(30) DEFAULT 'B2B',
    rate NUMERIC(5, 2),
    taxable_value NUMERIC(12, 2) NOT NULL,
    igst NUMERIC(12, 2) DEFAULT 0,
    cgst NUMERIC(12, 2) DEFAULT 0,
    sgst NUMERIC(12, 2) DEFAULT 0,
    cess NUMERIC(12, 2) DEFAULT 0,
    source VARCHAR(20) DEFAULT 'manual',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS compliance_reminders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    reminder_type VARCHAR(50) NOT NULL,
    title VARCHAR(150) NOT NULL,
    description TEXT,
    due_date DATE NOT NULL,
    remind_at TIMESTAMP WITH TIME ZONE,
    channel VARCHAR(30) DEFAULT 'whatsapp',
    status VARCHAR(20) DEFAULT 'pending',
    sent_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS e_way_bills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    bill_number VARCHAR(50) UNIQUE NOT NULL,
    invoice_id UUID REFERENCES invoices(id) ON DELETE SET NULL,
    valid_from TIMESTAMP WITH TIME ZONE NOT NULL,
    valid_until TIMESTAMP WITH TIME ZONE NOT NULL,
    distance INT,
    vehicle_no VARCHAR(20),
    transporter_id VARCHAR(50),
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. AI AGENTS MODULE
CREATE TABLE IF NOT EXISTS agent_conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    session_id VARCHAR(100) NOT NULL,
    agent_type VARCHAR(50) NOT NULL, -- 'supervisor', 'inventory', 'finance', 'gst', 'sales'
    query_text TEXT NOT NULL,
    query_language VARCHAR(10) DEFAULT 'hi',
    response_text TEXT NOT NULL,
    confidence_score NUMERIC(5, 4),
    tokens_used INT DEFAULT 0,
    model_used VARCHAR(50),
    execution_time_ms INT,
    context_data JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS agent_recommendations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    agent_type VARCHAR(50) NOT NULL,
    recommendation_type VARCHAR(50) NOT NULL,
    priority VARCHAR(20) DEFAULT 'medium', -- 'low', 'medium', 'high', 'critical'
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    action_payload JSONB,
    is_read BOOLEAN DEFAULT FALSE,
    is_actioned BOOLEAN DEFAULT FALSE,
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS reorder_suggestions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    suggested_qty INT NOT NULL,
    reason TEXT,
    confidence NUMERIC(5, 4),
    expected_demand INT,
    lead_time_days INT,
    supplier_id UUID REFERENCES suppliers(id) ON DELETE SET NULL,
    status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS sales_forecasts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    forecast_period VARCHAR(20) NOT NULL,
    forecast_date DATE NOT NULL,
    predicted_qty INT NOT NULL,
    predicted_revenue NUMERIC(14, 2) NOT NULL,
    confidence_lower NUMERIC(14, 2),
    confidence_upper NUMERIC(14, 2),
    model_version VARCHAR(30),
    actual_qty INT,
    accuracy NUMERIC(5, 4),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. UPI & WHATSAPP RECONCILIATION MODULE
CREATE TABLE IF NOT EXISTS upi_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    upi_id VARCHAR(100),
    transaction_id VARCHAR(100) UNIQUE NOT NULL,
    amount NUMERIC(12, 2) NOT NULL,
    payer_name VARCHAR(150),
    payer_upi VARCHAR(100),
    payer_note TEXT,
    status VARCHAR(20) DEFAULT 'success',
    bank_ref VARCHAR(100),
    settlement_date DATE,
    raw_data JSONB,
    reconciled_invoice_id UUID REFERENCES invoices(id) ON DELETE SET NULL,
    confidence_match NUMERIC(5, 4),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS whatsapp_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    wa_message_id VARCHAR(100),
    direction VARCHAR(10) NOT NULL, -- 'inbound', 'outbound'
    phone_number VARCHAR(20) NOT NULL,
    message_type VARCHAR(30) DEFAULT 'text',
    content TEXT,
    media_url TEXT,
    status VARCHAR(20) DEFAULT 'sent',
    sent_at TIMESTAMP WITH TIME ZONE,
    delivered_at TIMESTAMP WITH TIME ZONE,
    read_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS whatsapp_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    template_name VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL,
    language VARCHAR(10) DEFAULT 'hi',
    header TEXT,
    body TEXT NOT NULL,
    footer TEXT,
    buttons JSONB,
    wa_template_id VARCHAR(100),
    status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS document_uploads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    document_type VARCHAR(50) NOT NULL, -- 'invoice', 'receipt', 'bank_statement'
    file_name VARCHAR(255) NOT NULL,
    file_url TEXT NOT NULL,
    file_size INT,
    mime_type VARCHAR(100),
    ocr_text TEXT,
    extracted_data JSONB,
    confidence NUMERIC(5, 4),
    status VARCHAR(20) DEFAULT 'processing',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. KNOWLEDGE & NOTIFICATIONS MODULE
CREATE TABLE IF NOT EXISTS knowledge_chunks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source_type VARCHAR(50) NOT NULL,
    source_id VARCHAR(100),
    chunk_text TEXT NOT NULL,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS business_rules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    rule_name VARCHAR(150) NOT NULL,
    rule_type VARCHAR(50) NOT NULL,
    condition_json JSONB NOT NULL,
    action_json JSONB NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    priority INT DEFAULT 5,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS notification_queue (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    channel VARCHAR(30) NOT NULL, -- 'whatsapp', 'sms', 'email', 'push'
    recipient VARCHAR(100) NOT NULL,
    template_id VARCHAR(100),
    payload JSONB NOT NULL,
    scheduled_at TIMESTAMP WITH TIME ZONE,
    sent_at TIMESTAMP WITH TIME ZONE,
    status VARCHAR(20) DEFAULT 'pending',
    retry_count INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- INDEXES FOR HIGH-PERFORMANCE QUERYING
CREATE INDEX IF NOT EXISTS idx_products_user_sku ON products(user_id, sku);
CREATE INDEX IF NOT EXISTS idx_products_stock ON products(current_stock, reorder_level);
CREATE INDEX IF NOT EXISTS idx_invoices_user_date ON invoices(user_id, invoice_date);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON invoices(status);
CREATE INDEX IF NOT EXISTS idx_expenses_user_date ON expenses(user_id, expense_date);
CREATE INDEX IF NOT EXISTS idx_gst_returns_user ON gst_returns(user_id, return_period);
CREATE INDEX IF NOT EXISTS idx_agent_conv_user ON agent_conversations(user_id, session_id);
