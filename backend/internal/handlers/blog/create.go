package bloghandler

import (
	"encoding/json"
	"net/http"

	"github.com/diagnosis/go-toolkit/logger"
	"github.com/diagnosis/go-toolkit/responder"
	"github.com/diagnosis/go-toolkit/validator"
	blogstore "github.com/diagnosis/safa-portfolio/internal/store/blog"
)

type BlogPostRequest struct {
	Title     string  `json:"title"`
	Slug      string  `json:"slug"`
	Excerpt   *string `json:"excerpt,omitempty"`
	Body      *string `json:"body,omitempty"`
	Published *bool   `json:"published,omitempty"`
}

func (h *BlogHandler) HandleCreate(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	correlationID, _ := logger.GetCorrelationID(ctx)

	var req BlogPostRequest
	r.Body = http.MaxBytesReader(w, r.Body, 5<<20)
	defer r.Body.Close()
	dec := json.NewDecoder(r.Body)
	dec.DisallowUnknownFields()
	err := dec.Decode(&req)
	if err != nil {
		logger.Error(ctx, "failed to parse request", "err", err)
		responder.Error(w, err, correlationID)
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

	post, err := h.store.Create(ctx, &blogstore.BlogPost{

		Title:     req.Title,
		Slug:      req.Slug,
		Excerpt:   req.Excerpt,
		Body:      req.Body,
		Published: published,
	})
	if err != nil {
		logger.Error(ctx, "failed to create post", "err", err)
		responder.Error(w, err, correlationID)
		return
	}

	responder.JSON(w, http.StatusCreated, map[string]any{
		"post": post,
	}, correlationID)

}
