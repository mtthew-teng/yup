import React from "react";
import TelemetryGraphMini from "../components/telemetry/TelemetryGraphMini";
import CurrentTelemetry from "../components/telemetry/CurrentTelemetry";
import OperationalStatistics from "../components/telemetry/OperationalStatistics";
import useTelemetry from "../hooks/useTelemetry";
import useInitialTelemetry from "../hooks/useInitialTelemetry";
import TelemetryTable from "../components/telemetry/TelemetryTable";

const Home = () => {
  const { telemetry, error, loading } = useTelemetry();
  const { initialData, initialLoading, initialError } = useInitialTelemetry();

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
      </div>

      {/* Main Dashboard Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column - Stats */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6 auto-rows-fr">
          <TelemetryGraphMini 
            dataKey="Temperature" 
            unit="(°C)" 
            title="Temperature" 
            strokeColor="#F87171" 
            latestTelemetry={telemetry} 
            initialData={initialData} 
          />
          <TelemetryGraphMini 
            dataKey="Battery" 
            unit="(%)" 
            title="Battery" 
            strokeColor="#60A5FA" 
            latestTelemetry={telemetry} 
            initialData={initialData} 
          />
          <TelemetryGraphMini 
            dataKey="Altitude" 
            unit="(km)" 
            title="Altitude" 
            strokeColor="#10B981" 
            latestTelemetry={telemetry} 
            initialData={initialData} 
          />
          <TelemetryGraphMini 
            dataKey="Signal" 
            unit="(dB)" 
            title="Signal" 
            strokeColor="#FACC15" 
            latestTelemetry={telemetry} 
            initialData={initialData} 
          />
        </div>

        {/* Right column - Graphs layout */}
        <div className="lg:col-span-1 space-y-6">
          <CurrentTelemetry telemetry={telemetry} error={error} loading={loading} />
          <OperationalStatistics />
        </div>
        
      </div>

      {/* Telemetry Table Section */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">Telemetry History</h2>
        </div>
        <TelemetryTable />
      </div>
    </div>
  );
};

export default Home;