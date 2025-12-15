import React from "react";
import { Clock, MapPin, AlertCircle, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom"

const RecentIncidentsWidget = ({ incidents }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case "resolved": return "#34C759";
      case "pending": return "#FF9500";
      case "rejected": return "#FF3B30";
      default: return "#8E8E93";
    }
  };
  const navigate = useNavigate();
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffHours = Math.floor((now - date) / (1000 * 60 * 60));

    if (diffHours < 1) return "Just now";
    if (diffHours < 24) return `${diffHours}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="incidents-widget">
      <div className="widget-header">
        <h3>Recent Incidents</h3>
        <button className="view-all" onClick={() => navigate("/incidents")}>
          View All <ChevronRight size={16} />
        </button>
      </div>

      <div className="incidents-list">
        {incidents.map((incident) => (
          <div key={incident._id} className="incident-item">
            <div className="incident-icon">
              <AlertCircle size={16} />
            </div>
            <div className="incident-content">
              <div className="incident-header">
                <h4>{incident.tag || "Untitled Incident"}</h4>
                <span
                  className="status-badge"
                  style={{ background: getStatusColor(incident.status) }}
                >
                  {incident.status}
                </span>
              </div>
              <p className="incident-desc">
                {incident.description?.substring(0, 60)}...
              </p>
              <div className="incident-footer">
                <span className="time">
                  <Clock size={12} />
                  {formatTime(incident.reportedAt)}
                </span>
                <span className="location">
                  <MapPin size={12} />
                  {incident.location?.coordinates[1]?.toFixed(4)}, {incident.location?.coordinates[0]?.toFixed(4)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentIncidentsWidget;