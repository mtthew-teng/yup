import React, { useEffect, useState } from "react";
import usePaginatedTelemetry from "../hooks/usePaginatedTelemetry";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";
import { FiFilter, FiCalendar, FiClock } from "react-icons/fi";

// Create a TableHeader component for consistency
const TableHeader = ({ children }) => (
  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
    {children}
  </th>
);

// Create a TableCell component for consistency
const TableCell = ({ children }) => (
  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
    {children}
  </td>
);

// Create a PaginationButton component
const PaginationButton = ({ children, onClick, disabled, isLeft }) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    className={`inline-flex items-center ${isLeft ? 'rounded-l-md' : 'rounded-r-md'} px-2 py-2 text-gray-400 ring-1 ring-gray-300 ring-inset hover:bg-gray-50 focus:outline-offset-0 ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
  >
    {children}
  </button>
);

const TelemetryTable = () => {
  const {
    data,
    page,
    total,
    totalPages,
    loading,
    setPage,
    filters,
    updateFilters
  } = usePaginatedTelemetry(1, 20);

  const [jumpInput, setJumpInput] = useState("1");
  const [filterOpen, setFilterOpen] = useState(false);
  
  // Time range local state
  const [timeRange, setTimeRange] = useState("none");
  const [customDateRange, setCustomDateRange] = useState({
    startDate: '',
    startTime: '00:00',
    endDate: '',
    endTime: '23:59'
  });

  useEffect(() => {
    if (jumpInput !== "" && parseInt(jumpInput) !== page) {
      setJumpInput(page.toString());
    }
  }, [page]);  

  // Handle time range changes
  useEffect(() => {
    if (timeRange === "none") {
      // Clear any date filters
      updateFilters({ startTime: null, endTime: null });
      return;
    }

    if (timeRange === "custom") {
      // Custom date range is handled separately
      return;
    }

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
  }, [timeRange]);

  // Handle custom date range
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

  const handlePrevious = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNext = () => {
    if (page < totalPages) setPage(page + 1);
  };

  const handleJump = (value) => {
    setJumpInput(value);
  
    if (value.trim() === "") {
      setPage(1);
      return;
    }
  
    const num = parseInt(value);
    if (!isNaN(num)) {
      if (num < 1) {
        setPage(1);
      } else if (num > totalPages) {
        setPage(totalPages);
      } else {
        setPage(num);
      }
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
    <div className="bg-white divide-y divide-gray-200 rounded-xl shadow-md">
      {/* Filter controls */}
      <div className="p-4 flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Telemetry Data</h3>
        <button
          onClick={() => setFilterOpen(!filterOpen)}
          className="flex items-center space-x-1 text-sm text-gray-700 hover:text-indigo-600"
        >
          <FiFilter />
          <span>Filters {filters.anomaly !== null || filters.startTime ? '(Active)' : ''}</span>
        </button>
      </div>

      {filterOpen && (
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
      )}

      {/* Table Container with loading overlay */}
      <div className="relative overflow-x-auto">
        {loading && (
          <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center z-10">
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
              <span className="mt-2 text-sm text-gray-500">Loading...</span>
            </div>
          </div>
        )}

        <table className="divide-y divide-gray-200 min-w-full">
          <thead className="bg-gray-50">
            <tr>
              {["Timestamp", "Temperature (°C)", "Battery (%)", "Altitude (km)", "Signal (dB)"].map((label) => (
                <TableHeader key={label}>{label}</TableHeader>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {data.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                  No telemetry data found.
                </td>
              </tr>
            ) : (
              data.map((item, index) => (
                <tr key={item.id ?? `${item.timestamp}-${index}`} className={item.Anomaly ? "bg-red-50" : ""}>
                  <TableCell>{new Date(item.Timestamp).toLocaleString()}</TableCell>
                  <TableCell>
                    <span className={item.Temperature > 35 ? "text-red-500 font-medium" : ""}>
                      {item.Temperature.toFixed(1)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className={item.Battery < 40 ? "text-amber-500 font-medium" : ""}>
                      {item.Battery.toFixed(1)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className={item.Altitude < 400 ? "text-red-500 font-medium" : ""}>
                      {item.Altitude.toFixed(1)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className={item.Signal < -80 ? "text-amber-500 font-medium" : ""}>
                      {item.Signal.toFixed(1)}
                    </span>
                  </TableCell>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-4 py-3 sm:px-6">
        <div className="flex flex-1 justify-between sm:hidden">
          <button
            type="button"
            onClick={handlePrevious}
            disabled={page === 1}
            className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <button
            type="button"
            onClick={handleNext}
            disabled={page === totalPages}
            className="ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
        <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
          <p className="text-sm text-gray-700">
            Showing <span className="font-medium">{data.length > 0 ? (page - 1) * 20 + 1 : 0}</span> to{" "}
            <span className="font-medium">{Math.min(page * 20, total)}</span> of{" "}
            <span className="font-medium">{total}</span> results
          </p>
          <nav className="isolate inline-flex -space-x-px rounded-md shadow-xs" aria-label="Pagination">
            <PaginationButton 
              onClick={handlePrevious} 
              disabled={page === 1}
              isLeft={true}
            >
              <span className="sr-only">Previous</span>
              <IoChevronBack />
            </PaginationButton>
            
            <span
              aria-current="page"
              className="z-10 inline-flex items-center bg-indigo-600 px-2 py-2 text-sm font-semibold text-white focus:outline-offset-0"
            >
              <input
                type="number"
                value={jumpInput}
                onChange={(e) => handleJump(e.target.value)}
                onBlur={() => setJumpInput(page.toString())}
                min={1}
                max={totalPages}
                className="w-8 text-center bg-indigo-600 text-white focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
            </span>

            <PaginationButton 
              onClick={handleNext} 
              disabled={page === totalPages}
              isLeft={false}
            >
              <span className="sr-only">Next</span>
              <IoChevronForward />
            </PaginationButton>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default TelemetryTable;