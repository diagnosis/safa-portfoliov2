package projectstore

import (
	"context"
	"errors"
	"time"

	toolkiterrors "github.com/diagnosis/go-toolkit/errors"
	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgconn"
	"github.com/jackc/pgx/v5/pgxpool"
)

type Project struct {
	ID           uuid.UUID `json:"id"`
	Title        string    `json:"title"`
	Slug         string    `json:"slug"`
	Description  *string   `json:"description,omitempty"`
	Body         *string   `json:"body,omitempty"`
	TechStack    []string  `json:"tech_stack"`
	Platforms    []string  `json:"platforms"`
	LiveURL      *string   `json:"live_url,omitempty"`
	RepoURL      *string   `json:"repo_url,omitempty"`
	AppStoreURL  *string   `json:"app_store_url,omitempty"`
	PlayStoreURL *string   `json:"play_store_url,omitempty"`
	ImageURL     *string   `json:"image_url,omitempty"`
	Screenshots  []string  `json:"screenshots"`
	Problem      *string   `json:"problem,omitempty"`
	Solution     *string   `json:"solution,omitempty"`
	Features     []string  `json:"features"`
	Challenges   []string  `json:"challenges"`
	Learnings    []string  `json:"learnings"`
	Architecture *string   `json:"architecture,omitempty"`
	Featured     bool      `json:"featured"`
	Published    bool      `json:"published"`
	CreatedAt    time.Time `json:"created_at"`
	UpdatedAt    time.Time `json:"updated_at"`
}

type ProjectStore interface {
	Create(ctx context.Context, p *Project) (*Project, error)
	GetBySlug(ctx context.Context, slug string) (*Project, error)
	List(ctx context.Context, publishedOnly bool) ([]*Project, error)
	Update(ctx context.Context, p *Project) (*Project, error)
	Delete(ctx context.Context, id uuid.UUID) error
}

type PGProjectStore struct {
	pool *pgxpool.Pool
}

func NewPGProjectStore(pool *pgxpool.Pool) *PGProjectStore {
	return &PGProjectStore{pool: pool}
}

func (s *PGProjectStore) Create(ctx context.Context, p *Project) (*Project, error) {
	row := s.pool.QueryRow(ctx, `
        INSERT INTO projects 
            (title, slug, description, body, tech_stack, platforms, live_url, repo_url,
             app_store_url, play_store_url, image_url, featured, published,
             screenshots, problem, solution, features, challenges, learnings, architecture)
        VALUES 
            ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20)
        RETURNING *
    `, p.Title, p.Slug, p.Description, p.Body, p.TechStack, p.Platforms,
		p.LiveURL, p.RepoURL, p.AppStoreURL, p.PlayStoreURL, p.ImageURL,
		p.Featured, p.Published,
		p.Screenshots, p.Problem, p.Solution, p.Features, p.Challenges, p.Learnings, p.Architecture)

	project, err := scanProject(row)
	if err != nil {
		var pgErr *pgconn.PgError
		if errors.As(err, &pgErr) && pgErr.Code == "23505" {
			return nil, toolkiterrors.Conflict("slug already exists", "duplicate slug")
		}
		return nil, err
	}
	return project, nil
}

func (s *PGProjectStore) GetBySlug(ctx context.Context, slug string) (*Project, error) {
	row := s.pool.QueryRow(ctx, `
		SELECT * FROM projects WHERE slug = $1
	`, slug)
	return scanProject(row)
}

func (s *PGProjectStore) List(ctx context.Context, publishedOnly bool) ([]*Project, error) {
	query := `SELECT * FROM projects ORDER BY created_at DESC`
	if publishedOnly {
		query = `SELECT * FROM projects WHERE published = true ORDER BY featured DESC, created_at DESC`
	}

	rows, err := s.pool.Query(ctx, query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var projects []*Project
	for rows.Next() {
		p, err := scanProject(rows)
		if err != nil {
			return nil, err
		}
		projects = append(projects, p)
	}
	return projects, nil
}

func (s *PGProjectStore) Update(ctx context.Context, p *Project) (*Project, error) {
	row := s.pool.QueryRow(ctx, `
        UPDATE projects SET
            title = $1, slug = $2, description = $3, body = $4,
            tech_stack = $5, platforms = $6, live_url = $7, repo_url = $8,
            app_store_url = $9, play_store_url = $10, image_url = $11,
            featured = $12, published = $13,
            screenshots = $14, problem = $15, solution = $16,
            features = $17, challenges = $18, learnings = $19, architecture = $20,
            updated_at = now()
        WHERE id = $21
        RETURNING *
    `, p.Title, p.Slug, p.Description, p.Body, p.TechStack, p.Platforms,
		p.LiveURL, p.RepoURL, p.AppStoreURL, p.PlayStoreURL, p.ImageURL,
		p.Featured, p.Published,
		p.Screenshots, p.Problem, p.Solution, p.Features, p.Challenges, p.Learnings, p.Architecture,
		p.ID)
	return scanProject(row)
}

func (s *PGProjectStore) Delete(ctx context.Context, id uuid.UUID) error {
	ct, err := s.pool.Exec(ctx, `DELETE FROM projects WHERE id = $1`, id)
	if err != nil {
		return err
	}
	if ct.RowsAffected() == 0 {
		return toolkiterrors.NotFound("project not found", "project not found")
	}
	return nil
}

type scanner interface {
	Scan(dest ...any) error
}

func scanProject(s scanner) (*Project, error) {
	var p Project
	err := s.Scan(
		&p.ID, &p.Title, &p.Slug, &p.Description, &p.Body,
		&p.TechStack, &p.Platforms, &p.LiveURL, &p.RepoURL,
		&p.AppStoreURL, &p.ImageURL,
		&p.Featured, &p.Published, &p.CreatedAt, &p.UpdatedAt,
		&p.PlayStoreURL,
		&p.Screenshots, &p.Problem, &p.Solution,
		&p.Features, &p.Challenges, &p.Learnings, &p.Architecture,
	)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, toolkiterrors.NotFound("project not found", "project not found")
		}
		return nil, err
	}
	return &p, nil
}
