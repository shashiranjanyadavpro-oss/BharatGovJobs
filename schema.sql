-- BharatGovJobs Cloudflare D1 Database Schema

CREATE TABLE IF NOT EXISTS jobs (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    title_hi TEXT NOT NULL,
    district TEXT NOT NULL,
    state TEXT NOT NULL,
    qualification TEXT NOT NULL,
    category TEXT NOT NULL,
    is_women_only INTEGER DEFAULT 0,
    is_zero_competition INTEGER DEFAULT 0,
    source_verified INTEGER DEFAULT 1,
    last_date TEXT NOT NULL,
    vacancy INTEGER DEFAULT 0,
    age_limit TEXT,
    fees TEXT DEFAULT '₹0',
    salary TEXT,
    summary TEXT,
    eligible_bullets TEXT,
    official_pdf TEXT NOT NULL,
    status TEXT DEFAULT 'draft',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_jobs_state_district ON jobs(state, district);
CREATE INDEX IF NOT EXISTS idx_jobs_category ON jobs(category);
CREATE INDEX IF NOT EXISTS idx_jobs_status ON jobs(status);
