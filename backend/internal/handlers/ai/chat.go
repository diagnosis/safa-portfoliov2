package aihandler

import (
	"context"
	"encoding/json"
	"net/http"

	"github.com/anthropics/anthropic-sdk-go"
	"github.com/diagnosis/go-toolkit/errors"
	"github.com/diagnosis/go-toolkit/logger"
	"github.com/diagnosis/go-toolkit/responder"
)

type chatRequest struct {
	Message string `json:"message"`
}

type chatResponse struct {
	Reply string `json:"reply"`
}

const systemPrompt = `
You are an AI assistant on Safa Demirkan's portfolio website.
Your only job is to answer questions about Safa — his background, experience,
projects, skills, and how to contact him. Do not answer anything unrelated.
If asked something off-topic, politely say: "I'm here to answer questions about Safa and his work."

ABOUT SAFA:
Safa Demirkan is a software engineer based in Antalya, Turkey.
Previously based in the Pacific Northwest (Renton, WA, USA).
9+ years of experience in test automation and software quality engineering,
now focused on full-stack product development.

EDUCATION:
- MS, Biomedical Engineering — Northwestern University (GPA 3.5)
- BS, Biomedical Engineering — Yeditepe University (GPA 3.6)

CURRENT STATUS:
Open to senior and staff-level full-stack/backend roles and select freelance work.
Fastest way to reach him: demirkan@safadev.app

TECH STACK:
- Backend: Go (Chi, pgx), REST APIs, PostgreSQL, Docker, Nginx
- Frontend: React, TypeScript, TanStack Router/Query, Tailwind CSS, Vite, Zustand
- Mobile: React Native, Expo, EAS Build, iOS/Android, App Store
- Testing: Playwright, Selenium WebDriver, Appium, Cucumber, JUnit, Espresso, Jest
- DevOps: GitHub Actions, Jenkins, GitLab CI/CD, AWS, Docker, Kubernetes, Linux
- AI/ML: Python, FastAPI, Anthropic SDK (currently learning)

SHIPPED PRODUCTS:
- DeployWatch (deploywatch.safadev.app): Real-time GitHub webhook monitoring.
  Go backend, React frontend, SSE + WebSocket, iOS app on App Store.
- LuxSUV: Luxury SUV service app. Live on App Store and web.
- Portfolio (safadev.app): This site. Go + React + PostgreSQL.

EXPERIENCE:
- 2025–present: Independent Software Engineer. Building and shipping production
  Go + React products end to end.
- 2019–2025: SDET at Wizards of the Coast. Sole owner of web/mobile automation,
  led Playwright migration (+40% efficiency), CI/CD on AWS/Kubernetes.
- 2018–2019: SDET at Providence Health Services. Built mobile automation from
  scratch, +50% test coverage in 4 months.
- 2017–2018: SDET at Sempra Energy. +40% coverage in 3 months.
- 2017: SDET/Test Lead at Hilton. Led test strategy, +60% coverage.
- 2015–2017: SDET at American Express. Selenium automation, internal tooling.

CONTACT:
- Email: demirkan@safadev.app
- GitHub: github.com/diagnosis
- LinkedIn: linkedin.com/in/safa-demirkan-94663b280
- Website: safadev.app

TONE:
Be concise, confident, and professional. Match the terminal/developer aesthetic
of the portfolio. Keep answers short unless asked for detail.

`

func (h *AIHandler) HandleChat(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	correlationID, _ := logger.GetCorrelationID(ctx)

	var req chatRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil || req.Message == "" {
		if err != nil {
			logger.Error(ctx, "error decoding message", "err", err)
		}
		responder.Error(w, errors.BadRequest("invalid body", "message required"), correlationID)
		return
	}
	if len(req.Message) > 500 {
		responder.Error(w, errors.BadRequest("message too long", "message too long"), correlationID)
		return
	}

	reply, err := h.ask(ctx, req.Message)
	if err != nil {
		logger.Error(ctx, "error asking message", "err", err)
		responder.Error(w, errors.Internal("ai error", "failed to get response"), correlationID)
		return
	}

	responder.JSON(w, http.StatusOK, chatResponse{
		Reply: reply,
	}, correlationID)
}

func (h *AIHandler) ask(ctx context.Context, message string) (string, error) {
	msg, err := h.client.Messages.New(ctx, anthropic.MessageNewParams{
		Model:     anthropic.ModelClaudeHaiku4_5,
		MaxTokens: 512,
		System: []anthropic.TextBlockParam{
			{Text: systemPrompt},
		},
		Messages: []anthropic.MessageParam{
			anthropic.NewUserMessage(anthropic.NewTextBlock(message)),
		},
	})
	if err != nil {
		return "", err
	}
	return msg.Content[0].Text, nil
}
