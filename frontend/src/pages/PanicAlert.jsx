import React, { useState, useMemo, useEffect } from "react";
import {
  GoogleMap,
  Marker,
  InfoWindow,
  useLoadScript,
} from "@react-google-maps/api";
import "../css/PanicAlertPage.css";

// Sample panic alert data
const initialAlerts = [
  {
    id: 1,
    name: "Sarah Johnson",
    email: "sarah.j@university.edu",
    phone: "+1 (555) 123-4567",
    location: { lat: 8.8925, lng: 38.808 },
    timestamp: "2024-01-22 14:30:25",
    status: "active",
    type: "medical",
    message: "Need immediate medical assistance near main library",
    emergencyContact: "John Doe (+1-555-987-6543)",
    priority: "high",
  },
  {
    id: 2,
    name: "Michael Chen",
    email: "michael.c@university.edu",
    phone: "+1 (555) 234-5678",
    location: { lat: 8.893, lng: 38.807 },
    timestamp: "2024-01-22 13:45:10",
    status: "responded",
    type: "safety",
    message: "Suspicious person following me near north dorms",
    emergencyContact: "Jane Smith (+1-555-876-5432)",
    priority: "high",
  },
  {
    id: 3,
    name: "Emma Wilson",
    email: "emma.w@university.edu",
    phone: "+1 (555) 345-6789",
    location: { lat: 8.891, lng: 38.809 },
    timestamp: "2024-01-22 12:15:30",
    status: "resolved",
    type: "medical",
    message: "Feeling dizzy and faint near cafeteria",
    emergencyContact: "Parent (+1-555-765-4321)",
    priority: "medium",
  },
  {
    id: 4,
    name: "David Brown",
    email: "david.b@university.edu",
    phone: "+1 (555) 456-7890",
    location: { lat: 8.892, lng: 38.806 },
    timestamp: "2024-01-22 11:20:15",
    status: "active",
    type: "safety",
    message: "Physical altercation in progress near parking lot B",
    emergencyContact: "Roommate (+1-555-654-3210)",
    priority: "critical",
  },
  {
    id: 5,
    name: "Lisa Martinez",
    email: "lisa.m@university.edu",
    phone: "+1 (555) 567-8901",
    location: { lat: 8.8905, lng: 38.8085 },
    timestamp: "2024-01-22 10:05:45",
    status: "in_progress",
    type: "other",
    message: "Fire alarm triggered in science building",
    emergencyContact: "Security Office (+1-555-543-2109)",
    priority: "critical",
  },
  {
    id: 6,
    name: "Robert Taylor",
    email: "robert.t@university.edu",
    phone: "+1 (555) 678-9012",
    location: { lat: 8.894, lng: 38.805 },
    timestamp: "2024-01-22 09:30:20",
    status: "resolved",
    type: "safety",
    message: "Lost personal belongings near sports complex",
    emergencyContact: "Friend (+1-555-432-1098)",
    priority: "low",
  },
];

