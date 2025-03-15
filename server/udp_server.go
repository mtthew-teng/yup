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

// CCSDS Primary Header (6 bytes)
type CCSDSPrimaryHeader struct {
	PacketID      uint16 // Version(3 bits), Type(1 bit), SecHdrFlag(1 bit), APID(11 bits)
	PacketSeqCtrl uint16 // SeqFlags(2 bits), SeqCount(14 bits)
	PacketLength  uint16 // Total packet length minus 7
}

// CCSDS Secondary Header (10 bytes)
type CCSDSSecondaryHeader struct {
	Timestamp   uint64 // Unix timestamp
	SubsystemID uint16 // Identifies the subsystem (e.g., power, thermal)
}

// Telemetry Payload
type TelemetryPayload struct {
	Temperature float32 // Temperature in Celsius
	Battery     float32 // Battery percentage
	Altitude    float32 // Altitude in kilometers
	Signal      float32 // Signal strength in dB
}

func StartUDPServer() {
	addr, err := net.ResolveUDPAddr("udp", ":8089")
	if err != nil {
		log.Fatal("UDP address error:", err)
	}

	conn, err := net.ListenUDP("udp", addr)
	if err != nil {
		log.Fatal("UDP listen error:", err)
	}
	defer conn.Close()

	log.Println("UDP server listening on port 8089...")

	buffer := make([]byte, 1024)

	for {
		n, _, err := conn.ReadFromUDP(buffer)
		if err != nil {
			log.Println("Error receiving UDP packet:", err)
			continue
		}

		go processPacket(buffer[:n])
	}
}

func processPacket(data []byte) {
	reader := bytes.NewReader(data)

	primaryHeader := CCSDSPrimaryHeader{}
	secondaryHeader := CCSDSSecondaryHeader{}
	payload := TelemetryPayload{}

	binary.Read(reader, binary.BigEndian, &primaryHeader)
	binary.Read(reader, binary.BigEndian, &secondaryHeader)
	binary.Read(reader, binary.BigEndian, &payload)

	timestamp := time.Unix(int64(secondaryHeader.Timestamp), 0)

	anomaly := payload.Temperature > 35.0 || payload.Battery < 40.0 || payload.Altitude < 400.0 || payload.Signal < -80.0

	telemetry := models.Telemetry{
		Timestamp:   timestamp,
		Temperature: payload.Temperature,
		Battery:     payload.Battery,
		Altitude:    payload.Altitude,
		Signal:      payload.Signal,
		Anomaly:     anomaly,
	}

	err := database.InsertTelemetry(telemetry)
	if err != nil {
		log.Println("Failed to insert telemetry:", err)
	} else {
		log.Printf("Stored telemetry: %+v\n", telemetry)
	}
}
