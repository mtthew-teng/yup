package main

import (
	"log"
	"sync"

	"github.com/mtthew-teng/Turion-GSW-Take-Home/config"
	"github.com/mtthew-teng/Turion-GSW-Take-Home/server"
)

func main() {
	log.Println("Starting Telemetry Services...")

	// Initialize database connection
	config.ConnectDB()

	var wg sync.WaitGroup
	wg.Add(2) // Two goroutines: one for the UDP server and one for the API

	// Start the UDP server in a separate goroutine to handle incoming telemetry data
	go func() {
		defer wg.Done()
		server.StartUDPServer()
	}()

	// Start the Fiber API server in a separate goroutine to handle HTTP requests
	go func() {
		defer wg.Done()
		server.StartAPI()
	}()

	// Wait indefinitely to keep both services running
	wg.Wait()
}

// The UDP server runs in an infinite loop, so both the API and UDP server must be
// executed in separate goroutines to run concurrently.
