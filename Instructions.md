### About this starter code:
This is a sample telemetry generator that sends spacecraft data over UDP. While you're welcome to use it as-is, you can also implement a simpler solution. The key requirement is the ability to:
- Serialize data into bytes
- Send those bytes over UDP
- Deserialize the received bytes back into structured data

That's all you need to know to get started!

### Part 1: Telemetry Ingestion Service (Required)
#### Requirements

1. Create a service that:

* listens for UDP packets containing spacecraft telemetry
* Decodes CCSDS-formatted packets according to provided structure
* Validates telemetry values against defined ranges:
```
Temperature: 20.0°C to 30.0°C (normal), >35.0°C (anomaly)
Battery: 70-100% (normal), <40% (anomaly)
Altitude: 500-550km (normal), <400km (anomaly)
Signal Strength: -60 to -40dB (normal), <-80dB (anomaly)
```

* Persists data to a database (Timescale or PostgreSQL preferred but not required.)
* Implements an alerting mechanism for out-of-range values (Anomalies)



## Part 2: Telemetry API Service (Required)
### Requirements
1. Create a REST API using Fiber/Echo (Go), FastAPI (Python), or Express/Fastify (TypeScript) that provides:
   - Historical telemetry queries with time range filtering
   - Aggregation endpoints (min, max, avg) over time periods
   - Current satellite status endpoint
   - Anomaly history endpoint

### API Endpoints (Minimum Required)
```
GET /api/v1/telemetry
  - Query Parameters: 
    - start_time (ISO8601)
    - end_time (ISO8601)
    
GET /api/v1/telemetry/current
  - Returns latest telemetry values

GET /api/v1/telemetry/anomalies
  - Query Parameters:
    - start_time (ISO8601)
    - end_time (ISO8601)
```


### Part 3 Front End Implementation
Create a telemetry dashboard that:
- **Real-time updates:** Display the most recent telemetry values in real time.
- **Historical graphs or tables:** Show historical telemetry data.
- **Anomaly notifications:** Provide real-time anomaly notifications.


### Technical Requirements
- Use **React** (You can use another front end tool, if you do not understand react) for the frontend.

---

### Optional
Candidates can emphasize either frontend or backend through optional requirements:

#### Frontend-Focused Optional Requirements
- **Error handling:** Implement basic error handling and loading states.
- **Responsive design:** Ensure the dashboard works on desktop and mobile.
- **User experience:** Add features like search/filter for telemetry data, dark mode, or theming.
- **Telemetry visualization:** Include charts for telemetry metrics (embedded Grafana is acceptable).

#### Backend-Focused Optional Requirements
- **Database migrations:** Implement migrations for storing telemetry data and managing schema evolution (setting up the system and having one migration is acceptable).
- **Observability:** Use OpenTelemetry to instrument backend APIs and pipelines, with optional visualization using Grafana Tempo, Loki, Prometheus/Mimir.
- **Integration test:** Write integration tests to ensure the API correctly serves telemetry data and handles edge cases (e.g., real-time updates, data gaps).
- **Performance testing:** Include performance benchmarks for real-time update pipelines and historical queries.

---

### Bonus Points
- **Docker Compose:** Provide a working Docker Compose file for local development with all dependencies (frontend, backend, database, observability tools).
- **Comprehensive tests:** Include unit tests, integration tests, and end-to-end tests.
- **Performance testing results:** Provide evidence of load testing or benchmarking (e.g., using tools like JMeter, k6, or Locust).