package api

import (
	"log"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/mtthew-teng/Turion-GSW-Take-Home/backend/internal/api/handlers"
	"github.com/mtthew-teng/Turion-GSW-Take-Home/backend/internal/repository"
	"github.com/mtthew-teng/Turion-GSW-Take-Home/backend/internal/websocket"
)

// APIServer represents the REST API server
type APIServer struct {
	repo     *repository.TelemetryRepository
	port     string
	app      *fiber.App
	handlers *handlers.TelemetryHandler
	wsServer *websocket.WebSocketServer
}

// NewAPIServer creates a new API server instance
func NewAPIServer(repo *repository.TelemetryRepository, port string, wsServer *websocket.WebSocketServer) *APIServer {
	app := fiber.New()
	app.Use(cors.New())

	return &APIServer{
		repo:     repo,
		port:     port,
		app:      app,
		handlers: handlers.NewTelemetryHandler(repo),
		wsServer: wsServer,
	}
}

// Start initializes routes and starts the API server
func (s *APIServer) Start() {
	// Group API routes
	api := s.app.Group("/api/v1")

	// Define API endpoints
	api.Get("/telemetry", s.handlers.GetTelemetry)
	api.Get("/telemetry/current", s.handlers.GetCurrentTelemetry)
	api.Get("/telemetry/anomalies", s.handlers.GetAnomalies)
	api.Get("/telemetry/aggregate", s.handlers.GetAggregatedTelemetry)
	api.Get("/telemetry/last/:count", s.handlers.GetLastTelemetry)
	api.Get("/telemetry/paginated", s.handlers.GetPaginatedTelemetry)

	// Setup WebSocket routes
	s.wsServer.HandleWebSocket(s.app)

	log.Printf("Fiber API running on http://localhost:%s", s.port)
	log.Fatal(s.app.Listen(":" + s.port))
}
