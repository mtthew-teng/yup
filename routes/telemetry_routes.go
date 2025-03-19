package routes

import (
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/mtthew-teng/Turion-GSW-Take-Home/database"
)

// GetTelemetry retrieves telemetry data within a specified time range.
// It parses `start_time` and `end_time` from query parameters,
// calls `GetTelemetry` from the database package, and returns the result as JSON.
func GetTelemetry(c *fiber.Ctx) error {
	startTime, err := time.Parse(time.RFC3339, c.Query("start_time"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid start_time"})
	}

	endTime, err := time.Parse(time.RFC3339, c.Query("end_time"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid end_time"})
	}

	data, err := database.GetTelemetry(startTime, endTime)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Database error"})
	}

	return c.JSON(data)
}

// GetCurrentTelemetry retrieves the most recent telemetry record.
// It calls `GetLatestTelemetry` from the database package and returns the result as JSON.
func GetCurrentTelemetry(c *fiber.Ctx) error {
	data, err := database.GetLatestTelemetry()
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Database error"})
	}

	return c.JSON(data)
}

// GetAnomalies retrieves anomaly telemetry data within a specified time range.
// It parses `start_time` and `end_time` from query parameters,
// calls `GetAnomalies` from the database package, and returns the result as JSON.
func GetAnomalies(c *fiber.Ctx) error {
	startTime, err := time.Parse(time.RFC3339, c.Query("start_time"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid start_time"})
	}

	endTime, err := time.Parse(time.RFC3339, c.Query("end_time"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid end_time"})
	}

	data, err := database.GetAnomalies(startTime, endTime)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Database error"})
	}

	return c.JSON(data)
}

// GetAggregatedTelemetry retrieves min, max, and average telemetry values within a specified time range.
// It parses `start_time` and `end_time` from query parameters,
// calls `GetAggregatedTelemetry` from the database package, and returns the result as JSON.
func GetAggregatedTelemetry(c *fiber.Ctx) error {
	startTime, err := time.Parse(time.RFC3339, c.Query("start_time"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid start_time"})
	}

	endTime, err := time.Parse(time.RFC3339, c.Query("end_time"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid end_time"})
	}

	data, err := database.GetAggregatedTelemetry(startTime, endTime)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Database error"})
	}

	return c.JSON(data)
}
