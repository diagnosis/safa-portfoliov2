package bloghandler

import (
	"encoding/json"
	"net/http"

	"github.com/diagnosis/go-toolkit/errors"
	"github.com/diagnosis/go-toolkit/logger"
	"github.com/diagnosis/go-toolkit/responder"
	"github.com/diagnosis/go-toolkit/validator"
	blogstore "github.com/diagnosis/safa-portfolio/internal/store/blog"
	"github.com/go-chi/chi/v5"
	"github.com/google/uuid"
)

func (h *BlogHandler) HandleUpdate(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	correlationID, _ := logger.GetCorrelationID(ctx)

	idStr := chi.URLParam(r, "id")
	id, err := uuid.Parse(idStr)
	if err != nil {
		responder.Error(w, errors.BadRequest("invalid id", "failed to parse id"), correlationID)
		return
	}

	var req BlogPostRequest
	r.Body = http.MaxBytesReader(w, r.Body, 5<<20)
	defer r.Body.Close()
	dec := json.NewDecoder(r.Body)
	dec.DisallowUnknownFields()
	if err := dec.Decode(&req); err != nil {
		logger.Error(ctx, "failed to parse request", "err", err)
		responder.Error(w, errors.BadRequest("invalid body", "failed to decode body"), correlationID)
		return
	}

	v := validator.New()
	v.Required("title", req.Title)
	v.Required("slug", req.Slug)
	if werr := v.Errors(); werr != nil {
		responder.Error(w, werr, correlationID)
		return
	}

	published := false
	if req.Published != nil {
		published = *req.Published
	}

	post, err := h.store.Update(ctx, &blogstore.BlogPost{
		ID:        id,
		Title:     req.Title,
		Slug:      req.Slug,
		Excerpt:   req.Excerpt,
		Body:      req.Body,
		Published: published,
	})
	if err != nil {
		logger.Error(ctx, "failed to update post", "err", err)
		responder.Error(w, err, correlationID)
		return
	}

	responder.JSON(w, http.StatusOK, map[string]any{
		"post": post,
	}, correlationID)
}
