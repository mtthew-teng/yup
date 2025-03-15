package models

import "time"

type Telemetry struct {
	ID          uint      `gorm:"primaryKey"`
	Timestamp   time.Time `gorm:"not null"`
	Temperature float32   `gorm:"not null"`
	Battery     float32   `gorm:"not null"`
	Altitude    float32   `gorm:"not null"`
	Signal      float32   `gorm:"not null"`
	Anomaly     bool      `gorm:"not null"`
}
