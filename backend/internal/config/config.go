package config

import (
	"fmt"
	"os"
	"strconv"
	"time"
)

type Config struct {
	Database DatabaseConfig
	App      AppConfig
	JWT      JWTConfig
	Admin    AdminConfig
	Zepto    ZeptoConfig
	Upload   UploadConfig
	AI       AIConfig
	Resend   ResendConfig
}

type DatabaseConfig struct {
	DSN               string
	MinConns          int32
	MaxConns          int32
	MaxConnLifetime   time.Duration
	MaxConnIdleTime   time.Duration
	HealthCheckPeriod time.Duration
	ConnectTimeout    time.Duration
}

type AppConfig struct {
	Env         string
	Port        string
	BaseURL     string
	FrontendURL string
}

type JWTConfig struct {
	AccessSecret       string
	RefreshSecret      string
	AccessTokenExpiry  time.Duration
	RefreshTokenExpiry time.Duration
	Issuer             string
	Audience           string
}

type AdminConfig struct {
	Email string
}

type ZeptoConfig struct {
	APIKey    string
	FromEmail string
	FromName  string
	UserName  string
}

type UploadConfig struct {
	Dir     string
	BaseURL string
}

type AIConfig struct {
	AnthropicAPIKey string
}
type ResendConfig struct {
	APIKey    string
	FromEmail string
}

func Load() (*Config, error) {
	dsn := getEnv("DATABASE_URL", "")
	if dsn == "" {
		return nil, fmt.Errorf("DATABASE_URL is required")
	}

	accessSecret := getEnv("JWT_ACCESS_SECRET", "")
	if accessSecret == "" {
		return nil, fmt.Errorf("JWT_ACCESS_SECRET is required")
	}

	refreshSecret := getEnv("JWT_REFRESH_SECRET", "")
	if refreshSecret == "" {
		return nil, fmt.Errorf("JWT_REFRESH_SECRET is required")
	}

	adminEmail := getEnv("ADMIN_EMAIL", "")
	if adminEmail == "" {
		return nil, fmt.Errorf("ADMIN_EMAIL is required")
	}

	zeptoKey := getEnv("ZEPTO_API_KEY", "")
	if zeptoKey == "" {
		return nil, fmt.Errorf("ZEPTO_API_KEY is required")
	}

	anthropicKey := getEnv("ANTHROPIC_API_KEY", "")
	if anthropicKey == "" {
		return nil, fmt.Errorf("ANTHROPIC_API_KEY is required")
	}

	return &Config{
		Database: DatabaseConfig{
			DSN:               dsn,
			MinConns:          getEnvInt32("DB_MIN_CONNS", 2),
			MaxConns:          getEnvInt32("DB_MAX_CONNS", 10),
			MaxConnLifetime:   getEnvDuration("DB_MAX_CONN_LIFETIME", 1*time.Hour),
			MaxConnIdleTime:   getEnvDuration("DB_MAX_CONN_IDLE_TIME", 30*time.Minute),
			HealthCheckPeriod: getEnvDuration("DB_HEALTH_CHECK_PERIOD", 1*time.Minute),
			ConnectTimeout:    getEnvDuration("DB_CONNECT_TIMEOUT", 10*time.Second),
		},
		App: AppConfig{
			Env:         getEnv("APP_ENV", "dev"),
			Port:        getEnv("PORT", "8080"),
			BaseURL:     getEnv("BASE_URL", "http://localhost:8080"),
			FrontendURL: getEnv("FRONTEND_URL", "http://localhost:3000"),
		},
		JWT: JWTConfig{
			AccessSecret:       accessSecret,
			RefreshSecret:      refreshSecret,
			AccessTokenExpiry:  getEnvDuration("JWT_ACCESS_EXPIRY", 15*time.Minute),
			RefreshTokenExpiry: getEnvDuration("JWT_REFRESH_EXPIRY", 168*time.Hour),
			Issuer:             getEnv("JWT_ISSUER", "safa-portfolio"),
			Audience:           getEnv("JWT_AUDIENCE", "safa-portfolio-api"),
		},
		Admin: AdminConfig{
			Email: adminEmail,
		},
		Zepto: ZeptoConfig{
			APIKey:    zeptoKey,
			FromEmail: getEnv("ZEPTO_FROM_EMAIL", ""),
			FromName:  getEnv("ZEPTO_FROM_NAME", "Safa Portfolio"),
			UserName:  getEnv("ZEPTO_USER_NAME", ""),
		},
		Upload: UploadConfig{
			Dir:     getEnv("UPLOAD_DIR", "./uploads"),
			BaseURL: getEnv("UPLOAD_BASE_URL", "http://localhost:8080/uploads"),
		},
		AI: AIConfig{
			AnthropicAPIKey: anthropicKey,
		},
		Resend: ResendConfig{
			APIKey:    getEnv("RESEND_API_KEY", ""),
			FromEmail: getEnv("RESEND_FROM_EMAIL", "onboarding@resend.dev"),
		},
	}, nil
}

func getEnv(key, def string) string {
	val := os.Getenv(key)
	if val == "" {
		return def
	}
	return val
}

func getEnvInt32(key string, def int32) int32 {
	val := os.Getenv(key)
	if val == "" {
		return def
	}
	i, err := strconv.ParseInt(val, 10, 32)
	if err != nil {
		return def
	}
	return int32(i)
}

func getEnvDuration(key string, def time.Duration) time.Duration {
	val := os.Getenv(key)
	if val == "" {
		return def
	}
	d, err := time.ParseDuration(val)
	if err != nil {
		return def
	}
	return d
}
