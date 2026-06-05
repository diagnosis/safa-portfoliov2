package projecthandler

import (
	"net/http"

	"github.com/diagnosis/go-toolkit/logger"
	"github.com/diagnosis/go-toolkit/responder"
	"github.com/diagnosis/safa-portfolio/internal/store/project"
)

func (h *ProjectHandler) HandleList(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	correlationID, _ := logger.GetCorrelationID(ctx)

	// public route — only published projects
	projects, err := h.store.List(ctx, true)
	if err != nil {
		logger.Error(ctx, "failed to list projects", "err", err)
		responder.Error(w, err, correlationID)
		return
	}

	if projects == nil {
		projects = []*projectstore.Project{}
	}

	responder.JSON(w, http.StatusOK, map[string]any{
		"projects": projects,
		"count":    len(projects),
	}, correlationID)
}

func (h *ProjectHandler) HandleAdminList(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	correlationID, _ := logger.GetCorrelationID(ctx)

	// admin route — all projects including unpublished
	projects, err := h.store.List(ctx, false)
	if err != nil {
		logger.Error(ctx, "failed to list projects", "err", err)
		responder.Error(w, err, correlationID)
		return
	}

	if projects == nil {
		projects = []*projectstore.Project{}
	}

	responder.JSON(w, http.StatusOK, map[string]any{
		"projects": projects,
		"count":    len(projects),
	}, correlationID)
}
