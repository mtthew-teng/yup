package main

import (
	"log"
	"sync"

	"github.com/mtthew-teng/Turion-GSW-Take-Home/backend/internal/api"
	"github.com/mtthew-teng/Turion-GSW-Take-Home/backend/internal/config"
	"github.com/mtthew-teng/Turion-GSW-Take-Home/backend/internal/repository"
	"github.com/mtthew-teng/Turion-GSW-Take-Home/backend/internal/telemetry"
	"github.com/mtthew-teng/Turion-GSW-Take-Home/backend/internal/websocket"
)

func main() {
	log.Println("Starting Telemetry Services...")

	// Load configuration
	cfg := config.LoadConfig()

	// Initialize WebSocket server
	wsServer := websocket.NewWebSocketServer()
	wsServer.Start()

	// Initialize database connection
	repo := repository.NewTelemetryRepository(cfg, wsServer)

	var wg sync.WaitGroup
	wg.Add(2)

	// Start the UDP telemetry server
	go func() {
		defer wg.Done()
		telemetryServer := telemetry.NewTelemetryServer(repo, "8089")
		telemetryServer.Start()
	}()

	// Start the API server
	go func() {
		defer wg.Done()
		apiServer := api.NewAPIServer(repo, "3000", wsServer)
		apiServer.Start()
	}()

	wg.Wait()
}
