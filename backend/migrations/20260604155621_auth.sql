-- +goose Up
-- +goose StatementBegin
CREATE TABLE auth_codes(
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT NOT NULL,
    code_hash TEXT NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    used       BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now()
);
CREATE TABLE admin_refresh_tokens (
    id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    token_hash TEXT UNIQUE NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    revoked    BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_auth_codes_email ON auth_codes(email);
CREATE INDEX idx_admin_refresh_tokens_hash ON admin_refresh_tokens(token_hash);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE IF EXISTS admin_refresh_tokens;
DROP TABLE IF EXISTS auth_codes;
-- +goose StatementEnd
