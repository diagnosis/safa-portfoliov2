package projecthandler

import (
	"encoding/json"
	"net/http"

	"github.com/diagnosis/go-toolkit/errors"
	"github.com/diagnosis/go-toolkit/logger"
	"github.com/diagnosis/go-toolkit/responder"
	"github.com/diagnosis/go-toolkit/validator"
	"github.com/diagnosis/safa-portfolio/internal/store/project"
)

type createProjectRequest struct {
	Title        string   `json:"title"`
	Slug         string   `json:"slug"`
	Description  *string  `json:"description"`
	Body         *string  `json:"body"`
	TechStack    []string `json:"tech_stack"`
	Platforms    []string `json:"platforms"`
	LiveURL      *string  `json:"live_url"`
	RepoURL      *string  `json:"repo_url"`
	AppStoreURL  *string  `json:"app_store_url"`
	PlayStoreURL *string  `json:"play_store_url"`
	ImageURL     *string  `json:"image_url"`
	Screenshots  []string `json:"screenshots"`
	Problem      *string  `json:"problem"`
	Solution     *string  `json:"solution"`
	Features     []string `json:"features"`
	Challenges   []string `json:"challenges"`
	Learnings    []string `json:"learnings"`
	Architecture *string  `json:"architecture"`
	Featured     bool     `json:"featured"`
	Published    bool     `json:"published"`
}

func (h *ProjectHandler) HandleCreate(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	correlationID, _ := logger.GetCorrelationID(ctx)

	var req createProjectRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		responder.Error(w, errors.BadRequest("invalid body", "failed to decode body"), correlationID)
		return
	}

	v := validator.New()
	v.Required("title", req.Title)
	v.Required("slug", req.Slug)
	if err := v.Errors(); err != nil {
		responder.Error(w, err, correlationID)
		return
	}

	if req.TechStack == nil {
		req.TechStack = []string{}
	}
	if req.Platforms == nil {
		req.Platforms = []string{}
	}

	project, err := h.store.Create(ctx, &projectstore.Project{
		Title:        req.Title,
		Slug:         req.Slug,
		Description:  req.Description,
		Body:         req.Body,
		TechStack:    req.TechStack,
		Platforms:    req.Platforms,
		LiveURL:      req.LiveURL,
		RepoURL:      req.RepoURL,
		AppStoreURL:  req.AppStoreURL,
		PlayStoreURL: req.PlayStoreURL,
		ImageURL:     req.ImageURL,
		Featured:     req.Featured,
		Published:    req.Published,
	})
	if err != nil {
		logger.Error(ctx, "failed to create project", "err", err)
		responder.Error(w, err, correlationID)
		return
	}

	responder.JSON(w, http.StatusCreated, map[string]any{
		"project": project,
	}, correlationID)
}
