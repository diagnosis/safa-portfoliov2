package projecthandler

import (
	"net/http"

	"github.com/diagnosis/go-toolkit/errors"
	"github.com/diagnosis/go-toolkit/logger"
	"github.com/diagnosis/go-toolkit/responder"
	"github.com/go-chi/chi/v5"
)

func (h *ProjectHandler) HandleGet(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	correlationID, _ := logger.GetCorrelationID(ctx)

	slug := chi.URLParam(r, "slug")
	if slug == "" {
		responder.Error(w, errors.BadRequest("slug is required", "missing slug"), correlationID)
		return
	}

	project, err := h.store.GetBySlug(ctx, slug)
	if err != nil {
		logger.Error(ctx, "failed to get project", "err", err)
		responder.Error(w, err, correlationID)
		return
	}

	responder.JSON(w, http.StatusOK, map[string]any{
		"project": project,
	}, correlationID)
}
