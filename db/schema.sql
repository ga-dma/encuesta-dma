CREATE TABLE IF NOT EXISTS quiz_submissions (
    id SERIAL PRIMARY KEY,

    -- which vertical the respondent was routed into and their outcome
    category_id TEXT NOT NULL,
    category_name TEXT NOT NULL,
    score NUMERIC,
    maturity_title TEXT,
    description TEXT,
    suggestion TEXT,
    email TEXT,

    -- one column per question so every answer is kept, whichever
    -- vertical(s) the respondent touched (initial tie-break questions
    -- included) -- most rows only fill in a subset of these
    miq1 INTEGER,
    miq2 INTEGER,
    miq3 INTEGER,
    miq4 INTEGER,
    miq5 INTEGER,
    biq1 INTEGER,
    biq2 INTEGER,
    biq3 INTEGER,
    biq4 INTEGER,
    biq5 INTEGER,
    deq1 INTEGER,
    deq2 INTEGER,
    deq3 INTEGER,
    deq4 INTEGER,
    deq5 INTEGER,

    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
