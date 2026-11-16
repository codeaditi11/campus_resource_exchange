-- 1. USERS
CREATE TABLE users (
    user_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'student'
        CHECK (role IN ('student', 'admin')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. CATEGORIES
CREATE TABLE categories (
    category_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT
);

-- 3. LISTINGS
CREATE TABLE listings (
    listing_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    owner_id BIGINT NOT NULL REFERENCES users(user_id),
    category_id BIGINT REFERENCES categories(category_id),
    title VARCHAR(200) NOT NULL,
    description TEXT,
    listing_type VARCHAR(20) NOT NULL
        CHECK (listing_type IN ('sell', 'lend', 'exchange')),
    price NUMERIC(10,2) DEFAULT 0
        CHECK (price >= 0),
    status VARCHAR(20) NOT NULL DEFAULT 'available'
        CHECK (status IN (
            'available', 'reserved', 'sold', 'removed'
        )),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. RESERVATIONS
CREATE TABLE reservations (
    reservation_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    listing_id BIGINT NOT NULL REFERENCES listings(listing_id),
    requester_id BIGINT NOT NULL REFERENCES users(user_id),
    status VARCHAR(20) NOT NULL DEFAULT 'confirmed'
        CHECK (status IN (
            'confirmed', 'cancelled', 'completed'
        )),
    reserved_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Only one active reservation per listing
CREATE UNIQUE INDEX one_active_reservation_per_listing
ON reservations(listing_id)
WHERE status = 'confirmed';

-- 5. REPORTS
CREATE TABLE reports (
    report_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    listing_id BIGINT NOT NULL REFERENCES listings(listing_id),
    reporter_id BIGINT NOT NULL REFERENCES users(user_id),
    reason TEXT NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'pending'
        CHECK (status IN (
            'pending', 'reviewed', 'dismissed'
        )),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Useful indexes
CREATE INDEX idx_listings_owner
ON listings(owner_id);

CREATE INDEX idx_listings_category
ON listings(category_id);

CREATE INDEX idx_listings_status
ON listings(status);

CREATE INDEX idx_reservations_requester
ON reservations(requester_id);

CREATE INDEX idx_reports_status
ON reports(status);
