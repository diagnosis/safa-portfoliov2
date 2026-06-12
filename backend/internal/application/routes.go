// app
package application

import (
	"net/http"
	"time"

	"github.com/diagnosis/go-toolkit/middleware"
	"github.com/go-chi/chi/v5"
)

func SetupRoutes(app *Application) *chi.Mux {
	allowedOrigins := []string{
		"http://localhost:5173",
		"https://safadev.app",
		"https://portfolio.safadev.app",
	}

	r := chi.NewRouter()
	r.Use(middleware.CorrelationID())
	r.Use(middleware.RequestLogger())
	r.Use(middleware.CORS(allowedOrigins))
	r.Use(middleware.RateLimit(10, 20, 5*time.Minute))

	r.Get("/api/health", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte(`{"status":"ok"}`))
	})

	// auth
	r.Post("/api/admin/login", app.authHandler.HandleLogin)
	r.Post("/api/admin/verify", app.authHandler.HandleVerify)
	r.Post("/api/admin/refresh", app.authHandler.HandleRefresh)

	// public
	r.Get("/api/projects", app.projectHandler.HandleList)
	r.Get("/api/projects/{slug}", app.projectHandler.HandleGet)
	r.Get("/api/blog", app.blogHandler.HandleList)
	r.Get("/api/blog/{slug}", app.blogHandler.HandleGet)

	r.With(middleware.RateLimit(5, 5, time.Minute)).Post("/api/ai/chat", app.aiHandler.HandleChat)

	// serve uploaded files
	uploadsDir := http.Dir(app.cfg.Upload.Dir)
	r.Handle("/uploads/*", http.StripPrefix("/uploads/", http.FileServer(uploadsDir)))

	// protected
	r.Group(func(r chi.Router) {
		r.Use(middleware.RequireAuth(app.authHandler.AuthFunc))
		r.Get("/api/admin/me", app.authHandler.HandleMe)
		r.Post("/api/admin/logout", app.authHandler.HandleLogout)

		// projects
		r.Get("/api/admin/projects", app.projectHandler.HandleAdminList)
		r.Post("/api/admin/projects", app.projectHandler.HandleCreate)
		r.Patch("/api/admin/projects/{id}", app.projectHandler.HandleUpdate)
		r.Delete("/api/admin/projects/{id}", app.projectHandler.HandleDelete)

		// blog
		r.Get("/api/admin/blog", app.blogHandler.HandleAdminList)
		r.Post("/api/admin/blog", app.blogHandler.HandleCreate)
		r.Put("/api/admin/blog/{id}", app.blogHandler.HandleUpdate)
		r.Delete("/api/admin/blog/{id}", app.blogHandler.HandleDelete)

		//upload
		r.Post("/api/admin/upload", app.uploadHandler.HandleUpload)
	})

	return r
}
