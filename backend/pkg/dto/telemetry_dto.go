package dto

// AggregatedTelemetry stores min, max, and average values of telemetry data
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

// PaginatedResponse is a wrapper for paginated data
type PaginatedResponse struct {
	Data       interface{} `json:"data"`
	Page       int         `json:"page"`
	Limit      int         `json:"limit"`
	Total      int64       `json:"total"`
	TotalPages int64       `json:"total_pages"`
}
