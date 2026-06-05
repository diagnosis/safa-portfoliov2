package bloghandler

import (
	"net/http"

	"github.com/diagnosis/go-toolkit/logger"
	"github.com/diagnosis/go-toolkit/responder"
	blogstore "github.com/diagnosis/safa-portfolio/internal/store/blog"
)

func (h *BlogHandler) HandleList(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	correlationID, _ := logger.GetCorrelationID(ctx)

	posts, err := h.store.List(ctx, true)
	if err != nil {
		logger.Error(ctx, "failed to list posts", "err", err)
		responder.Error(w, err, correlationID)
		return
	}

	if posts == nil {
		posts = []*blogstore.BlogPost{}
	}

	responder.JSON(w, http.StatusOK, map[string]any{
		"posts": posts,
		"count": len(posts),
	}, correlationID)
}

func (h *BlogHandler) HandleAdminList(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	correlationID, _ := logger.GetCorrelationID(ctx)

	posts, err := h.store.List(ctx, false)
	if err != nil {
		logger.Error(ctx, "failed to list posts", "err", err)
		responder.Error(w, err, correlationID)
		return
	}

	if posts == nil {
		posts = []*blogstore.BlogPost{}
	}

	responder.JSON(w, http.StatusOK, map[string]any{
		"posts": posts,
		"count": len(posts),
	}, correlationID)
}
