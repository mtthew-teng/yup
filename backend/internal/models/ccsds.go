package models

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
