.PHONY: help run build migrate-up migrate-down migrate-status migrate-reset migrate-create

help:
	@echo "Available commands:"
	@echo "  make run           - Run the application"
	@echo "  make build         - Build the application"
	@echo "  make migrate-up    - Run all pending migrations"
	@echo "  make migrate-down  - Rollback last migration"

include .env
export

DB_URL := $(DATABASE_URL)

run:
	go run cmd/api/main.go

build:
	go build -o bin/api cmd/api/main.go

migrate-up:
	goose -dir migrations postgres "$(DB_URL)" up

migrate-down:
	goose -dir migrations postgres "$(DB_URL)" down

migrate-status:
	goose -dir migrations postgres "$(DB_URL)" status

migrate-reset:
	goose -dir migrations postgres "$(DB_URL)" reset

migrate-create:
	goose -dir migrations create $(NAME) sql