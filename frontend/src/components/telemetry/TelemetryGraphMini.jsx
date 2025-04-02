import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

// Set the number of entries to display in one place
const MAX_ENTRIES = 20;

// Y-Axis limits based on telemetry type
const getDynamicDomain = (data, dataKey) => {
  if (!data || data.length === 0) return ["auto", "auto"];

  const values = data.map((entry) => entry[dataKey]).filter((v) => typeof v === "number");

  const min = Math.min(...values);
  const max = Math.max(...values);
  const padding = (max - min) * 0.1 || 1;

  return [min - padding, max + padding];
};

// Custom tooltip component for consistent styling
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-800 text-white p-3 rounded-md shadow-lg border border-slate-700 text-sm">
        <p className="text-gray-300 mb-1">{new Date(label).toLocaleString()}</p>
        {payload.map((entry, index) => (
          <p key={`item-${index}`} style={{ color: entry.color }}>
            <span className="font-medium">{entry.name}:</span> {' '}
            {entry.value.toFixed(1)} {entry.unit}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const TelemetryGraphMini = ({ dataKey, unit, title, strokeColor, latestTelemetry, initialData }) => {
  const [telemetryData, setTelemetryData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Set initial data when available
  useEffect(() => {
    if (initialData && initialData.length > 0) {
      setTelemetryData(initialData);
      setIsLoading(false);
    }
  }, [initialData]);

  // Push new entry to the END
  useEffect(() => {
    if (!latestTelemetry) return;

    setTelemetryData((prev) => {
      if (prev.length > 0 && prev[prev.length - 1].Timestamp === latestTelemetry.Timestamp) {
        return prev; // Avoid duplicates
      }

      const updated = [...prev.slice(-MAX_ENTRIES + 1), latestTelemetry];
      return updated;
    });
    
    setIsLoading(false);
  }, [latestTelemetry]);

  // Check if this metric is in anomaly state
  const isAnomalous = () => {
    if (!latestTelemetry) return false;
    
    switch (dataKey) {
      case "Temperature":
        return latestTelemetry.Temperature > 35;
      case "Battery":
        return latestTelemetry.Battery < 40;
      case "Altitude":
        return latestTelemetry.Altitude < 400;
      case "Signal":
        return latestTelemetry.Signal < -80;
      default:
        return false;
    }
  };

  return (
    <div className="w-full bg-white rounded-xl p-4 md:p-6 shadow-md h-[350px] flex flex-col">
      <div className="flex justify-between items-center">
        <h5 className="leading-none text-xl font-bold text-gray-900">
          {title}
        </h5>
        {latestTelemetry && (
          <div className="flex items-center">
            <span className={`text-lg font-semibold ${isAnomalous() ? "text-red-500" : "text-gray-800"}`}>
              {latestTelemetry[dataKey]?.toFixed(1)} {unit}
            </span>
          </div>
        )}
      </div>

      <div className="mt-4 flex-grow relative">
        {isLoading && (
          <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center z-10">
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
              <span className="mt-2 text-sm text-gray-500">Loading...</span>
            </div>
          </div>
        )}
        
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={telemetryData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="Timestamp"
              tick={{ fill: "#6b7280", fontSize: 12 }}
              tickFormatter={(time) => new Date(time).toLocaleTimeString()}
              stroke="#e5e7eb"
            />
            <YAxis
              domain={getDynamicDomain(telemetryData, dataKey)}
              tick={{ fill: "#6b7280", fontSize: 12 }}
              tickFormatter={(value) => value.toFixed(1)}
              label={{
                value: unit,
                angle: -90,
                position: "insideLeft",
                fill: "#6b7280",
                fontSize: 12,
                dx: -15
              }}
              stroke="#e5e7eb"
            />
            <Tooltip 
              content={<CustomTooltip />}
              cursor={{ stroke: '#9ca3af', strokeWidth: 1, strokeDasharray: '5 5' }}
            />
            <Legend 
              wrapperStyle={{ 
                paddingTop: '10px', 
                fontSize: '12px',
                color: '#6b7280' 
              }} 
            />
            <Line
              type="monotone"
              dataKey={dataKey}
              stroke={strokeColor}
              strokeWidth={2}
              dot={false}
              activeDot={{ stroke: 'white', strokeWidth: 2, r: 4 }}
              name={title}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TelemetryGraphMini;