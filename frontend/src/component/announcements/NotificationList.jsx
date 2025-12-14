import React from "react";

const NotificationList = ({
  notifications,
  loading,
  searchQuery,
  filterStatus,
  selectedNotification,
  onSearchChange,
  onFilterChange,
  onSelectNotification,
  onDeleteNotification,
}) => {
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

  return (
    <div className="announcements-left-panel">
      <div className="panel-header">
        <h3>Recent Notifications</h3>
        <div className="controls">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search notifications..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              disabled={loading}
            />
            <span className="search-icon">🔍</span>
          </div>
          <select
            className="filter-select"
            value={filterStatus}
            onChange={(e) => onFilterChange(e.target.value)}
            disabled={loading}
          >
            <option value="all">All</option>
            <option value="sent">Sent</option>
          </select>
        </div>
      </div>

      <div className="announcements-list">
        {loading && !notifications.length ? (
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Loading notifications...</p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="empty-list">
            <p>No Notification found.</p>
          </div>
        ) : (
          notifications.map((notification) => {
            const statusInfo = getStatusInfo(notification.status);
            return (
              <div
                key={notification._id}
                className={`announcement-item ${
                  selectedNotification?._id === notification._id
                    ? "selected"
                    : ""
                }`}
                onClick={() => onSelectNotification(notification)}
              >
                <div className="announcement-header">
                  <h4>{notification.title}</h4>
                  <div className="announcement-type">
                    <span className={`type-badge ${notification.type}`}>
                      {notification.type === "alert"
                        ? "⚠️ Alert"
                        : "📢 Announcement"}
                    </span>
                    <span
                      className="status-badge"
                      style={{
                        background: statusInfo.color + "20",
                        color: statusInfo.color,
                      }}
                    >
                      {statusInfo.text}
                    </span>
                  </div>
                </div>
                <p className="announcement-preview">
                  {notification.content.substring(0, 80)}
                  {notification.content.length > 80 ? "..." : ""}
                </p>
                <div className="announcement-footer">
                  <span className="audience-badge">
                    {notification.targetAudience || "All users"}
                  </span>
                  <span className="date-info">
                    {formatDate(notification.createdAt || notification.time)}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default NotificationList;
