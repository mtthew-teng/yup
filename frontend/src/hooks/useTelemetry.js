import { useState, useEffect } from "react";
import { getCurrentTelemetry, subscribeTelemetry } from "../services/telemetryService";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const useTelemetry = () => {
  const [telemetry, setTelemetry] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // First, get the current telemetry
    const fetchInitialTelemetry = async () => {
      try {
        const data = await getCurrentTelemetry();
        
        if (!data || Object.keys(data).length === 0) {
          throw new Error("API returned empty data");
        }

        // Check for anomalies and trigger notifications
        checkForAnomalies(data);

        setTelemetry(data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching initial telemetry:", err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchInitialTelemetry();

    // Then, subscribe to WebSocket updates
    const unsubscribe = subscribeTelemetry((newTelemetry) => {
      setTelemetry(newTelemetry);
      checkForAnomalies(newTelemetry);
    });

    // Clean up subscription on unmount
    return () => {
      unsubscribe();
    };
  }, []);

  const checkForAnomalies = (data) => {
    if (data.Temperature > 35) {
      toast.error(`High Temperature Alert: ${data.Temperature}°C`);
    }
    if (data.Battery < 40) {
      toast.warn(`Low Battery Alert: ${data.Battery}%`);
    }
    if (data.Altitude < 400) {
      toast.error(`Low Altitude Alert: ${data.Altitude} km`);
    }
    if (data.Signal < -80) {
      toast.warn(`Weak Signal Alert: ${data.Signal} dB`);
    }
  };

  return { telemetry, error, loading };
};

export default useTelemetry;