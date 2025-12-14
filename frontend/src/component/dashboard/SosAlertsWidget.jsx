import React from "react";
import { Clock, User, MapPin, AlertTriangle, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom"

const SosAlertsWidget = ({ sosAlerts = [] }) => {
  const navigate = useNavigate();

  return (
    <div className="activity-widget">
      <div className="widget-header">
        <h3 className="widget-title">Recent Activity</h3>
        <span className="widget-subtitle">Latest SOS alerts</span>
      </div>

      <div className="activity-list">
        {sosAlerts.length === 0 && (
          <div className="activity-item">
            <span>No recent SOS alerts</span>
          </div>
        )}

        {sosAlerts.map((alert) => {
          const isResolved = alert.resolved;
          const Icon = isResolved ? CheckCircle : AlertTriangle;
          const color = isResolved ? "#34C759" : "#FF3B30";

          return (
            <div key={alert._id} className="activity-item">
              <div className="activity-item-left">
                <div
                  className="activity-icon"
                  style={{ background: `${color}20` }}
                >
                  <Icon size={16} color={color} />
                </div>

                <div className="activity-content">
                  <div className="activity-main">
                    <span className="activity-action">
                      {isResolved ? "SOS alert resolved" : "SOS alert triggered"}
                    </span>

                    <div className="activity-meta">
                      <span className="meta-item">
                        <User size={12} />
                        <span>{alert.userId?.fullName || "Unknown user"}</span>
                      </span>

                      <span className="meta-divider">•</span>

                      <span className="meta-item">
                        <MapPin size={12} />
                        <span>
                          {alert.location?.coordinates
                            ? `${alert.location.coordinates[1]}, ${alert.location.coordinates[0]}`
                            : "Unknown location"}
                        </span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="activity-time">
                <Clock size={12} />
                <span>
                  {new Date(alert.timeStamp).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="activity-footer">
        <button className="view-all-btn" onClick={() => navigate("/panic-alerts")}>View All Alerts</button>
      </div>
    </div>
  );
};

export default SosAlertsWidget;