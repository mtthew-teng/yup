package database

import (
	"log"

	"github.com/mtthew-teng/Turion-GSW-Take-Home/config"
	"github.com/mtthew-teng/Turion-GSW-Take-Home/models"
)

func InsertTelemetry(t models.Telemetry) error {
	result := config.DB.Create(&t)
	if result.Error != nil {
		log.Println("Failed to insert telemetry:", result.Error)
		return result.Error
	}

	return nil
}
