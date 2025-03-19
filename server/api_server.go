package server

import (
	"log"

	"github.com/gofiber/fiber/v2"
	"github.com/mtthew-teng/Turion-GSW-Take-Home/routes"
)

// StartAPI initializes and starts the Fiber API server.
func StartAPI() {
	app := fiber.New()

	// Group all API routes under /api/v1
	api := app.Group("/api/v1")

	// Define API endpoints and their corresponding route handlers
	api.Get("/telemetry", routes.GetTelemetry)                     // Retrieves telemetry data for a given time range
	api.Get("/telemetry/current", routes.GetCurrentTelemetry)      // Retrieves the most recent telemetry data
	api.Get("/telemetry/anomalies", routes.GetAnomalies)           // Retrieves anomaly telemetry data for a given time range
	api.Get("/telemetry/aggregate", routes.GetAggregatedTelemetry) // Retrieves min, max, and avg telemetry values

	log.Println("Fiber API running on http://localhost:3000")
	log.Fatal(app.Listen(":3000")) // Start the Fiber server and listen on port 3000
}
