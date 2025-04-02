import { useState, useEffect, useCallback } from "react";
import { getPaginatedTelemetry, subscribeTelemetry } from "../services/telemetryService";

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
  const [pauseRealtimeUpdates, setPauseRealtimeUpdates] = useState(false);

  const fetchData = useCallback(async (pageToFetch = page) => {
    try {
      setLoading(true);
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
    } catch (err) {
      console.error("Error fetching paginated telemetry:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [page, limit, filters]);

  // Fetch on mount and whenever page, limit, or filters change
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Set up WebSocket for real-time updates
  useEffect(() => {
    // Only use WebSocket updates on the first page and when not paused
    if (page !== 1 || pauseRealtimeUpdates) return;
    
    // Subscribe to telemetry updates via WebSocket
    const unsubscribe = subscribeTelemetry((newTelemetry) => {
      // Only update if real-time updates are not paused
      if (!pauseRealtimeUpdates) {
        // Update the data array with the new telemetry item
        // Only if we're on the first page and don't have active time filters
        if (page === 1 && !filters.startTime && !filters.endTime) {
          // Check if we should include this item based on anomaly filter
          const shouldInclude = 
            filters.anomaly === null || 
            (filters.anomaly === true && newTelemetry.Anomaly) || 
            (filters.anomaly === false && !newTelemetry.Anomaly);
            
          if (shouldInclude) {
            setData(prevData => {
              // Create a new array with the new telemetry at the beginning
              const updatedData = [newTelemetry, ...prevData.slice(0, limit - 1)];
              return updatedData;
            });
            
            // Increment total count
            setTotal(prevTotal => prevTotal + 1);
            
            // Recalculate total pages if needed
            const newTotalPages = Math.ceil((total + 1) / limit);
            if (newTotalPages !== totalPages) {
              setTotalPages(newTotalPages);
            }
          }
        }
      }
    });
    
    return () => {
      unsubscribe(); // Clean up WebSocket listener
    };
  }, [page, limit, filters, total, totalPages, pauseRealtimeUpdates]);

  // Method to update filters
  const updateFilters = useCallback((newFilters) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters
    }));
    
    // Reset to page 1 when filters change
    if (page !== 1) {
      setPage(1);
    }
  }, [page]);

  // Toggle pause real-time updates
  const setPauseUpdates = useCallback((shouldPause) => {
    setPauseRealtimeUpdates(shouldPause);
  }, []);

  // Check if real-time updates are active
  const isRealtimeActive = page === 1 && !filters.startTime && !filters.endTime && !pauseRealtimeUpdates;

  return {
    data,
    page,
    total,
    totalPages,
    loading,
    error,
    setPage,
    filters,
    updateFilters,
    refreshData: fetchData,
    setPauseUpdates,
    isRealtimeActive
  };
};

export default usePaginatedTelemetry;