-- +goose Up
-- +goose StatementBegin
ALTER TABLE projects ADD COLUMN screenshots  TEXT[] NOT NULL DEFAULT '{}';
ALTER TABLE projects ADD COLUMN problem      TEXT;
ALTER TABLE projects ADD COLUMN solution     TEXT;
ALTER TABLE projects ADD COLUMN features     TEXT[] NOT NULL DEFAULT '{}';
ALTER TABLE projects ADD COLUMN challenges   TEXT[] NOT NULL DEFAULT '{}';
ALTER TABLE projects ADD COLUMN learnings    TEXT[] NOT NULL DEFAULT '{}';
ALTER TABLE projects ADD COLUMN architecture TEXT;
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
ALTER TABLE projects DROP COLUMN screenshots;
ALTER TABLE projects DROP COLUMN problem;
ALTER TABLE projects DROP COLUMN solution;
ALTER TABLE projects DROP COLUMN features;
ALTER TABLE projects DROP COLUMN challenges;
ALTER TABLE projects DROP COLUMN learnings;
ALTER TABLE projects DROP COLUMN architecture;
-- +goose StatementEnd