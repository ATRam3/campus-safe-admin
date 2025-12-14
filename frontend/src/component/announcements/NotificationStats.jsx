import React from "react";

const NotificationStats = ({ sentCount }) => {
  return (
    <div className="stats-section">
      <div className="stats-card">
        <div
          className="stat-icon"
          style={{ background: "#34C75920", color: "#34C759" }}
        >
          📤
        </div>
        <div className="stat-info">
          <h3>{sentCount}</h3>
          <p>Sent Notifications</p>
        </div>
      </div>
      <div className="stats-card">
        <div
          className="stat-icon"
          style={{ background: "#007AFF20", color: "#007AFF" }}
        >
          👥
        </div>
        <div className="stat-info">
          <h3>All Users</h3>
          <p>Default Audience</p>
        </div>
      </div>
    </div>
  );
};

export default NotificationStats;