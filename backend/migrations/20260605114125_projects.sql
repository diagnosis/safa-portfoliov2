-- +goose Up
-- +goose StatementBegin
CREATE TABLE projects (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title           TEXT NOT NULL,
    slug            TEXT UNIQUE NOT NULL,
    description     TEXT,
    body            TEXT,
    tech_stack      TEXT[] NOT NULL DEFAULT '{}',
    platforms       TEXT[] NOT NULL DEFAULT '{}',
    live_url        TEXT,
    repo_url        TEXT,
    app_store_url   TEXT,
    image_url       TEXT,
    featured        BOOLEAN DEFAULT false,
    published       BOOLEAN DEFAULT false,
    created_at      TIMESTAMPTZ DEFAULT now(),
    updated_at      TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_projects_slug ON projects(slug);
CREATE INDEX idx_projects_published ON projects(published);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE IF EXISTS projects;
-- +goose StatementEnd