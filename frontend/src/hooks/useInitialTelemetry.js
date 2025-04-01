// src/hooks/useInitialTelemetry.js
import { useState, useEffect } from "react";
import { getLastTelemetry } from "../services/telemetryService";

const MAX_ENTRIES = 20;

const useInitialTelemetry = () => {
  const [initialData, setInitialData] = useState([]);
  const [initialLoading, setInitialLoading] = useState(true);
  const [initialError, setInitialError] = useState(null);

  useEffect(() => {
    const fetchInitial = async () => {
      try {
        const data = await getLastTelemetry(MAX_ENTRIES);
        setInitialData(data.reverse()); // Oldest → newest
        setInitialLoading(false);
      } catch (err) {
        console.error("Failed to fetch initial telemetry:", err);
        setInitialError(err.message);
        setInitialLoading(false);
      }
    };

    fetchInitial();
  }, []);

  return { initialData, initialLoading, initialError };
};

export default useInitialTelemetry;
