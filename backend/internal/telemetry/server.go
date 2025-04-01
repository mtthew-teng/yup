package telemetry

import (
	"log"
	"net"

	"github.com/mtthew-teng/Turion-GSW-Take-Home/backend/internal/repository"
	"github.com/mtthew-teng/Turion-GSW-Take-Home/backend/internal/telemetry/processor"
)

// TelemetryServer represents the UDP server for receiving telemetry data
type TelemetryServer struct {
	repo      *repository.TelemetryRepository
	port      string
	processor *processor.TelemetryProcessor
}

// NewTelemetryServer creates a new telemetry server instance
func NewTelemetryServer(repo *repository.TelemetryRepository, port string) *TelemetryServer {
	return &TelemetryServer{
		repo:      repo,
		port:      port,
		processor: processor.NewTelemetryProcessor(),
	}
}

// Start initializes and starts the UDP server
func (s *TelemetryServer) Start() {
	addr, err := net.ResolveUDPAddr("udp", ":"+s.port)
	if err != nil {
		log.Fatal("UDP address resolution error:", err)
	}

	conn, err := net.ListenUDP("udp", addr)
	if err != nil {
		log.Fatal("UDP listen error:", err)
	}
	defer conn.Close()

	log.Printf("UDP server listening on port %s...", s.port)

	buffer := make([]byte, 1024) // Buffer for incoming packets

	// Continuously listen for packets
	for {
		n, _, err := conn.ReadFromUDP(buffer)
		if err != nil {
			log.Println("Error receiving UDP packet:", err)
			continue
		}

		// Process packet in a goroutine
		go s.handlePacket(buffer[:n])
	}
}

// handlePacket processes an incoming UDP packet
func (s *TelemetryServer) handlePacket(data []byte) {
	// Process the packet using the telemetry processor
	telemetry, err := s.processor.ProcessPacket(data)
	if err != nil {
		log.Printf("Error processing telemetry packet: %v", err)
		return
	}

	// Store the telemetry data
	if err := s.repo.InsertTelemetry(telemetry); err != nil {
		log.Printf("Failed to insert telemetry: %v", err)
	}
}
