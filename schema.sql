CREATE TABLE IF NOT EXISTS sources (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL, 
    base_url TEXT NOT NULL,
    is_active INTEGER DEFAULT 1,
    last_crawled_at DATETIME
);


CREATE TABLE IF NOT EXISTS jobs (
    id TEXT PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    title_hi TEXT,
    department TEXT NOT NULL,
    state TEXT NOT NULL,
    district TEXT,
    employment_type TEXT,
    qualification TEXT NOT NULL,
    vacancy INTEGER DEFAULT 0,
    age_limit TEXT,
    salary TEXT,
    application_start DATE,
    application_end DATE,
    application_mode TEXT,
    source_url TEXT NOT NULL,
    official_pdf_url TEXT NOT NULL,
    notification_hash TEXT UNIQUE, 
    status TEXT DEFAULT 'DRAFT',
    verification_status TEXT DEFAULT 'PENDING',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE IF NOT EXISTS crawl_logs (
    id TEXT PRIMARY KEY,
    source_id TEXT NOT NULL,
    status TEXT NOT NULL,
    items_found INTEGER DEFAULT 0,
    error_message TEXT,
    executed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (source_id) REFERENCES sources(id)
);


CREATE INDEX IF NOT EXISTS idx_jobs_status ON jobs(status);
CREATE INDEX IF NOT EXISTS idx_jobs_state_district ON jobs(state, district);
CREATE INDEX IF NOT EXISTS idx_jobs_slug ON jobs(slug);
