import axios from "axios";

const API_URL = "http://localhost:3000/api/v1";
const WS_URL = "ws://localhost:3000/ws/telemetry";

let socket = null;
let telemetryListeners = [];
let isConnecting = false;
let reconnectAttempts = 0;
const MAX_RECONNECT_ATTEMPTS = 5;

// Initialize and manage WebSocket connection
export const initWebSocket = () => {
  if (socket !== null || isConnecting) return;
  
  isConnecting = true;
  console.log("Initializing WebSocket connection to:", WS_URL);
  
  socket = new WebSocket(WS_URL);
  
  socket.onopen = () => {
    console.log("WebSocket connection established");
    isConnecting = false;
    reconnectAttempts = 0;
  };
  
  socket.onmessage = (event) => {
    try {
      const telemetry = JSON.parse(event.data);
      console.log("WebSocket received telemetry:", telemetry);
      
      // Notify all listeners about the new telemetry data
      telemetryListeners.forEach((callback) => callback(telemetry));
    } catch (error) {
      console.error("Error parsing WebSocket message:", error);
    }
  };
  
  socket.onclose = (event) => {
    console.log("WebSocket connection closed:", event.code, event.reason);
    socket = null;
    isConnecting = false;
    
    // Attempt to reconnect with exponential backoff
    if (reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
      const delay = Math.min(1000 * (2 ** reconnectAttempts), 30000);
      console.log(`Attempting to reconnect in ${delay/1000} seconds...`);
      
      setTimeout(() => {
        reconnectAttempts++;
        initWebSocket();
      }, delay);
    } else {
      console.error("Maximum reconnection attempts reached.");
    }
  };
  
  socket.onerror = (error) => {
    console.error("WebSocket error:", error);
  };
};

// Close the WebSocket connection gracefully
export const closeWebSocket = () => {
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.close();
  }
};

// Subscribe to real-time telemetry updates
export const subscribeTelemetry = (callback) => {
  // Initialize WebSocket if not already done
  if (!socket) {
    initWebSocket();
  }
  
  // Add the callback to listeners
  telemetryListeners.push(callback);
  
  // Return unsubscribe function
  return () => {
    telemetryListeners = telemetryListeners.filter(cb => cb !== callback);
    
    // Close socket if no more listeners
    if (telemetryListeners.length === 0) {
      closeWebSocket();
    }
  };
};

export const getCurrentTelemetry = async () => {
  try {
    console.log("Fetching telemetry from:", `${API_URL}/telemetry/current`);
    const response = await axios.get(`${API_URL}/telemetry/current`);

    if (!response.data) {
      console.error("API returned null data");
      return null;
    }

    return response.data;
  } catch (error) {
    console.error("API request failed:", error);
    return null;
  }
};

export const getLastTelemetry = async (count) => {
  try {
    console.log("Fetching last X telemetry from:", `${API_URL}/telemetry/last/${count}`);
    const response = await axios.get(`${API_URL}/telemetry/last/${count}`);

    if (!response.data) {
      console.error("API returned null data");
      return null;
    }

    return response.data;
  } catch (error) {
    console.error("API request failed:", error);
    return [];
  }
};

export const getAggregatedTelemetry = async (startTime, endTime) => {
  try {
    const response = await axios.get(`${API_URL}/telemetry/aggregate`, {
      params: { start_time: startTime, end_time: endTime },
    });

    if (!response.data) {
      console.error("API returned null data for aggregation");
      return null;
    }

    return response.data;
  } catch (error) {
    console.error("API aggregation request failed:", error);
    return null;
  }
};

export const getPaginatedTelemetry = async (params = {}) => {
  try {
    const response = await axios.get(`${API_URL}/telemetry/paginated`, { params });
    console.log("API Response:", response.data);
    return response.data;
  } catch (error) {
    console.error("API paginated request failed:", error);
    throw error;
  }
};