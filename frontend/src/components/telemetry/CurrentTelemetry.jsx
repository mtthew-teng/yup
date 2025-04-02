import React from "react";
import { FaMountain, FaSignal } from "react-icons/fa";
import { FaTemperatureHalf, FaBatteryHalf } from "react-icons/fa6";
import TelemetryItem from "./TelemetryItem";
import { ToastContainer } from "react-toastify";

const CurrentTelemetry = ({ telemetry, error, loading }) => {
  // Function to determine if a value is anomalous
  const isAnomalous = (type, value) => {
    switch (type) {
      case "Temperature": return value > 35;
      case "Battery": return value < 40;
      case "Altitude": return value < 400;
      case "Signal": return value < -80;
      default: return false;
    }
  };

  return (
    <div className="p-4 md:p-6 bg-white rounded-xl shadow-md h-[350px] flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-900">Current Telemetry</h2>
        {telemetry && !loading && !error && (
          <span className="text-xs font-medium px-2 py-1 rounded-full bg-gray-100">
            {new Date(telemetry.Timestamp).toLocaleString()}
          </span>
        )}
      </div>

      <ToastContainer position="top-right" autoClose={3000} />

      {loading ? (
        <div className="flex justify-center items-center flex-grow">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
            <span className="mt-2 text-sm text-gray-500">Loading telemetry data...</span>
          </div>
        </div>
      ) : error ? (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex-grow flex items-center justify-center">
          <p className="text-red-500 font-medium">{error}</p>
        </div>
      ) : telemetry ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8 flex-grow">
          <TelemetryItem 
            icon={<FaTemperatureHalf className={isAnomalous("Temperature", telemetry.Temperature) ? "text-red-500" : "text-gray-500"} />} 
            label="Temperature" 
            value={telemetry.Temperature} 
            unit="°C" 
            isAnomalous={isAnomalous("Temperature", telemetry.Temperature)}
          />
          <TelemetryItem 
            icon={<FaBatteryHalf className={isAnomalous("Battery", telemetry.Battery) ? "text-amber-500" : "text-gray-500"} />} 
            label="Battery" 
            value={telemetry.Battery} 
            unit="%" 
            isAnomalous={isAnomalous("Battery", telemetry.Battery)}
          />
          <TelemetryItem 
            icon={<FaMountain className={isAnomalous("Altitude", telemetry.Altitude) ? "text-red-500" : "text-gray-500"} />} 
            label="Altitude" 
            value={telemetry.Altitude} 
            unit="km" 
            isAnomalous={isAnomalous("Altitude", telemetry.Altitude)}
          />
          <TelemetryItem 
            icon={<FaSignal className={isAnomalous("Signal", telemetry.Signal) ? "text-amber-500" : "text-gray-500"} />} 
            label="Signal" 
            value={telemetry.Signal} 
            unit="dB" 
            isAnomalous={isAnomalous("Signal", telemetry.Signal)}
          />
        </div>
      ) : (
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg flex-grow flex items-center justify-center">
          <p className="text-gray-500">No telemetry data available.</p>
        </div>
      )}
    </div>
  );
};

export default CurrentTelemetry;