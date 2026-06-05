package projecthandler

import (
	"encoding/json"
	"net/http"

	"github.com/diagnosis/go-toolkit/errors"
	"github.com/diagnosis/go-toolkit/logger"
	"github.com/diagnosis/go-toolkit/responder"
	"github.com/diagnosis/go-toolkit/validator"
	"github.com/diagnosis/safa-portfolio/internal/store/project"
	"github.com/go-chi/chi/v5"
	"github.com/google/uuid"
)

func (h *ProjectHandler) HandleUpdate(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	correlationID, _ := logger.GetCorrelationID(ctx)

	idStr := chi.URLParam(r, "id")
	id, err := uuid.Parse(idStr)
	if err != nil {
		responder.Error(w, errors.BadRequest("invalid id", "failed to parse id"), correlationID)
		return
	}

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

	project, err := h.store.Update(ctx, &projectstore.Project{
		ID:           id,
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
		logger.Error(ctx, "failed to update project", "err", err)
		responder.Error(w, err, correlationID)
		return
	}

	responder.JSON(w, http.StatusOK, map[string]any{
		"project": project,
	}, correlationID)
}
