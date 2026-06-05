-- +goose Up
-- +goose StatementBegin
ALTER TABLE projects ADD COLUMN play_store_url TEXT;
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
ALTER TABLE projects DROP COLUMN play_store_url;
-- +goose StatementEnd
