import React from "react";
import { MapPin, AlertTriangle, Bell, CheckCircle, TrendingUp, TrendingDown } from "lucide-react";

const StatsGrid = ({ stats }) => {
  const statItems = [
    {
      title: "Danger Zones",
      value: stats.totalZones,
      icon: MapPin,
      color: "#667eea",
      trend: "+2",
      trendUp: true,
    },
    {
      title: "Active Incidents",
      value: stats.totalIncidents,
      icon: AlertTriangle,
      color: "#ff3b30",
      trend: "-1",
      trendUp: false,
    },
    {
      title: "Panic Alerts",
      value: stats.activeAlerts,
      icon: Bell,
      color: "#ff9500",
      trend: "+3",
      trendUp: true,
    },
    {
      title: "Resolved Alerts",
      value: stats.resolvedTotal,
      icon: CheckCircle,
      color: "#34c759",
      trend: "+5",
      trendUp: true,
    },
  ];

  return (
    <div className="stats-grid">
      {statItems.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div key={index} className="stat-card">
            <div className="stat-icon" style={{ background: `${stat.color}20` }}>
              <Icon size={20} color={stat.color} />
            </div>
            <div className="stat-content">
              <h3>{stat.value}</h3>
              <p>{stat.title}</p>
              <div className="stat-trend">
                {stat.trendUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                <span>{stat.trend} today</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StatsGrid;