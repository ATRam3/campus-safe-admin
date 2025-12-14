import React from "react";
import { MapPin } from "lucide-react";
import { AlertOctagon, AlertTriangle, AlertCircle } from "lucide-react";

const DangerZoneStats = ({ 
  zones, 
  severityCounts, 
  getSeverityColor 
}) => {
  
  const severities = [
    {
      key: "high",
      label: "High Risk",
      icon: AlertOctagon,
      color: "#FF3B30",
    },
    {
      key: "medium",
      label: "Medium Risk",
      icon: AlertTriangle,
      color: "#FF9500",
    },
    {
      key: "low",
      label: "Low Risk",
      icon: AlertCircle,
      color: "#34C759",
    },
  ];

  return (
    <div className="stats-cards">
      {/* Total zones - always shown */}
      <div className="stat-card">
        <div className="stat-icon">
          <MapPin size={20} />
        </div>
        <div className="stat-content">
          <h3>{zones.length}</h3>
          <p>Total Zones</p>
        </div>
      </div>

      {/* Severity cards */}
      {severities.map((cfg) => {
        const IconComp = cfg.icon;
        const count = severityCounts[cfg.key] || 0;
        const color = cfg.color || getSeverityColor(cfg.key);
        
        return (
          <div key={cfg.key} className="stat-card">
            <div
              className="stat-icon"
              style={{
                background: color + "20",
              }}
            >
              <IconComp size={20} color={color} />
            </div>
            <div className="stat-content">
              <h3>{count}</h3>
              <p>{cfg.label}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default DangerZoneStats;