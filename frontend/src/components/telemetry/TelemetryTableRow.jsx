import React from "react";

// Create a TableCell component for consistency
const TableCell = ({ children }) => (
  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
    {children}
  </td>
);

const TelemetryTableRow = ({ item, isNewRow }) => {
  return (
    <tr className={`${item.Anomaly ? "bg-red-50" : ""} ${isNewRow ? "animate-flash" : ""}`}>
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
  );
};

export default TelemetryTableRow;