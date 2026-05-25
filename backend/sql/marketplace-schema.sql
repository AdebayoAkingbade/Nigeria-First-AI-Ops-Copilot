CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE SCHEMA IF NOT EXISTS marketplace;

CREATE TABLE IF NOT EXISTS marketplace.users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    phone VARCHAR(32) UNIQUE NOT NULL,
    business_name VARCHAR(255) NOT NULL,
    location VARCHAR(120),
    rating NUMERIC(3,2) NOT NULL DEFAULT 3.50,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS marketplace.customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES marketplace.users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(32) NOT NULL,
    total_spent BIGINT NOT NULL DEFAULT 0,
    last_seen TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT customers_total_spent_non_negative CHECK (total_spent >= 0),
    CONSTRAINT customers_phone_per_user_unique UNIQUE (user_id, phone)
);

CREATE TABLE IF NOT EXISTS marketplace.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES marketplace.users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    price BIGINT NOT NULL,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT products_price_non_negative CHECK (price >= 0)
);

CREATE TABLE IF NOT EXISTS marketplace.requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    buyer_phone VARCHAR(32) NOT NULL,
    product VARCHAR(255) NOT NULL,
    budget BIGINT NOT NULL,
    location VARCHAR(120) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'open',
    matched_user_id UUID REFERENCES marketplace.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT requests_budget_non_negative CHECK (budget >= 0),
    CONSTRAINT requests_status_valid CHECK (status IN ('open', 'matched', 'closed'))
);

CREATE TABLE IF NOT EXISTS marketplace.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES marketplace.users(id) ON DELETE CASCADE,
    customer_id UUID REFERENCES marketplace.customers(id) ON DELETE SET NULL,
    request_id UUID REFERENCES marketplace.requests(id) ON DELETE SET NULL,
    buyer_phone VARCHAR(32) NOT NULL,
    product VARCHAR(255) NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    amount BIGINT NOT NULL,
    status VARCHAR(40) NOT NULL DEFAULT 'pending_seller_acceptance',
    seller_note VARCHAR(255),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT orders_quantity_positive CHECK (quantity > 0),
    CONSTRAINT orders_amount_non_negative CHECK (amount >= 0)
);

CREATE TABLE IF NOT EXISTS marketplace.invoices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES marketplace.orders(id) ON DELETE CASCADE,
    amount BIGINT NOT NULL,
    payment_link TEXT,
    payment_reference VARCHAR(120) UNIQUE,
    status VARCHAR(20) NOT NULL DEFAULT 'pending',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT invoices_amount_non_negative CHECK (amount >= 0),
    CONSTRAINT invoices_status_valid CHECK (status IN ('pending', 'paid', 'failed', 'expired'))
);

CREATE TABLE IF NOT EXISTS marketplace.transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    invoice_id UUID NOT NULL REFERENCES marketplace.invoices(id) ON DELETE CASCADE,
    amount BIGINT NOT NULL,
    status VARCHAR(20) NOT NULL,
    paid_at TIMESTAMPTZ,
    provider_reference VARCHAR(120),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT transactions_amount_non_negative CHECK (amount >= 0)
);

CREATE TABLE IF NOT EXISTS marketplace.messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES marketplace.users(id) ON DELETE SET NULL,
    conversation_phone VARCHAR(32) NOT NULL,
    direction VARCHAR(10) NOT NULL,
    sender VARCHAR(20) NOT NULL,
    content TEXT NOT NULL,
    metadata_json TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT messages_direction_valid CHECK (direction IN ('inbound', 'outbound')),
    CONSTRAINT messages_sender_valid CHECK (sender IN ('buyer', 'seller', 'ai', 'system'))
);

CREATE TABLE IF NOT EXISTS marketplace.conversation_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    phone VARCHAR(32) NOT NULL UNIQUE,
    role VARCHAR(20) NOT NULL,
    state VARCHAR(50) NOT NULL,
    active_request_id UUID REFERENCES marketplace.requests(id) ON DELETE SET NULL,
    active_order_id UUID REFERENCES marketplace.orders(id) ON DELETE SET NULL,
    option_payload_json TEXT,
    last_inbound_at TIMESTAMPTZ,
    last_outbound_at TIMESTAMPTZ,
    reminder_sent_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS marketplace.prompt_versions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    version_label VARCHAR(60) NOT NULL UNIQUE,
    prompt_text TEXT NOT NULL,
    notes TEXT,
    active BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS marketplace.training_examples (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    raw_message TEXT NOT NULL,
    detected_intent VARCHAR(40) NOT NULL,
    extracted_product VARCHAR(255),
    extracted_budget BIGINT NOT NULL DEFAULT 0,
    extracted_location VARCHAR(120),
    source VARCHAR(20) NOT NULL,
    confidence NUMERIC(4,3) NOT NULL DEFAULT 0,
    prompt_version_id UUID REFERENCES marketplace.prompt_versions(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_marketplace_customers_user_id ON marketplace.customers(user_id);
CREATE INDEX IF NOT EXISTS idx_marketplace_products_user_id ON marketplace.products(user_id);
CREATE INDEX IF NOT EXISTS idx_marketplace_products_name ON marketplace.products(name);
CREATE INDEX IF NOT EXISTS idx_marketplace_requests_status ON marketplace.requests(status);
CREATE INDEX IF NOT EXISTS idx_marketplace_requests_product_location ON marketplace.requests(product, location);
CREATE INDEX IF NOT EXISTS idx_marketplace_orders_user_id ON marketplace.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_marketplace_orders_buyer_phone ON marketplace.orders(buyer_phone);
CREATE INDEX IF NOT EXISTS idx_marketplace_invoices_reference ON marketplace.invoices(payment_reference);
CREATE INDEX IF NOT EXISTS idx_marketplace_transactions_invoice_id ON marketplace.transactions(invoice_id);
CREATE INDEX IF NOT EXISTS idx_marketplace_messages_phone ON marketplace.messages(conversation_phone);
CREATE INDEX IF NOT EXISTS idx_marketplace_sessions_phone ON marketplace.conversation_sessions(phone);
CREATE INDEX IF NOT EXISTS idx_marketplace_training_examples_created_at ON marketplace.training_examples(created_at);
