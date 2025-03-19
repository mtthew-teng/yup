package config

import (
	"fmt"
	"log"
	"os"

	"github.com/joho/godotenv"
	"github.com/mtthew-teng/Turion-GSW-Take-Home/models"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

// DB is the global database connection instance.
var DB *gorm.DB

// ConnectDB initializes the database connection using environment variables.
func ConnectDB() {
	// Load database credentials from .env file if it exists.
	err := godotenv.Load()
	if err != nil {
		log.Println("No .env file found. Using system environment variables.")
	}

	// Retrieve database credentials from environment variables.
	dbHost := os.Getenv("DB_HOST")
	dbPort := os.Getenv("DB_PORT")
	dbUser := os.Getenv("DB_USER")
	dbPassword := os.Getenv("DB_PASSWORD")
	dbName := os.Getenv("DB_NAME")
	sslMode := os.Getenv("SSL_MODE")

	// Construct the Data Source Name (DSN) string for PostgreSQL.
	dsn := fmt.Sprintf("host=%s port=%s user=%s password=%s dbname=%s sslmode=%s",
		dbHost, dbPort, dbUser, dbPassword, dbName, sslMode)

	log.Println("Attempting to connect to the database...")

	// Open a connection to the PostgreSQL database.
	DB, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal("Failed to connect to the database:", err)
	}

	// Ensure the database connection was established successfully.
	if DB == nil {
		log.Fatal("Database connection is nil after initialization.")
	}

	log.Println("Successfully connected to the database.")

	// Perform automatic migrations based on the Telemetry model.
	err = DB.AutoMigrate(&models.Telemetry{})
	if err != nil {
		log.Fatal("Failed to migrate database schema:", err)
	}

	log.Println("Database migration completed successfully.")
}
