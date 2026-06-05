-- +goose Up
-- +goose StatementBegin
CREATE TABLE blog_posts (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title       TEXT NOT NULL,
    slug        TEXT UNIQUE NOT NULL,
    excerpt     TEXT,
    body        TEXT,
    published   BOOLEAN DEFAULT false,
    created_at  TIMESTAMPTZ DEFAULT now(),
    updated_at  TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX idx_blog_posts_published ON blog_posts(published);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE IF EXISTS blog_posts;
-- +goose StatementEnd