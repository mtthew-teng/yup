import { useState, useEffect } from "react";
import { getPaginatedTelemetry } from "../services/telemetryService";

const usePaginatedTelemetry = (initialPage = 1, limit = 20, refreshInterval = 1000) => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(initialPage);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    startTime: null,
    endTime: null,
    anomaly: null
  });

  const fetchData = async (pageToFetch = page) => {
    try {
      const params = { page: pageToFetch, limit };
      
      if (filters.startTime) params.start_time = filters.startTime;
      if (filters.endTime) params.end_time = filters.endTime;
      if (filters.anomaly !== null) params.anomaly = filters.anomaly.toString();

      const res = await getPaginatedTelemetry(params);

      if (!res || !Array.isArray(res.data)) {
        throw new Error("API returned invalid data");
      }

      setData(res.data);
      setTotal(res.total);
      setTotalPages(res.total_pages);
      setError(null);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching paginated telemetry:", err);
      setError(err.message);
      setLoading(false);
    }
  };

  // Fetch on mount and whenever page, limit, or filters change
  useEffect(() => {
    setLoading(true);
    fetchData();
  }, [page, limit, filters]);

  // Polling for real-time data if on page 1
  useEffect(() => {
    if (page !== 1) return;

    const interval = setInterval(() => {
      fetchData(1);
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [page, limit, refreshInterval, filters]);

  // Method to update filters
  const updateFilters = (newFilters) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters
    }));
    
    // Reset to page 1 when filters change
    if (page !== 1) {
      setPage(1);
    }
  };

  return {
    data,
    page,
    total,
    totalPages,
    loading,
    error,
    setPage,
    filters,
    updateFilters
  };
};

export default usePaginatedTelemetry;