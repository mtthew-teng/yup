import React, { useState, useEffect } from "react";
import { FiCalendar, FiClock } from "react-icons/fi";

const FilterPanel = ({ filters, updateFilters }) => {
  const [timeRange, setTimeRange] = useState(
    filters.startTime ? "custom" : "none"
  );
  
  const [customDateRange, setCustomDateRange] = useState({
    startDate: filters.startTime ? new Date(filters.startTime).toISOString().split('T')[0] : '',
    startTime: filters.startTime ? new Date(filters.startTime).toTimeString().slice(0, 5) : '00:00',
    endDate: filters.endTime ? new Date(filters.endTime).toISOString().split('T')[0] : '',
    endTime: filters.endTime ? new Date(filters.endTime).toTimeString().slice(0, 5) : '23:59'
  });

  // Handle time range changes
  useEffect(() => {
    if (timeRange === "none") {
      updateFilters({ startTime: null, endTime: null });
      return;
    }

    if (timeRange === "custom") return;

    const now = new Date();
    let startTime = new Date(now);

    // Calculate start time based on selected range
    switch (timeRange) {
      case "1h":
        startTime.setHours(now.getHours() - 1);
        break;
      case "6h":
        startTime.setHours(now.getHours() - 6);
        break;
      case "24h":
        startTime.setHours(now.getHours() - 24);
        break;
      case "7d":
        startTime.setDate(now.getDate() - 7);
        break;
      case "30d":
        startTime.setDate(now.getDate() - 30);
        break;
      default:
        break;
    }

    updateFilters({
      startTime: startTime.toISOString(),
      endTime: now.toISOString()
    });
  }, [timeRange, updateFilters]);

  const applyCustomDateRange = () => {
    if (customDateRange.startDate && customDateRange.endDate) {
      // Parse start date and time
      const [startHours, startMinutes] = customDateRange.startTime.split(':').map(Number);
      const startDate = new Date(customDateRange.startDate);
      startDate.setHours(startHours, startMinutes, 0, 0);
      
      // Parse end date and time
      const [endHours, endMinutes] = customDateRange.endTime.split(':').map(Number);
      const endDate = new Date(customDateRange.endDate);
      endDate.setHours(endHours, endMinutes, 59, 999);
      
      updateFilters({
        startTime: startDate.toISOString(),
        endTime: endDate.toISOString()
      });
    }
  };

  const handleAnomalyFilterChange = (e) => {
    if (e.target.value === "all") {
      updateFilters({ anomaly: null });
    } else {
      updateFilters({ anomaly: e.target.value === "true" });
    }
  };

  return (
    <div className="p-4 bg-gray-50 border-b border-gray-200">
      <div className="flex flex-wrap gap-6">
        {/* Anomaly Filter */}
        <div className="w-64">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Anomaly Filter
          </label>
          <select
            value={filters.anomaly === null ? "all" : filters.anomaly.toString()}
            onChange={handleAnomalyFilterChange}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          >
            <option value="all">All Records</option>
            <option value="true">Anomalies Only</option>
            <option value="false">Normal Records Only</option>
          </select>
        </div>
        
        {/* Time Range Filter */}
        <div className="w-64">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Time Range
          </label>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          >
            <option value="none">All Time</option>
            <option value="1h">Last Hour</option>
            <option value="6h">Last 6 Hours</option>
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="custom">Custom Range</option>
          </select>
        </div>
      </div>
        
      {/* Custom Date Range */}
      {timeRange === "custom" && (
        <div className="mt-4 bg-white p-4 rounded-md border border-gray-200 max-w-4xl">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Custom Date & Time Range</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Start Date and Time */}
            <div className="space-y-2">
              <h5 className="text-xs font-medium text-gray-500">Start</h5>
              <div className="flex items-center space-x-3">
                <div className="relative flex-grow">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiCalendar className="text-gray-400" />
                  </div>
                  <input
                    type="date"
                    value={customDateRange.startDate}
                    onChange={(e) => setCustomDateRange({...customDateRange, startDate: e.target.value})}
                    className="pl-10 w-full py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                  />
                </div>
                <div className="relative w-40">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiClock className="text-gray-400" />
                  </div>
                  <input
                    type="time"
                    value={customDateRange.startTime}
                    onChange={(e) => setCustomDateRange({...customDateRange, startTime: e.target.value})}
                    className="pl-10 w-full py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                  />
                </div>
              </div>
            </div>
            
            {/* End Date and Time */}
            <div className="space-y-2">
              <h5 className="text-xs font-medium text-gray-500">End</h5>
              <div className="flex items-center space-x-3">
                <div className="relative flex-grow">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiCalendar className="text-gray-400" />
                  </div>
                  <input
                    type="date"
                    value={customDateRange.endDate}
                    onChange={(e) => setCustomDateRange({...customDateRange, endDate: e.target.value})}
                    min={customDateRange.startDate}
                    className="pl-10 w-full py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                  />
                </div>
                <div className="relative w-40">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiClock className="text-gray-400" />
                  </div>
                  <input
                    type="time"
                    value={customDateRange.endTime}
                    onChange={(e) => setCustomDateRange({...customDateRange, endTime: e.target.value})}
                    className="pl-10 w-full py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                  />
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-4 flex justify-end">
            <button
              onClick={applyCustomDateRange}
              disabled={!customDateRange.startDate || !customDateRange.endDate}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-sm"
            >
              Apply Time Range
            </button>
          </div>
        </div>
      )}

      {/* Show active filters */}
      {(filters.startTime || filters.anomaly !== null) && (
        <div className="mt-4 text-sm text-gray-600">
          <div className="font-medium mb-1">Active Filters:</div>
          <div className="flex flex-wrap gap-2">
            {filters.anomaly !== null && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                {filters.anomaly ? 'Anomalies Only' : 'Normal Records Only'}
              </span>
            )}
            {filters.startTime && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                From: {new Date(filters.startTime).toLocaleString()}
              </span>
            )}
            {filters.endTime && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                To: {new Date(filters.endTime).toLocaleString()}
              </span>
            )}
            <button
              onClick={() => {
                updateFilters({ startTime: null, endTime: null, anomaly: null });
                setTimeRange("none");
                setCustomDateRange({ 
                  startDate: '', 
                  startTime: '00:00',
                  endDate: '',
                  endTime: '23:59'
                });
              }}
              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 hover:bg-red-200"
            >
              Clear All Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterPanel;