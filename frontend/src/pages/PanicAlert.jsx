import React, { useState } from "react";
import {
  GoogleMap,
  Marker,
  InfoWindow,
  useLoadScript,
} from "@react-google-maps/api";
import "../css/PanicAlertPage.css";

// Simple sample data
const initialAlerts = [
  {
    id: 1,
    name: "John Doe",
    email: "john.doe@university.edu",
    location: { lat: 8.8925, lng: 38.808 },
    timestamp: "2 minutes ago",
    message: "Emergency near library",
    status: "active",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane.smith@university.edu",
    location: { lat: 8.893, lng: 38.807 },
    timestamp: "15 minutes ago",
    message: "Suspicious activity",
    status: "active",
  },
  {
    id: 3,
    name: "Mike Johnson",
    email: "mike.j@university.edu",
    location: { lat: 8.891, lng: 38.809 },
    timestamp: "1 hour ago",
    message: "Medical emergency",
    status: "resolved",
  },
  {
    id: 4,
    name: "Sarah Williams",
    email: "sarah.w@university.edu",
    location: { lat: 8.892, lng: 38.806 },
    timestamp: "30 minutes ago",
    message: "Accident in parking lot",
    status: "active",
  },
];

const PanicAlertsPage = () => {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: "AIzaSyDGOfKLp0FxNKr6BxKHlJPKDcBWji1uGWI",
  });

  const [alerts, setAlerts] = useState(initialAlerts);
  const [resolved, setResolved] = useState(false);
  const [resolvedAlerts, setResolvedAlerts] = useState([]);
  const [selectedAlert, setSelectedAlert] = useState(initialAlerts[0]);
  const [mapCenter] = useState({ lat: 8.8913, lng: 38.8089 });
  const [mapZoom] = useState(16);

  // Handle alert click
  const handleAlertClick = (alert) => {
    setSelectedAlert(alert);
  };

  const toggleAlertStatus = (alertId) => {
    setAlerts((prevAlerts) =>
      prevAlerts.map((alert) => {
        if (alert.id === alertId) {
          const newStatus = alert.status === "active" ? "resolved" : "active";
          return { ...alert, status: newStatus };
        }
        return alert;
      })
    );

    // Also update selectedAlert if it's the one being toggled
    if (selectedAlert && selectedAlert.id === alertId) {
      setSelectedAlert((prev) => ({
        ...prev,
        status: prev.status === "active" ? "resolved" : "active",
      }));
    }
  };

  return (
    <div className="panic-alerts-container">
      {/* Page Title */}
      <div className="page-title">
        <h1>🚨 Panic Alerts</h1>
        <p>Active emergency notifications from campus</p>
      </div>

      <div className="alerts-content">
        {/* Left Side - Alerts List */}
        <div className="alerts-list-section">
          <div className="alerts-header">
            <h3>Recent Alerts ({alerts.length})</h3>
            <div className="filter-buttons">
              <button className="filter-btn active">All</button>
              <button className="filter-btn">Active</button>
              <button className="filter-btn">Resolved</button>
            </div>
          </div>

          <div className="alerts-list">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className={`alert-card ${
                  selectedAlert?.id === alert.id ? "selected" : ""
                }`}
                onClick={() => handleAlertClick(alert)}
              >
                <div className="alert-status" data-status={alert.status}></div>
                <div className="alert-content">
                  <div className="alert-header">
                    <h4>{alert.name}</h4>
                    <span className="alert-time">{alert.timestamp}</span>
                  </div>
                  <p className="alert-email">📧 {alert.email}</p>
                  <p className="alert-location">
                    📍 Lat: {alert.location.lat.toFixed(4)}, Lng:{" "}
                    {alert.location.lng.toFixed(4)}
                  </p>
                  <p className="alert-message">{alert.message}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side - Map */}
        <div className="map-section">
          {!isLoaded ? (
            <div className="map-loading">Loading map...</div>
          ) : (
            <>
              <GoogleMap
                mapContainerClassName="map-container"
                center={selectedAlert?.location || mapCenter}
                zoom={mapZoom}
              >
                {/* Marker for selected alert */}
                {selectedAlert && (
                  <Marker
                    position={selectedAlert.location}
                    onClick={() => {}}
                  />
                )}

                {/* Info Window for selected alert */}
                {selectedAlert && (
                  <InfoWindow
                    position={selectedAlert.location}
                    onCloseClick={() => setSelectedAlert(null)}
                  >
                    <div className="info-window">
                      <h4>{selectedAlert.name}</h4>
                      <p>
                        <strong>Email:</strong> {selectedAlert.email}
                      </p>
                      <p>
                        <strong>Location:</strong>
                      </p>
                      <p>Lat: {selectedAlert.location.lat.toFixed(6)}</p>
                      <p>Lng: {selectedAlert.location.lng.toFixed(6)}</p>
                      <p>
                        <strong>Status:</strong> {selectedAlert.status}
                      </p>
                    </div>
                  </InfoWindow>
                )}
              </GoogleMap>

              {/* Selected Alert Details */}
              {selectedAlert && (
                <div className="alert-details">
                  <div className="container">
                    <h3>Selected Alert Details</h3>
                    <button
                      className="status-toggle-btn"
                      onClick={() => toggleAlertStatus(selectedAlert.id)}
                    >
                      Mark as{" "}
                      {selectedAlert.status === "active"
                        ? "Resolved"
                        : "Active"}
                    </button>
                  </div>

                  <div className="details-grid">
                    <div className="detail-item">
                      <label>Name:</label>
                      <span>{selectedAlert.name}</span>
                    </div>
                    <div className="detail-item">
                      <label>Email:</label>
                      <span>{selectedAlert.email}</span>
                    </div>
                    <div className="detail-item">
                      <label>Latitude:</label>
                      <span>{selectedAlert.location.lat.toFixed(6)}</span>
                    </div>
                    <div className="detail-item">
                      <label>Longitude:</label>
                      <span>{selectedAlert.location.lng.toFixed(6)}</span>
                    </div>
                    <div className="detail-item">
                      <label>Time:</label>
                      <span>{selectedAlert.timestamp}</span>
                    </div>
                    <div className="detail-item">
                      <label>Status:</label>
                      <span className={`status-badge ${selectedAlert.status}`}>
                        {selectedAlert.status}
                      </span>
                    </div>
                  </div>
                  <p className="alert-message-full">
                    <strong>Message:</strong> {selectedAlert.message}
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PanicAlertsPage;
