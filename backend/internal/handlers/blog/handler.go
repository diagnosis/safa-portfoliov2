package bloghandler

import blogstore "github.com/diagnosis/safa-portfolio/internal/store/blog"

type BlogHandler struct {
	store blogstore.BlogStore
}

func NewBlogHandler(blogStore blogstore.BlogStore) *BlogHandler {
	return &BlogHandler{store: blogStore}
}
