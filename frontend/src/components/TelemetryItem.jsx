import React from "react";

const TelemetryItem = ({ icon, label, value, unit, isAnomalous }) => {
  return (
    <div className={`p-4 rounded-lg ${isAnomalous ? 'bg-gray-50' : ''} flex flex-col justify-center`}>
      <h1 className={`text-2xl font-bold ${isAnomalous ? (label === 'Battery' || label === 'Signal' ? 'text-amber-500' : 'text-red-500') : 'text-gray-800'}`}>
        {value !== undefined && value !== null ? value.toFixed(1) : "N/A"} {unit}
      </h1>
      <p className="flex items-center space-x-2 mt-2 text-gray-600">
        <span className="text-lg">{icon}</span> <span>{label}</span>
      </p>
    </div>
  );
};

export default TelemetryItem;