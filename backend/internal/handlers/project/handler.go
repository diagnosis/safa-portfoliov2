package projecthandler

import "github.com/diagnosis/safa-portfolio/internal/store/project"

type ProjectHandler struct {
	store projectstore.ProjectStore
}

func NewProjectHandler(store projectstore.ProjectStore) *ProjectHandler {
	return &ProjectHandler{store: store}
}
