import React from "react";

const NotificationDetails = ({ notification, loading, onDelete }) => {
  const getStatusInfo = (status) => {
    switch (status?.toLowerCase()) {
      case "low":
        return { color: "#34C759", text: "Low", badge: "📤" };
      case "medium":
        return { color: "#be7e33ff", text: "Medium", badge: "" };
      case "high":
        return { color: "#e03d3dff", text: "High", badge: "" };
      default:
        return { color: "#8E8E93", text: status || "Unknown", badge: "📄" };
    }
  };
  const formatDate = (dateString) => {
    if (!dateString) return "Just now";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "Recently";

      const now = new Date();
      const diffMs = now - date;
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);

      if (diffMins < 1) return "Just now";
      if (diffMins < 60) return `${diffMins} min ago`;
      if (diffHours < 24) return `${diffHours} hours ago`;

      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (err) {
      return "Recently";
    }
  };

  if (!notification) {
    return (
      <div className="announcements-right-panel">
        <div className="empty-state">
          <div className="empty-icon">📢</div>
          <h3>No Notification Selected</h3>
          <p>Select an Notification from the list to view details.</p>
        </div>
      </div>
    );
  }

  const statusInfo = getStatusInfo(notification.status);

  return (
    <div className="announcements-right-panel">
      <div className="announcement-details">
        <div className="details-header">
          <div className="title-section">
            <h2>{notification.title}</h2>
            <div className="meta-info">
              <span className={`type-badge large ${notification.type}`}>
                {notification.type === "alert" ? "⚠️ Alert" : "📢 Announcement"}
              </span>
              <span className="date-info">
                {formatDate(notification.createdAt || notification.time)}
              </span>
            </div>
          </div>
          <div className="status-section">
            <div className="status-display">
              <div
                className="status-dot"
                style={{
                  background: statusInfo.color,
                }}
              ></div>
              <span className="status-text">
                {statusInfo.text.toUpperCase()}
              </span>
            </div>
            <div className="audience-display">
              {notification.targetAudience || "All Users"}
            </div>
          </div>
        </div>

        <div className="content-section">
          <h3>Message Content</h3>
          <div className="message-content">
            {notification.content.split("\n").map((paragraph, index) => (
              <p key={index}>{paragraph || <br />}</p>
            ))}
          </div>
        </div>

        <div className="action-buttons">
          <button
            className="btn btn-outline delete-btn"
            onClick={() => onDelete(notification)}
            disabled={loading}
          >
            🗑 Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationDetails;
