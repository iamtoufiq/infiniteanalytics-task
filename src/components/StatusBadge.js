import React from "react";

const StatusBadge = ({ status }) => {
  const getStatusClass = (status) => {
    switch (status) {
      case "paid":
        return "status-paid";
      case "outstanding":
        return "status-outstanding";
      case "late":
        return "status-late";
      default:
        return "";
    }
  };

  return (
    <span className={`status-badge ${getStatusClass(status)}`}>{status}</span>
  );
};

export default StatusBadge;