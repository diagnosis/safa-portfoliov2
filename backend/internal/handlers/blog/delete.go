package bloghandler

import (
	"net/http"

	"github.com/diagnosis/go-toolkit/errors"
	"github.com/diagnosis/go-toolkit/logger"
	"github.com/diagnosis/go-toolkit/responder"
	"github.com/go-chi/chi/v5"
	"github.com/google/uuid"
)

func (h *BlogHandler) HandleDelete(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	correlationID, _ := logger.GetCorrelationID(ctx)

	idStr := chi.URLParam(r, "id")
	id, err := uuid.Parse(idStr)
	if err != nil {
		responder.Error(w, errors.BadRequest("invalid id", "failed to parse id"), correlationID)
		return
	}

	if err := h.store.Delete(ctx, id); err != nil {
		logger.Error(ctx, "failed to delete post", "err", err)
		responder.Error(w, err, correlationID)
		return
	}

	responder.JSON(w, http.StatusOK, map[string]string{
		"message": "post deleted",
	}, correlationID)
}
