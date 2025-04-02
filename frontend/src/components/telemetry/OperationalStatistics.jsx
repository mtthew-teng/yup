import React, { useEffect, useState } from "react";
import { getAggregatedTelemetry } from "../../services/telemetryService";
import { FiArrowUp, FiArrowDown, FiChevronDown } from "react-icons/fi";

const OperationalStatistics = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState("24h");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const timeRanges = [
    { value: "1h", label: "Last Hour" },
    { value: "6h", label: "Last 6 Hours" },
    { value: "24h", label: "Last 24 Hours" },
    { value: "7d", label: "Last 7 Days" },
    { value: "30d", label: "Last 30 Days" },
  ];

  const getTimeRangeLabel = (value) => {
    const range = timeRanges.find(r => r.value === value);
    return range ? range.label : "Last 24 Hours";
  };

  const calculateTimeRange = (range) => {
    const endTime = new Date();
    const startTime = new Date(endTime);
    
    switch (range) {
      case "1h":
        startTime.setHours(endTime.getHours() - 1);
        break;
      case "6h":
        startTime.setHours(endTime.getHours() - 6);
        break;
      case "7d":
        startTime.setDate(endTime.getDate() - 7);
        break;
      case "30d":
        startTime.setDate(endTime.getDate() - 30);
        break;
      case "24h":
      default:
        startTime.setHours(endTime.getHours() - 24);
        break;
    }
    
    return { startTime, endTime };
  };

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const { startTime, endTime } = calculateTimeRange(timeRange);
        
        const data = await getAggregatedTelemetry(
          startTime.toISOString(),
          endTime.toISOString()
        );
        
        setStats(data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching aggregated stats:", err);
        setError("Failed to load statistics");
        setLoading(false);
      }
    };

    fetchStats();
  }, [timeRange]);

  const formatValue = (value) => {
    return value !== undefined ? value.toFixed(1) : "N/A";
  };

  const StatItem = ({ label, min, max, avg, unit }) => (
    <div className="grid grid-cols-4 text-sm border-b border-gray-100 py-3">
      <div className="font-medium text-gray-700">{label}</div>
      <div className="text-center flex items-center justify-center">
        <FiArrowDown className="text-blue-500 mr-1" />
        <span>{formatValue(min)} {unit}</span>
      </div>
      <div className="text-center flex items-center justify-center">
        <FiArrowUp className="text-red-500 mr-1" />
        <span>{formatValue(max)} {unit}</span>
      </div>
      <div className="text-center text-indigo-600 font-medium">
        {formatValue(avg)} {unit}
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-xl shadow-md p-4 md:p-6 h-[350px] flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-900">Statistics</h2>
        
        {/* Time Range Dropdown */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="text-xs px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center space-x-1 focus:outline-none"
          >
            <span>{getTimeRangeLabel(timeRange)}</span>
            <FiChevronDown className={`transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
          </button>
          
          {dropdownOpen && (
            <div className="absolute right-0 mt-1 w-40 bg-white rounded-md shadow-lg z-10 border border-gray-200">
              <ul className="py-1">
                {timeRanges.map((range) => (
                  <li key={range.value}>
                    <button
                      onClick={() => {
                        setTimeRange(range.value);
                        setDropdownOpen(false);
                      }}
                      className={`block px-4 py-2 text-sm w-full text-left hover:bg-gray-100 
                        ${timeRange === range.value ? 'bg-indigo-50 text-indigo-600 font-medium' : 'text-gray-700'}`}
                    >
                      {range.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center flex-grow">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
            <span className="mt-2 text-sm text-gray-500">Loading statistics...</span>
          </div>
        </div>
      ) : error ? (
        <div className="p-4 bg-red-50 rounded-lg flex-grow flex items-center justify-center">
          <p className="text-red-500 font-medium">{error}</p>
        </div>
      ) : stats ? (
        <div className="flex-grow overflow-auto">
          <div className="grid grid-cols-4 text-xs text-gray-500 pb-2">
            <div>Parameter</div>
            <div className="text-center">Min</div>
            <div className="text-center">Max</div>
            <div className="text-center">Average</div>
          </div>
          
          <StatItem 
            label="Temperature" 
            min={stats.min_temperature} 
            max={stats.max_temperature} 
            avg={stats.avg_temperature} 
            unit="°C" 
          />
          <StatItem 
            label="Battery" 
            min={stats.min_battery} 
            max={stats.max_battery} 
            avg={stats.avg_battery} 
            unit="%" 
          />
          <StatItem 
            label="Altitude" 
            min={stats.min_altitude} 
            max={stats.max_altitude} 
            avg={stats.avg_altitude} 
            unit="km" 
          />
          <StatItem 
            label="Signal" 
            min={stats.min_signal} 
            max={stats.max_signal} 
            avg={stats.avg_signal} 
            unit="dB" 
          />
        </div>
      ) : (
        <div className="p-4 bg-gray-50 rounded-lg flex-grow flex items-center justify-center">
          <p className="text-gray-500 text-center">No statistics available</p>
        </div>
      )}
    </div>
  );
};

export default OperationalStatistics;