package blogstore

import (
	"context"
	"errors"
	"time"

	toolkiterrors "github.com/diagnosis/go-toolkit/errors"
	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

type BlogPost struct {
	ID        uuid.UUID `json:"id"`
	Title     string    `json:"title"`
	Slug      string    `json:"slug"`
	Excerpt   *string   `json:"excerpt,omitempty"`
	Body      *string   `json:"body,omitempty"`
	Published bool      `json:"published"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

type BlogStore interface {
	Create(ctx context.Context, post *BlogPost) (*BlogPost, error)
	List(ctx context.Context, publishedOnly bool) ([]*BlogPost, error)
	Get(ctx context.Context, slug string) (*BlogPost, error)
	Update(ctx context.Context, post *BlogPost) (*BlogPost, error)
	Delete(ctx context.Context, id uuid.UUID) error
}

type PGBlogStore struct {
	pool *pgxpool.Pool
}

func NewPGBlogStore(pool *pgxpool.Pool) *PGBlogStore {
	return &PGBlogStore{pool}
}

func (s *PGBlogStore) Create(ctx context.Context, post *BlogPost) (*BlogPost, error) {
	row := s.pool.QueryRow(ctx, `
		INSERT INTO blog_posts (title, slug, excerpt, body, published)
		VALUES ($1, $2, $3, $4, $5)
		RETURNING *
	`, post.Title, post.Slug, post.Excerpt, post.Body, post.Published)
	return scanPost(row)
}

func (s *PGBlogStore) List(ctx context.Context, publishedOnly bool) ([]*BlogPost, error) {
	query := `SELECT * FROM blog_posts ORDER BY created_at DESC`
	if publishedOnly {
		query = `SELECT * FROM blog_posts WHERE published = true ORDER BY created_at DESC`
	}

	rows, err := s.pool.Query(ctx, query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var posts []*BlogPost
	for rows.Next() {
		post, err := scanPost(rows)
		if err != nil {
			return nil, err
		}
		posts = append(posts, post)
	}
	return posts, nil
}

func (s *PGBlogStore) Get(ctx context.Context, slug string) (*BlogPost, error) {
	row := s.pool.QueryRow(ctx, `
		SELECT * FROM blog_posts WHERE slug = $1
	`, slug)
	return scanPost(row)
}

func (s *PGBlogStore) Update(ctx context.Context, post *BlogPost) (*BlogPost, error) {
	row := s.pool.QueryRow(ctx, `
		UPDATE blog_posts SET
			title = $1, slug = $2, excerpt = $3, body = $4,
			published = $5, updated_at = now()
		WHERE id = $6
		RETURNING *
	`, post.Title, post.Slug, post.Excerpt, post.Body, post.Published, post.ID)
	return scanPost(row)
}

func (s *PGBlogStore) Delete(ctx context.Context, id uuid.UUID) error {
	ct, err := s.pool.Exec(ctx, `DELETE FROM blog_posts WHERE id = $1`, id)
	if err != nil {
		return err
	}
	if ct.RowsAffected() == 0 {
		return toolkiterrors.NotFound("post not found", "post not found")
	}
	return nil
}

type scanner interface {
	Scan(dest ...any) error
}

func scanPost(s scanner) (*BlogPost, error) {
	var p BlogPost
	err := s.Scan(
		&p.ID, &p.Title, &p.Slug, &p.Excerpt,
		&p.Body, &p.Published, &p.CreatedAt, &p.UpdatedAt,
	)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, toolkiterrors.NotFound("post not found", "post not found")
		}
		return nil, err
	}
	return &p, nil
}
