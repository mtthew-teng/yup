package models

import "time"

// Telemetry represents a database record for spacecraft telemetry data.
type Telemetry struct {
	ID          uint      `gorm:"primaryKey"` // Unique identifier for the telemetry record
	Timestamp   time.Time `gorm:"not null"`   // Time when the telemetry data was recorded
	Temperature float32   `gorm:"not null"`   // Temperature in degrees Celsius
	Battery     float32   `gorm:"not null"`   // Battery percentage (0-100%)
	Altitude    float32   `gorm:"not null"`   // Altitude in kilometers
	Signal      float32   `gorm:"not null"`   // Signal strength in decibels (dB)
	Anomaly     bool      `gorm:"not null"`   // Indicates if the entry contains an anomaly (true = anomaly detected)
}
