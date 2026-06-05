package uploadhandler

import (
	"fmt"
	"io"
	"net/http"
	"os"
	"path/filepath"
	"strings"
	"time"

	"github.com/diagnosis/go-toolkit/errors"
	"github.com/diagnosis/go-toolkit/logger"
	"github.com/diagnosis/go-toolkit/responder"
)

const maxUploadSize = 1 << 20

func (h *UploadHandler) HandleUpload(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	correlationID, _ := logger.GetCorrelationID(ctx)

	r.Body = http.MaxBytesReader(w, r.Body, maxUploadSize)
	defer r.Body.Close()
	if err := r.ParseMultipartForm(maxUploadSize); err != nil {
		responder.Error(w, errors.BadRequest("file too large", "max 1MB"), correlationID)
		return
	}

	file, header, err := r.FormFile("image")
	if err != nil {
		responder.Error(w, errors.BadRequest("image field required", "missing image"), correlationID)
		return
	}

	defer file.Close()

	ext := strings.ToLower(filepath.Ext(header.Filename))
	allowed := map[string]bool{".webp": true, ".jpg": true, ".jpeg": true, ".png": true}
	if !allowed[ext] {
		responder.Error(w, errors.BadRequest("invalid file type", "only webp/jpg/png allowed"), correlationID)
		return
	}
	if err := os.MkdirAll(h.cfg.Upload.Dir, 0755); err != nil {
		logger.Error(ctx, "failed to create upload dir", "err", err)
		responder.Error(w, errors.Internal("upload failed", "failed to create dir"), correlationID)
		return
	}
	// unique filename using timestamp
	filename := fmt.Sprintf("%d%s", time.Now().UnixNano(), ext)
	destPath := filepath.Join(h.cfg.Upload.Dir, filename)

	dest, err := os.Create(destPath)
	if err != nil {
		logger.Error(ctx, "failed to create file", "err", err)
		responder.Error(w, errors.Internal("upload failed", "failed to create file"), correlationID)
		return
	}
	defer dest.Close()

	if _, err := io.Copy(dest, file); err != nil {
		logger.Error(ctx, "failed to write file", "err", err)
		responder.Error(w, errors.Internal("upload failed", "failed to write file"), correlationID)
		return
	}

	url := fmt.Sprintf("%s/%s", strings.TrimRight(h.cfg.Upload.BaseURL, "/"), filename)
	logger.Info(ctx, "file uploaded", "filename", filename)

	responder.JSON(w, http.StatusCreated, map[string]string{
		"url": url,
	}, correlationID)
}
