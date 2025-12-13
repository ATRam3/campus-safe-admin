import React, { useState, useEffect } from "react";
import api from "../services/api";
import "../css/Announcements.css";
import NotificationForm from "../component/form/NotificationForm";

const Announcements = () => {
  // State management
  const [announcements, setAnnouncements] = useState([]);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  // Form state - Simplified
  const [showNewAnnouncement, setShowNewAnnouncement] = useState(false);

  // Delete confirmation modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [announcementToDelete, setAnnouncementToDelete] = useState(null);

  // Error state
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // Fetch announcements on component mount
  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    setLoading(true);
    try {
      const response = await api.get("/notification/announcements");
      console.log("Fetched announcements:", response.data);

      // Handle different response structures
      const announcementsData = response.data.data || response.data || [];
      setAnnouncements(announcementsData);

      // Set first announcement as selected if available
      if (announcementsData.length > 0 && !selectedAnnouncement) {
        setSelectedAnnouncement(announcementsData[0]);
      }
    } catch (error) {
      console.error("Error fetching announcements:", error);
      showError("Failed to load announcements. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Filter announcements
  const filteredAnnouncements = announcements.filter((announcement) => {
    const matchesStatus =
      filterStatus === "all" || announcement.status === filterStatus;
    const matchesSearch =
      searchQuery === "" ||
      announcement.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      announcement.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Get status badge color
  const getStatusInfo = (status) => {
    switch (status) {
      case "sent":
        return { color: "#34C759", text: "Sent", badge: "📤" };
      case "draft":
        return { color: "#8E8E93", text: "Draft", badge: "📝" };
      default:
        return { color: "#8E8E93", text: "Unknown", badge: "📄" };
    }
  };

  // Show error message
  const showError = (message) => {
    setError(message);
    setTimeout(() => setError(null), 5000);
  };

  // Show success message
  const showSuccess = (message) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(null), 5000);
  };

  // Handle sending new announcement
  const handleSendAnnouncement = async (formValues) => {
    setFormErrors({});

    const payload = {
      title: formValues.title.trim(),
      content: formValues.content.trim(),
      targetAudience: formValues.targetAudience || "all",
      type: formValues.type,
      status: formValues.status,
      ...(formValues.type === "announcement" &&
        formValues.scheduleMode === "schedule" && {
          scheduledTime: formValues.scheduledTime,
        }),
    };

    console.log("Sending payload:", payload);

    try {
      setLoading(true);
      const response = await api.post("/notification/alerts", payload);

      const newAnnouncementData = response.data.data || response.data;
      console.log("new Announcement response:", response.data);
      if (!newAnnouncementData?._id) {
        throw new Error("Invalid response from server");
      }

      setAnnouncements((prev) => [newAnnouncementData, ...prev]);
      setSelectedAnnouncement(newAnnouncementData);

      resetForm();
      showSuccess(
        formValues.scheduleMode === "schedule"
          ? "⏰ Announcement scheduled successfully!"
          : "✅ Notification sent successfully!"
      );
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        "Failed to send notification.";
      showError(`❌ ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  // Open delete confirmation modal
  const openDeleteModal = (announcement) => {
    setAnnouncementToDelete(announcement);
    setShowDeleteModal(true);
  };

  // Handle delete announcement
  const handleDeleteAnnouncement = async () => {
    if (!announcementToDelete) return;

    try {
      setLoading(true);
      await api.delete(`/notification/alerts/${announcementToDelete._id}`);

      // Remove from state
      const updatedAnnouncements = announcements.filter(
        (a) => a._id !== announcementToDelete._id
      );
      setAnnouncements(updatedAnnouncements);

      // Clear selection if deleted announcement was selected
      if (
        selectedAnnouncement &&
        selectedAnnouncement._id === announcementToDelete._id
      ) {
        setSelectedAnnouncement(updatedAnnouncements[0] || null);
      }

      showSuccess("✅ Announcement deleted successfully!");
    } catch (err) {
      console.error("Error deleting announcement:", err);
      showError("❌ Failed to delete announcement. Please try again.");
    } finally {
      setLoading(false);
      setShowDeleteModal(false);
      setAnnouncementToDelete(null);
    }
  };

  // Format date for display
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

  // Reset form
  const resetForm = () => {
    setNewAnnouncement({
      title: "",
      content: "",
      type: "announcement",
    });
    setFormErrors({});
    setShowNewAnnouncement(false);
  };

  // Calculate stats
  const sentCount = announcements.filter((a) => a.status === "sent").length;

  return (
    <div className="announcements-page">
      {/* Page Header */}
      <div className="page-header">
        <div className="header-left">
          <h1>📢 Announcements & Alerts</h1>
          <p>Send important updates to all campus users</p>
        </div>
        <div className="header-actions">
          <button
            className="btn btn-primary"
            onClick={() => setShowNewAnnouncement(true)}
            disabled={loading}
          >
            + Create New
          </button>
        </div>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="alert alert-success">
          <span className="alert-icon">✅</span>
          <span>{successMessage}</span>
          <button
            className="alert-close"
            onClick={() => setSuccessMessage(null)}
          >
            ×
          </button>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="alert alert-error">
          <span className="alert-icon">⚠️</span>
          <span>{error}</span>
          <button className="alert-close" onClick={() => setError(null)}>
            ×
          </button>
        </div>
      )}

      {/* Stats Cards - Simple */}
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
            <p>Sent Announcements</p>
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

      {/* Main Content */}
      <div className="announcements-content-grid">
        {/* Left Panel - Recent Announcements */}
        <div className="announcements-left-panel">
          <div className="panel-header">
            <h3>Recent Announcements</h3>
            <div className="controls">
              <div className="search-box">
                <input
                  type="text"
                  placeholder="Search announcements..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  disabled={loading}
                />
                <span className="search-icon">🔍</span>
              </div>
              <select
                className="filter-select"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                disabled={loading}
              >
                <option value="all">All</option>
                <option value="sent">Sent</option>
              </select>
            </div>
          </div>

          <div className="announcements-list">
            {loading && !announcements.length ? (
              <div className="loading-state">
                <div className="loading-spinner"></div>
                <p>Loading announcements...</p>
              </div>
            ) : filteredAnnouncements.length === 0 ? (
              <div className="empty-list">
                <p>No announcements found.</p>
              </div>
            ) : (
              filteredAnnouncements.map((announcement) => {
                const statusInfo = getStatusInfo(announcement.status);
                return (
                  <div
                    key={announcement._id}
                    className={`announcement-item ${
                      selectedAnnouncement?._id === announcement._id
                        ? "selected"
                        : ""
                    }`}
                    onClick={() => setSelectedAnnouncement(announcement)}
                  >
                    <div className="announcement-header">
                      <h4>{announcement.title}</h4>
                      <div className="announcement-type">
                        <span className={`type-badge ${announcement.type}`}>
                          {announcement.type === "alert"
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
                      {announcement.content.substring(0, 80)}
                      {announcement.content.length > 80 ? "..." : ""}
                    </p>
                    <div className="announcement-footer">
                      <span className="audience-badge">👥 All Users</span>
                      <span className="date-info">
                        {formatDate(
                          announcement.createdAt || announcement.time
                        )}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Panel - Selected Announcement Details */}
        <div className="announcements-right-panel">
          {selectedAnnouncement ? (
            <div className="announcement-details">
              <div className="details-header">
                <div className="title-section">
                  <h2>{selectedAnnouncement.title}</h2>
                  <div className="meta-info">
                    <span
                      className={`type-badge large ${selectedAnnouncement.type}`}
                    >
                      {selectedAnnouncement.type === "alert"
                        ? "⚠️ Alert"
                        : "📢 Announcement"}
                    </span>
                    <span className="date-info">
                      {formatDate(
                        selectedAnnouncement.createdAt ||
                          selectedAnnouncement.time
                      )}
                    </span>
                  </div>
                </div>
                <div className="status-section">
                  <div className="status-display">
                    <div
                      className="status-dot"
                      style={{
                        background: getStatusInfo(selectedAnnouncement.status)
                          .color,
                      }}
                    ></div>
                    <span className="status-text">
                      {getStatusInfo(
                        selectedAnnouncement.status
                      ).text.toUpperCase()}
                    </span>
                  </div>
                  <div className="audience-display">👥 Sent to: All Users</div>
                </div>
              </div>

              <div className="content-section">
                <h3>Message Content</h3>
                <div className="message-content">
                  {selectedAnnouncement.content
                    .split("\n")
                    .map((paragraph, index) => (
                      <p key={index}>{paragraph || <br />}</p>
                    ))}
                </div>
              </div>

              <div className="action-buttons">
                <button
                  className="btn btn-outline delete-btn"
                  onClick={() => openDeleteModal(selectedAnnouncement)}
                  disabled={loading}
                >
                  🗑 Delete
                </button>
              </div>
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-icon">📢</div>
              <h3>No Announcement Selected</h3>
              <p>Select an announcement from the list to view details.</p>
            </div>
          )}
        </div>
      </div>

      {/* Create New Announcement Modal */}
      {showNewAnnouncement && (
        <div
          className="modal-overlay"
          onClick={() => setShowNewAnnouncement(false)}
        >
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Create Notification</h3>
              <button
                className="modal-close"
                onClick={() => setShowNewAnnouncement(false)}
              >
                ×
              </button>
            </div>

            <div className="modal-content">
              <NotificationForm
                onSubmit={handleSendAnnouncement}
                loading={loading}
                onCancel={() => setShowNewAnnouncement(false)}
              />
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div
          className="modal-overlay"
          onClick={() => setShowDeleteModal(false)}
        >
          <div
            className="modal-container small"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h3>Delete Announcement</h3>
              <button
                className="modal-close"
                onClick={() => setShowDeleteModal(false)}
              >
                ×
              </button>
            </div>
            <div className="modal-content">
              <div className="delete-confirmation">
                <div className="warning-icon">⚠️</div>
                <h4>Are you sure?</h4>
                <p>This will permanently delete the announcement:</p>
                <div className="announcement-to-delete">
                  <strong>{announcementToDelete?.title}</strong>
                  <p>{announcementToDelete?.content.substring(0, 100)}...</p>
                </div>
                <p className="warning-text">This action cannot be undone.</p>
                <div className="modal-actions">
                  <button
                    className="btn btn-secondary"
                    onClick={() => setShowDeleteModal(false)}
                    disabled={loading}
                  >
                    Cancel
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={handleDeleteAnnouncement}
                    disabled={loading}
                  >
                    {loading ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Announcements;
