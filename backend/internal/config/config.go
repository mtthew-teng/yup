package config

import (
	"log"
	"os"

	"github.com/joho/godotenv"
)

type DatabaseConfig struct {
	Host     string
	Port     string
	User     string
	Password string
	Name     string
	SSLMode  string
}

func LoadConfig() *DatabaseConfig {
	// Load database credentials from .env file if it exists
	err := godotenv.Load()
	if err != nil {
		log.Println("No .env file found. Using system environment variables.")
	}

	return &DatabaseConfig{
		Host:     getEnv("DB_HOST", "localhost"),
		Port:     getEnv("DB_PORT", "5432"),
		User:     getEnv("DB_USER", "postgres"),
		Password: getEnv("DB_PASSWORD", ""),
		Name:     getEnv("DB_NAME", "telemetry"),
		SSLMode:  getEnv("SSL_MODE", "disable"),
	}
}

func getEnv(key, fallback string) string {
	if value, exists := os.LookupEnv(key); exists {
		return value
	}
	return fallback
}
