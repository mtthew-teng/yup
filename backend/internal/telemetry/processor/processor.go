package processor

import (
	"bytes"
	"encoding/binary"
	"time"

	"github.com/mtthew-teng/Turion-GSW-Take-Home/backend/internal/models"
)

// TelemetryProcessor processes CCSDS telemetry packets
type TelemetryProcessor struct{}

// NewTelemetryProcessor creates a new processor instance
func NewTelemetryProcessor() *TelemetryProcessor {
	return &TelemetryProcessor{}
}

// ProcessPacket decodes a CCSDS packet and returns a telemetry model
func (p *TelemetryProcessor) ProcessPacket(data []byte) (models.Telemetry, error) {
	reader := bytes.NewReader(data)

	// Decode headers and payload
	primaryHeader := models.CCSDSPrimaryHeader{}
	secondaryHeader := models.CCSDSSecondaryHeader{}
	payload := models.TelemetryPayload{}

	if err := binary.Read(reader, binary.BigEndian, &primaryHeader); err != nil {
		return models.Telemetry{}, err
	}

	if err := binary.Read(reader, binary.BigEndian, &secondaryHeader); err != nil {
		return models.Telemetry{}, err
	}

	if err := binary.Read(reader, binary.BigEndian, &payload); err != nil {
		return models.Telemetry{}, err
	}

	// Convert timestamp
	timestamp := time.Unix(int64(secondaryHeader.Timestamp), 0)

	// Check for anomalies
	anomaly := p.DetectAnomaly(payload)

	// Create telemetry record
	telemetry := models.Telemetry{
		Timestamp:   timestamp,
		Temperature: payload.Temperature,
		Battery:     payload.Battery,
		Altitude:    payload.Altitude,
		Signal:      payload.Signal,
		Anomaly:     anomaly,
	}

	return telemetry, nil
}

// DetectAnomaly checks telemetry values against defined thresholds
func (p *TelemetryProcessor) DetectAnomaly(payload models.TelemetryPayload) bool {
	return payload.Temperature > 35.0 ||
		payload.Battery < 40.0 ||
		payload.Altitude < 400.0 ||
		payload.Signal < -80.0
}
