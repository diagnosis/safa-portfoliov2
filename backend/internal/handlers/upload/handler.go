package uploadhandler

import "github.com/diagnosis/safa-portfolio/internal/config"

type UploadHandler struct {
	cfg *config.Config
}

func NewUploadHandler(cfg *config.Config) *UploadHandler {
	return &UploadHandler{cfg: cfg}
}
