import React, { useEffect, useState } from "react";
import usePaginatedTelemetry from "../../hooks/usePaginatedTelemetry";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";
import { FiFilter, FiWifi } from "react-icons/fi";
import FilterPanel from "./FilterPanel";
import TablePagination from "./TablePagination";
import TelemetryTableRow from "./TelemetryTableRow";

// Table header component
const TableHeader = ({ children }) => (
  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
    {children}
  </th>
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
    updateFilters,
    refreshData,
    setPauseUpdates,
    isRealtimeActive
  } = usePaginatedTelemetry(1, 20);

  const [filterOpen, setFilterOpen] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(Date.now());
  
  // Track when data is updated
  useEffect(() => {
    if (data.length > 0) {
      setLastUpdate(Date.now());
    }
  }, [data]);

  // Pause real-time updates when filter panel is open
  useEffect(() => {
    setPauseUpdates(filterOpen);
    return () => setPauseUpdates(false);
  }, [filterOpen, setPauseUpdates]);

  return (
    <div className="bg-white divide-y divide-gray-200 rounded-xl shadow-md">
      {/* Header bar with controls */}
      <div className="p-4 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <h3 className="text-lg font-medium text-gray-900">Telemetry Data</h3>
          
          {/* Real-time indicator */}
          {isRealtimeActive && (
            <div className="flex items-center space-x-1 text-xs bg-green-100 text-green-800 rounded-full px-2 py-1">
              <FiWifi className="animate-pulse" />
              <span>Live Updates</span>
            </div>
          )}
          
          {/* Last updated time */}
          <div className="text-xs text-gray-500">
            Last updated: {new Date(lastUpdate).toLocaleTimeString()}
          </div>
          
          {/* Manual refresh button (only show when not on real-time) */}
          {!isRealtimeActive && (
            <button 
              onClick={() => refreshData()}
              className="ml-2 text-xs px-2 py-1 bg-indigo-50 text-indigo-600 rounded hover:bg-indigo-100"
            >
              Refresh
            </button>
          )}
        </div>
        
        <button
          onClick={() => setFilterOpen(!filterOpen)}
          className="flex items-center space-x-1 text-sm text-gray-700 hover:text-indigo-600"
        >
          <FiFilter />
          <span>Filters {filters.anomaly !== null || filters.startTime ? '(Active)' : ''}</span>
        </button>
      </div>

      {/* Filters panel */}
      {filterOpen && (
        <FilterPanel 
          filters={filters} 
          updateFilters={updateFilters}
        />
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
                <TelemetryTableRow 
                  key={item.ID || `${item.Timestamp}-${index}`}
                  item={item}
                  isNewRow={index === 0 && isRealtimeActive}
                />
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <TablePagination 
        page={page}
        totalPages={totalPages}
        total={total}
        dataLength={data.length}
        setPage={setPage}
      />
    </div>
  );
};

export default TelemetryTable;