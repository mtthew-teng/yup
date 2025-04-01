package handlers

import (
	"strconv"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/mtthew-teng/Turion-GSW-Take-Home/backend/internal/repository"
)

// TelemetryHandler handles API requests for telemetry data
type TelemetryHandler struct {
	repo *repository.TelemetryRepository
}

// NewTelemetryHandler creates a new handler with the given repository
func NewTelemetryHandler(repo *repository.TelemetryRepository) *TelemetryHandler {
	return &TelemetryHandler{repo: repo}
}

// GetTelemetry handles requests for telemetry data within a time range
func (h *TelemetryHandler) GetTelemetry(c *fiber.Ctx) error {
	startTime, err := time.Parse(time.RFC3339, c.Query("start_time"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid start_time"})
	}

	endTime, err := time.Parse(time.RFC3339, c.Query("end_time"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid end_time"})
	}

	data, err := h.repo.GetTelemetry(startTime, endTime)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Database error"})
	}

	return c.JSON(data)
}

// GetCurrentTelemetry handles requests for the most recent telemetry
func (h *TelemetryHandler) GetCurrentTelemetry(c *fiber.Ctx) error {
	data, err := h.repo.GetLatestTelemetry()
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Database error"})
	}

	return c.JSON(data)
}

// GetAnomalies handles requests for anomalous telemetry data
func (h *TelemetryHandler) GetAnomalies(c *fiber.Ctx) error {
	startTime, err := time.Parse(time.RFC3339, c.Query("start_time"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid start_time"})
	}

	endTime, err := time.Parse(time.RFC3339, c.Query("end_time"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid end_time"})
	}

	data, err := h.repo.GetAnomalies(startTime, endTime)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Database error"})
	}

	return c.JSON(data)
}

// GetAggregatedTelemetry handles requests for statistical telemetry data
func (h *TelemetryHandler) GetAggregatedTelemetry(c *fiber.Ctx) error {
	startTime, err := time.Parse(time.RFC3339, c.Query("start_time"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid start_time"})
	}

	endTime, err := time.Parse(time.RFC3339, c.Query("end_time"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid end_time"})
	}

	data, err := h.repo.GetAggregatedTelemetry(startTime, endTime)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Database error"})
	}

	return c.JSON(data)
}

// GetLastTelemetry handles requests for the last N telemetry records
func (h *TelemetryHandler) GetLastTelemetry(c *fiber.Ctx) error {
	countParam := c.Params("count")
	count, err := strconv.Atoi(countParam)
	if err != nil || count <= 0 {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid count parameter",
		})
	}

	data, err := h.repo.GetLastTelemetry(count)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Database error",
		})
	}

	return c.JSON(data)
}

// GetPaginatedTelemetry handles requests for paginated telemetry data
func (h *TelemetryHandler) GetPaginatedTelemetry(c *fiber.Ctx) error {
	page, err := strconv.Atoi(c.Query("page", "1"))
	if err != nil || page < 1 {
		page = 1
	}

	limit, err := strconv.Atoi(c.Query("limit", "10"))
	if err != nil || limit < 1 {
		limit = 20
	}

	// Optional time filters
	var startTime, endTime *time.Time

	if s := c.Query("start_time"); s != "" {
		t, err := time.Parse(time.RFC3339, s)
		if err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid start_time"})
		}
		startTime = &t
	}

	if e := c.Query("end_time"); e != "" {
		t, err := time.Parse(time.RFC3339, e)
		if err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid end_time"})
		}
		endTime = &t
	}

	// Optional anomaly filter
	var anomalyFilter *bool
	if a := c.Query("anomaly"); a != "" {
		if a == "true" {
			t := true
			anomalyFilter = &t
		} else if a == "false" {
			f := false
			anomalyFilter = &f
		}
	}

	data, total, err := h.repo.GetPaginatedTelemetry(page, limit, startTime, endTime, anomalyFilter)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{
			"error": "Could not fetch telemetry data",
		})
	}

	totalPages := (total + int64(limit) - 1) / int64(limit)

	return c.JSON(fiber.Map{
		"data":        data,
		"page":        page,
		"limit":       limit,
		"total":       total,
		"total_pages": totalPages,
	})
}
