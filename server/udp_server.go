package server

import (
	"bytes"
	"encoding/binary"
	"log"
	"net"
	"time"

	"github.com/mtthew-teng/Turion-GSW-Take-Home/database"
	"github.com/mtthew-teng/Turion-GSW-Take-Home/models"
)

// CCSDSPrimaryHeader represents the primary header of a CCSDS packet (6 bytes).
type CCSDSPrimaryHeader struct {
	PacketID      uint16 // Version (3 bits) | Type (1 bit) | SecHdrFlag (1 bit) | APID (11 bits)
	PacketSeqCtrl uint16 // SeqFlags (2 bits) | SeqCount (14 bits)
	PacketLength  uint16 // Total packet length minus 7
}

// CCSDSSecondaryHeader represents the secondary header of a CCSDS packet (10 bytes).
type CCSDSSecondaryHeader struct {
	Timestamp   uint64 // Unix timestamp (seconds since epoch)
	SubsystemID uint16 // Identifies the subsystem (e.g., power, thermal)
}

// TelemetryPayload represents the telemetry data payload in a CCSDS packet.
type TelemetryPayload struct {
	Temperature float32 // Temperature in Celsius
	Battery     float32 // Battery percentage (0-100%)
	Altitude    float32 // Altitude in kilometers
	Signal      float32 // Signal strength in decibels (dB)
}

// StartUDPServer initializes and starts a UDP server to receive telemetry packets.
func StartUDPServer() {
	addr, err := net.ResolveUDPAddr("udp", ":8089")
	if err != nil {
		log.Fatal("UDP address resolution error:", err)
	}

	conn, err := net.ListenUDP("udp", addr)
	if err != nil {
		log.Fatal("UDP listen error:", err)
	}
	defer conn.Close()

	log.Println("UDP server listening on port 8089...")

	buffer := make([]byte, 1024) // Buffer to hold incoming UDP packets

	// Continuously listen for incoming packets
	for {
		n, _, err := conn.ReadFromUDP(buffer)
		if err != nil {
			log.Println("Error receiving UDP packet:", err)
			continue
		}

		// Process the received packet in a separate goroutine to avoid blocking
		go processPacket(buffer[:n])
	}
}

// processPacket decodes a received CCSDS telemetry packet and stores it in the database.
func processPacket(data []byte) {
	reader := bytes.NewReader(data)

	// Decode primary header, secondary header, and telemetry payload
	primaryHeader := CCSDSPrimaryHeader{}
	secondaryHeader := CCSDSSecondaryHeader{}
	payload := TelemetryPayload{}

	binary.Read(reader, binary.BigEndian, &primaryHeader)
	binary.Read(reader, binary.BigEndian, &secondaryHeader)
	binary.Read(reader, binary.BigEndian, &payload)

	// Convert timestamp from UNIX format
	timestamp := time.Unix(int64(secondaryHeader.Timestamp), 0)

	// Determine if telemetry contains an anomaly
	anomaly := payload.Temperature > 35.0 || payload.Battery < 40.0 || payload.Altitude < 400.0 || payload.Signal < -80.0

	// Create a telemetry record
	telemetry := models.Telemetry{
		Timestamp:   timestamp,
		Temperature: payload.Temperature,
		Battery:     payload.Battery,
		Altitude:    payload.Altitude,
		Signal:      payload.Signal,
		Anomaly:     anomaly,
	}

	// Insert telemetry data into the database
	err := database.InsertTelemetry(telemetry)
	if err != nil {
		log.Println("Failed to insert telemetry:", err)
	} else {
		log.Printf("Stored telemetry: %+v\n", telemetry)
	}
}
