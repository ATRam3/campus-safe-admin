import React, { useState, useEffect } from "react";
import api from "../services/api";
import "../css/Announcements.css";
import NotificationStats from "../component/announcements/NotificationStats";
import NotificationList from "../component/announcements/NotificationList";
import NotificationDetails from "../component/announcements/NotificationDetails";
import CreateNotificationModal from "../component/announcements/CreateNotificationModal";
import DeleteConfirmationModal from "../component/announcements/DeleteConfirmationModal";

const Announcements = () => {
  // State management
  const [announcements, setAnnouncements] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  // Form state - Simplified
  const [showNewNotification, setShowNewNotification] = useState(false);

  // Delete confirmation modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [notificationToDelete, setNotificationToDelete] = useState(null);

  // Error state
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // Fetch announcements on component mount
  useEffect(() => {
    const fetchNotifications = async () => {
      setLoading(true);
      try {
        const [alertsResponse, announcementsResponse] = await Promise.all([
          api.get("/notification/alerts"),
          api.get("/notification/announcements"),
        ]);

        console.log(
          "Alerts response:",
          alertsResponse.data.data[0].targetAudience
        );

        console.log(
          "Alert Status response:",
          announcementsResponse.data.data[0].status
        );
        console.log("alert id : ", announcementsResponse.data.data[0]._id);

        console.log("Announcements response:", announcementsResponse.data);

        const alertsData =
          alertsResponse.data.data || alertsResponse.data || [];
        const announcementsData =
          announcementsResponse.data.data || announcementsResponse.data || [];

        setAlerts(alertsData);
        setAnnouncements(announcementsData);

        const combined = [...alertsData, ...announcementsData];
        combined.sort((a, b) =>
          a.type === b.type
            ? new Date(b.createdAt) - new Date(a.createdAt)
            : a.type === "alert"
            ? -1
            : 1
        );
        setNotifications(combined);

        if (combined.length > 0 && !selectedNotification) {
          setSelectedNotification(combined[0]);
        }
      } catch (error) {
        console.error("Error fetching notifications:", error);
        showError("Failed to load notifications. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  // Filter announcements
  const filteredNotifications = notifications.filter((notification) => {
    const matchesStatus =
      filterStatus === "all" || notification.status === filterStatus;
    const matchesSearch =
      searchQuery === "" ||
      notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notification.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

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

    console.log("SENDING payload:", JSON.stringify(payload, null, 2));

    try {
      setLoading(true);
      const response = await api.post("/notification/alerts", payload);

      const newAnnouncementData = response.data.data || response.data;
      console.log("new Announcement response:", response.data);
      console.log(
        "targetAudience in response:",
        newAnnouncementData.targetAudience
      );
      if (!newAnnouncementData?._id) {
        throw new Error("Invalid response from server");
      }

      setAnnouncements((prev) => [newAnnouncementData, ...prev]);
      setNotifications((prev) => [newAnnouncementData, ...prev]);
      setSelectedNotification(newAnnouncementData);

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
    setNotificationToDelete(announcement);
    setShowDeleteModal(true);
  };

  // Handle delete announcement
  const handleDeleteNotification = async () => {
    if (!notificationToDelete) return;

    try {
      setLoading(true);
      await api.delete(`/notification/alerts/${notificationToDelete._id}`);

      // Remove from state
      const updatedNotifications = notifications.filter(
        (a) => a._id !== notificationToDelete._id
      );
      setNotifications(updatedNotifications);

      // Clear selection if deleted notification was selected
      if (
        selectedNotification &&
        selectedNotification._id === notificationToDelete._id
      ) {
        setSelectedNotification(updatedNotifications[0] || null);
      }

      showSuccess("✅ Notification deleted successfully!");
    } catch (err) {
      console.error("Error deleting notificaiton:", err);
      showError("❌ Failed to delete notificaiton. Please try again.");
    } finally {
      setLoading(false);
      setShowDeleteModal(false);
      setNotificationToDelete(null);
    }
  };

  // Reset form
  const resetForm = () => {
    setShowNewNotification(false);
  };

  // Calculate stats
  const sentCount = notifications.filter((a) => a.status === "sent").length;

  return (
    <div className="announcements-page">
      <div className="page-header">
        <div className="header-left">
          <h1>📢 Announcements & Alerts</h1>
          <p>Send important updates to all campus users</p>
        </div>
        <div className="header-actions">
          <button
            className="btn btn-primary"
            onClick={() => setShowNewNotification(true)}
            disabled={loading}
          >
            + Create New
          </button>
        </div>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="notify notify-success">
          <span className="notify-icon">✅</span>
          <span>{successMessage}</span>
          <button
            className="notify-close"
            onClick={() => setSuccessMessage(null)}
          >
            ×
          </button>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="notify notify-error">
          <span className="notify-icon">⚠️</span>
          <span>{error}</span>
          <button className="notify-close" onClick={() => setError(null)}>
            ×
          </button>
        </div>
      )}

      <NotificationStats sentCount={sentCount} />

      <div className="announcements-content-grid">
        <NotificationList
          notifications={filteredNotifications}
          loading={loading}
          searchQuery={searchQuery}
          filterStatus={filterStatus}
          selectedNotification={selectedNotification}
          onSearchChange={setSearchQuery}
          onFilterChange={setFilterStatus}
          onSelectNotification={setSelectedNotification}
          onDeleteNotification={openDeleteModal}
        />

        <NotificationDetails
          notification={selectedNotification}
          loading={loading}
          onDelete={openDeleteModal}
        />
      </div>

      <CreateNotificationModal
        isOpen={showNewNotification}
        loading={loading}
        onSubmit={handleSendAnnouncement}
        onClose={() => setShowNewNotification(false)}
      />

      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        loading={loading}
        notification={notificationToDelete}
        onConfirm={handleDeleteNotification}
        onClose={() => setShowDeleteModal(false)}
      />
    </div>
  );
};

export default Announcements;
