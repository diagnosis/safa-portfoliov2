package aihandler

import (
	"github.com/anthropics/anthropic-sdk-go"
	"github.com/anthropics/anthropic-sdk-go/option"
	"github.com/diagnosis/safa-portfolio/internal/config"
)

type AIHandler struct {
	cfg    *config.Config
	client *anthropic.Client
}

func NewAIHandler(cfg *config.Config) *AIHandler {
	return &AIHandler{
		cfg: cfg,
		client: new(anthropic.NewClient(
			option.WithAPIKey(cfg.AI.AnthropicAPIKey),
		)),
	}
}
