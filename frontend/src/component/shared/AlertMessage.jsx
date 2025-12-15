import React from "react";

const AlertMessage = ({ 
  type = "info", 
  message, 
  onClose 
}) => {
  if (!message) return null;

  const alertClasses = {
    success: "alert-success",
    error: "alert-error",
    warning: "alert-warning",
    info: "alert-info",
  };

  const alertIcons = {
    success: "✅",
    error: "⚠️",
    warning: "⚠️",
    info: "ℹ️",
  };

  return (
    <div className={`alert ${alertClasses[type]}`}>
      <span className="alert-icon">{alertIcons[type]}</span>
      <span>{message}</span>
      <button className="alert-close" onClick={onClose}>
        ×
      </button>
    </div>
  );
};

export default AlertMessage;