const PanicAlerts = () => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "AIzaSyDGOfKLp0FxNKr6BxKHlJPKDcBWji1uGWI",
    libraries: ["places"],
  });

  // State Management
  const [alerts, setAlerts] = useState(initialAlerts);
  const [selectedAlert, setSelectedAlert] = useState(initialAlerts[0]);
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [mapCenter, setMapCenter] = useState({ lat: 8.8913, lng: 38.8089 });
  const [mapZoom, setMapZoom] = useState(16);

  // Modal States
  const [showAlertDetails, setShowAlertDetails] = useState(false);
  const [showRespondModal, setShowRespondModal] = useState(false);
  const [showResolveModal, setShowResolveModal] = useState(false);

  // Filtered alerts
  const filteredAlerts = useMemo(() => {
    return alerts.filter((alert) => {
      const matchesStatus =
        filterStatus === "all" || alert.status === filterStatus;
      const matchesPriority =
        filterPriority === "all" || alert.priority === filterPriority;
      const matchesSearch =
        searchQuery === "" ||
        alert.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        alert.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        alert.message.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesStatus && matchesPriority && matchesSearch;
    });
  }, [alerts, filterStatus, filterPriority, searchQuery]);

  // Get priority color
  const getPriorityColor = (priority) => {
    switch (priority) {
      case "critical":
        return "#FF3B30";
      case "high":
        return "#FF9500";
      case "medium":
        return "#FFCC00";
      case "low":
        return "#34C759";
      default:
        return "#8E8E93";
    }
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "#FF3B30";
      case "in_progress":
        return "#FF9500";
      case "responded":
        return "#007AFF";
      case "resolved":
        return "#34C759";
      default:
        return "#8E8E93";
    }
  };

  // Get status text
  const getStatusText = (status) => {
    switch (status) {
      case "active":
        return "Active";
      case "in_progress":
        return "In Progress";
      case "responded":
        return "Responded";
      case "resolved":
        return "Resolved";
      default:
        return status;
    }
  };

  // Handle alert selection
  const handleAlertSelect = (alert) => {
    setSelectedAlert(alert);
    setMapCenter(alert.location);
    setMapZoom(18);
  };

  // Handle status change
  const handleStatusChange = (alertId, newStatus) => {
    setAlerts(
      alerts.map((alert) =>
        alert.id === alertId ? { ...alert, status: newStatus } : alert
      )
    );

    if (selectedAlert?.id === alertId) {
      setSelectedAlert({ ...selectedAlert, status: newStatus });
    }
  };

  // Handle respond to alert
  const handleRespond = () => {
    if (!selectedAlert) return;
    handleStatusChange(selectedAlert.id, "responded");
    setShowRespondModal(false);
  };

  // Handle resolve alert
  const handleResolve = () => {
    if (!selectedAlert) return;
    handleStatusChange(selectedAlert.id, "resolved");
    setShowResolveModal(false);
  };

  // Format timestamp
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  // Format date
  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString([], { month: "short", day: "numeric" });
  };

  // Get time ago
  const getTimeAgo = (timestamp) => {
    const now = new Date();
    const alertTime = new Date(timestamp);
    const diffMs = now - alertTime;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  // Get active alerts count
  const activeAlertsCount = alerts.filter((a) => a.status === "active").length;

  return (
    <div className="panic-alerts-page">
      {/* Page Header */}
      <div className="page-header">
        <div className="header-left">
          <h1>Panic Alerts Dashboard</h1>
          <p>Real-time emergency notifications and response management</p>
        </div>
        <div className="header-actions">
          <div className="active-alerts-badge">
            <span className="badge-count">{activeAlertsCount}</span>
            <span>Active Alerts</span>
          </div>
          <button className="btn btn-primary">🚨 Emergency Broadcast</button>
        </div>
      </div>

      {/* Content Grid */}
      <div className="content-grid">
        {/* Left Panel - Alerts List */}
        <div className="left-panel">
          {/* Filters */}
          <div className="filters-section">
            <div className="filter-row">
              <div className="filter-group">
                <label>Status</label>
                <div className="filter-chips">
                  <button
                    className={`filter-chip ${
                      filterStatus === "all" ? "active" : ""
                    }`}
                    onClick={() => setFilterStatus("all")}
                  >
                    All
                  </button>
                  <button
                    className={`filter-chip ${
                      filterStatus === "active" ? "active" : ""
                    }`}
                    onClick={() => setFilterStatus("active")}
                    style={{
                      background:
                        filterStatus === "active" ? "#FF3B30" : "#FF3B3020",
                      color: filterStatus === "active" ? "white" : "#FF3B30",
                    }}
                  >
                    Active
                  </button>
                  <button
                    className={`filter-chip ${
                      filterStatus === "in_progress" ? "active" : ""
                    }`}
                    onClick={() => setFilterStatus("in_progress")}
                    style={{
                      background:
                        filterStatus === "in_progress"
                          ? "#FF9500"
                          : "#FF950020",
                      color:
                        filterStatus === "in_progress" ? "white" : "#FF9500",
                    }}
                  >
                    In Progress
                  </button>
                  <button
                    className={`filter-chip ${
                      filterStatus === "responded" ? "active" : ""
                    }`}
                    onClick={() => setFilterStatus("responded")}
                    style={{
                      background:
                        filterStatus === "responded" ? "#007AFF" : "#007AFF20",
                      color: filterStatus === "responded" ? "white" : "#007AFF",
                    }}
                  >
                    Responded
                  </button>
                </div>
              </div>

              <div className="filter-group">
                <label>Priority</label>
                <div className="filter-chips">
                  <button
                    className={`filter-chip ${
                      filterPriority === "all" ? "active" : ""
                    }`}
                    onClick={() => setFilterPriority("all")}
                  >
                    All
                  </button>
                  <button
                    className={`filter-chip ${
                      filterPriority === "critical" ? "active" : ""
                    }`}
                    onClick={() => setFilterPriority("critical")}
                    style={{
                      background:
                        filterPriority === "critical" ? "#FF3B30" : "#FF3B3020",
                      color:
                        filterPriority === "critical" ? "white" : "#FF3B30",
                    }}
                  >
                    Critical
                  </button>
                  <button
                    className={`filter-chip ${
                      filterPriority === "high" ? "active" : ""
                    }`}
                    onClick={() => setFilterPriority("high")}
                    style={{
                      background:
                        filterPriority === "high" ? "#FF9500" : "#FF950020",
                      color: filterPriority === "high" ? "white" : "#FF9500",
                    }}
                  >
                    High
                  </button>
                  <button
                    className={`filter-chip ${
                      filterPriority === "medium" ? "active" : ""
                    }`}
                    onClick={() => setFilterPriority("medium")}
                    style={{
                      background:
                        filterPriority === "medium" ? "#FFCC00" : "#FFCC0020",
                      color: filterPriority === "medium" ? "white" : "#FFCC00",
                    }}
                  >
                    Medium
                  </button>
                </div>
              </div>
            </div>

            <div className="search-box">
              <input
                type="text"
                placeholder="Search alerts by name, email, or message..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <span className="search-icon">🔍</span>
            </div>
          </div>

          {/* Alerts List */}
          <div className="alerts-list-container">
            <div className="alerts-list-header">
              <h4>Recent Alerts ({filteredAlerts.length})</h4>
              <span className="sort-option">Latest ↓</span>
            </div>
            <div className="alerts-list">
              {filteredAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`alert-item ${
                    selectedAlert?.id === alert.id ? "selected" : ""
                  }`}
                  onClick={() => handleAlertSelect(alert)}
                >
                  <div
                    className="alert-priority"
                    style={{ background: getPriorityColor(alert.priority) }}
                  ></div>
                  <div className="alert-content">
                    <div className="alert-header">
                      <h5>{alert.name}</h5>
                      <div
                        className="alert-status"
                        style={{
                          background: getStatusColor(alert.status) + "20",
                          color: getStatusColor(alert.status),
                        }}
                      >
                        {getStatusText(alert.status)}
                      </div>
                    </div>
                    <p className="alert-email">{alert.email}</p>
                    <p className="alert-message">{alert.message}</p>
                    <div className="alert-footer">
                      <span className="alert-time">
                        <span className="time-icon">🕒</span>
                        {getTimeAgo(alert.timestamp)}
                      </span>
                      <span className="alert-location">
                        <span className="location-icon">📍</span>
                        {alert.location.lat.toFixed(4)},{" "}
                        {alert.location.lng.toFixed(4)}
                      </span>
                    </div>
                  </div>
                  <div className="alert-actions">
                    <button
                      className="action-btn view-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAlertSelect(alert);
                        setShowAlertDetails(true);
                      }}
                      title="View Details"
                    >
                      👁️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Panel - Map */}
        <div className="right-panel">
          <div className="map-container">
            {loadError ? (
              <div className="map-error">Failed to load map</div>
            ) : !isLoaded ? (
              <div className="map-loading">Loading map...</div>
            ) : (
              <GoogleMap
                mapContainerStyle={{ width: "100%", height: "100%" }}
                center={mapCenter}
                zoom={mapZoom}
                options={{
                  streetViewControl: false,
                  mapTypeControl: false,
                  fullscreenControl: false,
                  styles: [
                    {
                      featureType: "poi",
                      elementType: "labels",
                      stylers: [{ visibility: "off" }],
                    },
                  ],
                }}
              >
                {/* Markers for all alerts */}
                {alerts.map((alert) => (
                  <Marker
                    key={alert.id}
                    position={alert.location}
                    icon={{
                      path: window.google.maps.SymbolPath.CIRCLE,
                      fillColor: getPriorityColor(alert.priority),
                      fillOpacity: alert.id === selectedAlert?.id ? 1 : 0.7,
                      strokeColor: "#FFFFFF",
                      strokeWeight: alert.id === selectedAlert?.id ? 3 : 2,
                      scale: alert.id === selectedAlert?.id ? 12 : 8,
                    }}
                    onClick={() => handleAlertSelect(alert)}
                  />
                ))}

                {/* Info Window for selected alert */}
                {selectedAlert && (
                  <InfoWindow
                    position={selectedAlert.location}
                    onCloseClick={() => setSelectedAlert(null)}
                  >
                    <div className="alert-info-window">
                      <div className="info-header">
                        <h4>{selectedAlert.name}</h4>
                        <div
                          className="info-priority"
                          style={{
                            background: getPriorityColor(
                              selectedAlert.priority
                            ),
                            color: "white",
                          }}
                        >
                          {selectedAlert.priority.toUpperCase()}
                        </div>
                      </div>
                      <div className="info-details">
                        <p>
                          <strong>Status:</strong>{" "}
                          <span
                            style={{
                              color: getStatusColor(selectedAlert.status),
                            }}
                          >
                            {getStatusText(selectedAlert.status)}
                          </span>
                        </p>
                        <p>
                          <strong>Type:</strong> {selectedAlert.type}
                        </p>
                        <p>
                          <strong>Location:</strong>{" "}
                          {selectedAlert.location.lat.toFixed(6)},{" "}
                          {selectedAlert.location.lng.toFixed(6)}
                        </p>
                        <p>
                          <strong>Time:</strong>{" "}
                          {formatTime(selectedAlert.timestamp)} (
                          {getTimeAgo(selectedAlert.timestamp)})
                        </p>
                      </div>
                      <div className="info-actions">
                        <button
                          className="btn btn-small"
                          onClick={() => setShowAlertDetails(true)}
                        >
                          View Details
                        </button>
                        {selectedAlert.status !== "responded" &&
                          selectedAlert.status !== "resolved" && (
                            <button
                              className="btn btn-small"
                              onClick={() => setShowRespondModal(true)}
                            >
                              Respond
                            </button>
                          )}
                      </div>
                    </div>
                  </InfoWindow>
                )}
              </GoogleMap>
            )}
          </div>

          {/* Map Controls */}
          <div className="map-controls">
            <button
              className="control-btn"
              onClick={() => setMapZoom(mapZoom + 1)}
            >
              +
            </button>
            <button
              className="control-btn"
              onClick={() => setMapZoom(mapZoom - 1)}
            >
              -
            </button>
            <button
              className="control-btn"
              onClick={() => {
                setMapCenter({ lat: 8.8913, lng: 38.8089 });
                setMapZoom(16);
                setSelectedAlert(null);
              }}
            >
              🏛️
            </button>
          </div>

          {/* Selected Alert Details */}
          {selectedAlert && (
            <div className="alert-details-panel">
              <div className="panel-header">
                <h4>Alert Details</h4>
                <div className="alert-indicator">
                  <div
                    className="indicator-dot"
                    style={{
                      background: getPriorityColor(selectedAlert.priority),
                    }}
                  ></div>
                  <span className="indicator-text">
                    {selectedAlert.priority.toUpperCase()} PRIORITY
                  </span>
                </div>
              </div>

              <div className="alert-details-content">
                <div className="detail-row">
                  <span className="detail-label">Name:</span>
                  <span className="detail-value">{selectedAlert.name}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Email:</span>
                  <span className="detail-value">{selectedAlert.email}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Phone:</span>
                  <span className="detail-value">{selectedAlert.phone}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Location:</span>
                  <span className="detail-value">
                    {selectedAlert.location.lat.toFixed(6)},{" "}
                    {selectedAlert.location.lng.toFixed(6)}
                  </span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Time Reported:</span>
                  <span className="detail-value">
                    {formatDate(selectedAlert.timestamp)} at{" "}
                    {formatTime(selectedAlert.timestamp)}
                  </span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Emergency Contact:</span>
                  <span className="detail-value">
                    {selectedAlert.emergencyContact}
                  </span>
                </div>

                <div className="detail-message">
                  <span className="detail-label">Message:</span>
                  <p className="message-content">{selectedAlert.message}</p>
                </div>
              </div>

              <div className="alert-action-buttons">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowAlertDetails(true)}
                >
                  📋 Full Details
                </button>
                {selectedAlert.status === "active" && (
                  <button
                    className="btn btn-primary"
                    onClick={() => setShowRespondModal(true)}
                  >
                    🚑 Respond Now
                  </button>
                )}
                {selectedAlert.status === "responded" && (
                  <button
                    className="btn btn-success"
                    onClick={() => setShowResolveModal(true)}
                  >
                    ✅ Mark Resolved
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ALERT DETAILS MODAL */}
      {selectedAlert && (
        <div
          className={`modal-overlay ${showAlertDetails ? "active" : ""}`}
          onClick={() => setShowAlertDetails(false)}
        >
          <div
            className="modal-container large"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h3>Panic Alert Details</h3>
              <button
                className="modal-close"
                onClick={() => setShowAlertDetails(false)}
              >
                ×
              </button>
            </div>
            <div className="modal-content">
              <div className="alert-detail-modal">
                <div
                  className="alert-detail-header"
                  style={{
                    background: getPriorityColor(selectedAlert.priority) + "20",
                  }}
                >
                  <div className="alert-title-section">
                    <h4>{selectedAlert.name}</h4>
                    <p>{selectedAlert.email}</p>
                  </div>
                  <div className="alert-status-section">
                    <div
                      className="priority-badge"
                      style={{
                        background: getPriorityColor(selectedAlert.priority),
                        color: "white",
                      }}
                    >
                      {selectedAlert.priority.toUpperCase()} PRIORITY
                    </div>
                    <div
                      className="status-badge"
                      style={{
                        background: getStatusColor(selectedAlert.status) + "20",
                        color: getStatusColor(selectedAlert.status),
                      }}
                    >
                      {getStatusText(selectedAlert.status)}
                    </div>
                  </div>
                </div>

                <div className="alert-detail-grid">
                  <div className="detail-column">
                    <div className="detail-card">
                      <h5>Contact Information</h5>
                      <div className="detail-item">
                        <span className="detail-icon">📧</span>
                        <div>
                          <div className="detail-label">Email</div>
                          <div className="detail-value">
                            {selectedAlert.email}
                          </div>
                        </div>
                      </div>
                      <div className="detail-item">
                        <span className="detail-icon">📱</span>
                        <div>
                          <div className="detail-label">Phone</div>
                          <div className="detail-value">
                            {selectedAlert.phone}
                          </div>
                        </div>
                      </div>
                      <div className="detail-item">
                        <span className="detail-icon">👤</span>
                        <div>
                          <div className="detail-label">Emergency Contact</div>
                          <div className="detail-value">
                            {selectedAlert.emergencyContact}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="detail-card">
                      <h5>Location Details</h5>
                      <div className="detail-item">
                        <span className="detail-icon">📍</span>
                        <div>
                          <div className="detail-label">Coordinates</div>
                          <div className="detail-value">
                            Lat: {selectedAlert.location.lat.toFixed(6)}
                            <br />
                            Lng: {selectedAlert.location.lng.toFixed(6)}
                          </div>
                        </div>
                      </div>
                      <div className="detail-item">
                        <span className="detail-icon">🗺️</span>
                        <div>
                          <div className="detail-label">Estimated Address</div>
                          <div className="detail-value">
                            Near Main Library, University Campus
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="detail-column">
                    <div className="detail-card">
                      <h5>Alert Information</h5>
                      <div className="detail-item">
                        <span className="detail-icon">🕒</span>
                        <div>
                          <div className="detail-label">Time Reported</div>
                          <div className="detail-value">
                            {formatDate(selectedAlert.timestamp)} at{" "}
                            {formatTime(selectedAlert.timestamp)}
                          </div>
                        </div>
                      </div>
                      <div className="detail-item">
                        <span className="detail-icon">⏱️</span>
                        <div>
                          <div className="detail-label">Time Since Alert</div>
                          <div className="detail-value">
                            {getTimeAgo(selectedAlert.timestamp)}
                          </div>
                        </div>
                      </div>
                      <div className="detail-item">
                        <span className="detail-icon">🚨</span>
                        <div>
                          <div className="detail-label">Alert Type</div>
                          <div className="detail-value">
                            {selectedAlert.type.toUpperCase()}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="detail-card">
                      <h5>Emergency Message</h5>
                      <div className="emergency-message">
                        <div className="message-icon">💬</div>
                        <div className="message-content">
                          <p>{selectedAlert.message}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="modal-actions">
                  <button
                    className="btn btn-secondary"
                    onClick={() => setShowAlertDetails(false)}
                  >
                    Close
                  </button>
                  <div className="action-group">
                    {selectedAlert.status === "active" && (
                      <button
                        className="btn btn-primary"
                        onClick={() => {
                          setShowAlertDetails(false);
                          setShowRespondModal(true);
                        }}
                      >
                        🚑 Dispatch Response Team
                      </button>
                    )}
                    {selectedAlert.status === "responded" && (
                      <button
                        className="btn btn-success"
                        onClick={() => {
                          setShowAlertDetails(false);
                          setShowResolveModal(true);
                        }}
                      >
                        ✅ Mark as Resolved
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* RESPOND MODAL */}
      <div
        className={`modal-overlay ${showRespondModal ? "active" : ""}`}
        onClick={() => setShowRespondModal(false)}
      >
        <div
          className="modal-container medium"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="modal-header">
            <h3>Respond to Alert</h3>
            <button
              className="modal-close"
              onClick={() => setShowRespondModal(false)}
            >
              ×
            </button>
          </div>
          <div className="modal-content">
            <div className="respond-modal">
              <div className="warning-icon">🚨</div>
              <h4>Dispatch Response Team</h4>
              <p>
                You are about to mark this alert as "In Progress" and dispatch a
                response team.
              </p>

              {selectedAlert && (
                <div className="alert-summary">
                  <p>
                    <strong>Alert:</strong> {selectedAlert.name} -{" "}
                    {selectedAlert.type}
                  </p>
                  <p>
                    <strong>Location:</strong>{" "}
                    {selectedAlert.location.lat.toFixed(4)},{" "}
                    {selectedAlert.location.lng.toFixed(4)}
                  </p>
                  <p>
                    <strong>Priority:</strong>{" "}
                    <span
                      style={{
                        color: getPriorityColor(selectedAlert.priority),
                      }}
                    >
                      {selectedAlert.priority.toUpperCase()}
                    </span>
                  </p>
                </div>
              )}

              <div className="form-group">
                <label>Response Notes (Optional)</label>
                <textarea
                  placeholder="Add any notes about the response..."
                  rows="3"
                />
              </div>

              <div className="modal-actions">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowRespondModal(false)}
                >
                  Cancel
                </button>
                <button className="btn btn-primary" onClick={handleRespond}>
                  🚑 Confirm Dispatch
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* RESOLVE MODAL */}
      <div
        className={`modal-overlay ${showResolveModal ? "active" : ""}`}
        onClick={() => setShowResolveModal(false)}
      >
        <div
          className="modal-container medium"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="modal-header">
            <h3>Resolve Alert</h3>
            <button
              className="modal-close"
              onClick={() => setShowResolveModal(false)}
            >
              ×
            </button>
          </div>
          <div className="modal-content">
            <div className="resolve-modal">
              <div className="success-icon">✅</div>
              <h4>Mark Alert as Resolved</h4>
              <p>Confirm that this emergency has been resolved.</p>

              {selectedAlert && (
                <div className="alert-summary">
                  <p>
                    <strong>Alert:</strong> {selectedAlert.name}
                  </p>
                  <p>
                    <strong>Status:</strong>{" "}
                    <span
                      style={{ color: getStatusColor(selectedAlert.status) }}
                    >
                      {getStatusText(selectedAlert.status)}
                    </span>
                  </p>
                  <p>
                    <strong>Response Time:</strong>{" "}
                    {getTimeAgo(selectedAlert.timestamp)}
                  </p>
                </div>
              )}

              <div className="form-group">
                <label>Resolution Notes *</label>
                <textarea
                  placeholder="Describe how the situation was resolved..."
                  rows="3"
                  required
                />
              </div>

              <div className="modal-actions">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowResolveModal(false)}
                >
                  Cancel
                </button>
                <button className="btn btn-success" onClick={handleResolve}>
                  ✅ Mark as Resolved
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PanicAlerts;
