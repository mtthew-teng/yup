package database

import (
	"log"
	"time"

	"github.com/mtthew-teng/Turion-GSW-Take-Home/config"
	"github.com/mtthew-teng/Turion-GSW-Take-Home/models"
)

// AggregatedTelemetry stores min, max, and average values of telemetry data over a time range.
type AggregatedTelemetry struct {
	MinTemperature float32 `json:"min_temperature"`
	MaxTemperature float32 `json:"max_temperature"`
	AvgTemperature float32 `json:"avg_temperature"`
	MinBattery     float32 `json:"min_battery"`
	MaxBattery     float32 `json:"max_battery"`
	AvgBattery     float32 `json:"avg_battery"`
	MinAltitude    float32 `json:"min_altitude"`
	MaxAltitude    float32 `json:"max_altitude"`
	AvgAltitude    float32 `json:"avg_altitude"`
	MinSignal      float32 `json:"min_signal"`
	MaxSignal      float32 `json:"max_signal"`
	AvgSignal      float32 `json:"avg_signal"`
}

// InsertTelemetry saves a new telemetry entry into the database.
func InsertTelemetry(t models.Telemetry) error {
	result := config.DB.Create(&t)
	if result.Error != nil {
		log.Println("Failed to insert telemetry:", result.Error)
		return result.Error
	}
	return nil
}

// GetTelemetry retrieves all telemetry entries within a specified time range.
func GetTelemetry(startTime, endTime time.Time) ([]models.Telemetry, error) {
	var telemetry []models.Telemetry
	result := config.DB.Where("timestamp BETWEEN ? AND ?", startTime, endTime).Find(&telemetry)
	return telemetry, result.Error
}

// GetLatestTelemetry retrieves the most recent telemetry entry.
func GetLatestTelemetry() ([]models.Telemetry, error) {
	var telemetry []models.Telemetry
	result := config.DB.Order("timestamp DESC").First(&telemetry)
	return telemetry, result.Error
}

// GetAnomalies retrieves all telemetry entries within a specified time range where anomalies were detected.
func GetAnomalies(startTime, endTime time.Time) ([]models.Telemetry, error) {
	var anomalies []models.Telemetry
	result := config.DB.Where("timestamp BETWEEN ? AND ? AND anomaly = ?", startTime, endTime, true).Find(&anomalies)
	return anomalies, result.Error
}

// GetAggregatedTelemetry computes min, max, and average values for telemetry data within a specified time range.
func GetAggregatedTelemetry(startTime, endTime time.Time) (AggregatedTelemetry, error) {
	var agg AggregatedTelemetry
	query := `
        SELECT 
            MIN(temperature) AS min_temperature, MAX(temperature) AS max_temperature, AVG(temperature) AS avg_temperature,
            MIN(battery) AS min_battery, MAX(battery) AS max_battery, AVG(battery) AS avg_battery,
            MIN(altitude) AS min_altitude, MAX(altitude) AS max_altitude, AVG(altitude) AS avg_altitude,
            MIN(signal) AS min_signal, MAX(signal) AS max_signal, AVG(signal) AS avg_signal
        FROM telemetries
        WHERE timestamp BETWEEN ? AND ?
    `
	result := config.DB.Raw(query, startTime, endTime).Scan(&agg)
	if result.Error != nil {
		log.Println("Error fetching aggregated telemetry:", result.Error)
	}
	return agg, result.Error
}
