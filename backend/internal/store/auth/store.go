package authstore

import (
	"context"
	"errors"
	toolkiterrors "github.com/diagnosis/go-toolkit/errors"
	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
	"time"
)

type AuthStore interface {
	CreateCode(ctx context.Context, email, codeHash string, expiresAt time.Time) error
	GetValidationCode(ctx context.Context, email string) (*AuthCode, error)
	MarkCodeUsed(ctx context.Context, id uuid.UUID) error
	CreateRefreshToken(ctx context.Context, tokenHash string, expiresAt time.Time) error
	GetRefreshToken(ctx context.Context, tokenHash string) (*AdminRefreshToken, error)
	DeleteAllRefreshTokens(ctx context.Context) error
}

type AuthCode struct {
	ID        uuid.UUID
	Email     string
	CodeHash  string
	ExpiresAt time.Time
	Used      bool
	CreatedAt time.Time
}
type AdminRefreshToken struct {
	ID        uuid.UUID
	TokenHash string
	ExpiresAt time.Time
	Revoked   bool
	CreatedAt time.Time
}

type PGAuthStore struct {
	pool *pgxpool.Pool
}

func NewPGAuthStore(pool *pgxpool.Pool) *PGAuthStore {
	return &PGAuthStore{pool: pool}
}

func (s *PGAuthStore) CreateCode(ctx context.Context, email, codeHash string, expiresAt time.Time) error {
	_, err := s.pool.Exec(ctx, `
        INSERT INTO auth_codes (email, code_hash, expires_at)
        VALUES ($1, $2, $3)
    `, email, codeHash, expiresAt)
	return err
}

func (s *PGAuthStore) GetValidationCode(ctx context.Context, email string) (*AuthCode, error) {
	row := s.pool.QueryRow(ctx, `
        SELECT id, email, code_hash, expires_at, used, created_at
        FROM auth_codes
        WHERE email = $1 AND used = false AND expires_at > now()
        ORDER BY created_at DESC
        LIMIT 1
    `, email)

	var c AuthCode
	err := row.Scan(&c.ID, &c.Email, &c.CodeHash, &c.ExpiresAt, &c.Used, &c.CreatedAt)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, toolkiterrors.NotFound("code not found", "no valid code found for email")
		}
		return nil, err
	}
	return &c, nil
}

func (s *PGAuthStore) MarkCodeUsed(ctx context.Context, id uuid.UUID) error {
	ct, err := s.pool.Exec(ctx, `
        UPDATE auth_codes SET used = true WHERE id = $1
    `, id)
	if err != nil {
		return err
	}
	if ct.RowsAffected() == 0 {
		return toolkiterrors.NotFound("code not found", "code not found")
	}
	return nil
}

func (s *PGAuthStore) CreateRefreshToken(ctx context.Context, tokenHash string, expiresAt time.Time) error {
	_, err := s.pool.Exec(ctx, `
        INSERT INTO admin_refresh_tokens (token_hash, expires_at)
        VALUES ($1, $2)
    `, tokenHash, expiresAt)
	return err
}

func (s *PGAuthStore) GetRefreshToken(ctx context.Context, tokenHash string) (*AdminRefreshToken, error) {
	row := s.pool.QueryRow(ctx, `
        SELECT id, token_hash, expires_at, revoked, created_at
        FROM admin_refresh_tokens
        WHERE token_hash = $1 AND revoked = false AND expires_at > now()
    `, tokenHash)

	var t AdminRefreshToken
	err := row.Scan(&t.ID, &t.TokenHash, &t.ExpiresAt, &t.Revoked, &t.CreatedAt)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, toolkiterrors.NotFound("token not found", "no valid refresh token found")
		}
		return nil, err
	}
	return &t, nil
}

func (s *PGAuthStore) DeleteAllRefreshTokens(ctx context.Context) error {
	_, err := s.pool.Exec(ctx, `DELETE FROM admin_refresh_tokens`)
	return err
}
