-- Create clocks table
CREATE TABLE clocks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    model_name TEXT NOT NULL,
    provider TEXT NOT NULL,
    html_content TEXT NOT NULL,
    time_shown TIME NOT NULL,
    generated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    generation_time_ms INTEGER
);

-- Create index for efficient time-based queries
CREATE INDEX idx_clocks_time_shown ON clocks (time_shown);
CREATE INDEX idx_clocks_model_time ON clocks (model_name, time_shown);

-- Enable Row Level Security
ALTER TABLE clocks ENABLE ROW LEVEL SECURITY;

-- Public read access (anyone can view clocks)
CREATE POLICY "Public can read clocks"
    ON clocks
    FOR SELECT
    TO anon, authenticated
    USING (true);

-- Only service role can insert (Edge Function uses service role)
CREATE POLICY "Service role can insert clocks"
    ON clocks
    FOR INSERT
    TO service_role
    WITH CHECK (true);

-- Enable pg_cron and pg_net extensions (needed for scheduled function calls)
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;
