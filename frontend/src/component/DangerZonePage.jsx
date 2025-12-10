import React, { useState, useMemo, useEffect } from "react";
import {
  GoogleMap,
  Marker,
  InfoWindow,
  Polygon,
  useLoadScript,
} from "@react-google-maps/api";
import "../css/DangerZonePage.css";
import Modal from "../component/Modal";

// Sample data
const initialZones = [
  {
    id: 1,
    name: "Main Parking Lot",
    location: { lat: 8.8925, lng: 38.808 },
    severity: "high",
    description: "Poor lighting and multiple theft incidents reported",
    incidents: 5,
    status: "active",
    radius: 150,
    types: ["theft", "assault"],
    lastIncident: "2 hours ago",
    createdAt: "2024-01-15",
    updatedAt: "2024-01-20",
  },
  // ... other zones
];

const DangerZonePage = () => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "AIzaSyDGOfKLp0FxNKr6BxKHlJPKDcBWji1uGWI",
    libraries: ["places"],
  });

  // State Management
  const [zones, setZones] = useState(initialZones);
  const [filterSeverity, setFilterSeverity] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedZone, setSelectedZone] = useState(null);
  const [mapCenter, setMapCenter] = useState({ lat: 8.8913, lng: 38.8089 });
  const [mapZoom, setMapZoom] = useState(16);

  // Modal States
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [selectedIncident, setSelectedIncident] = useState(null);

  // Form States
  const [newZone, setNewZone] = useState({
    name: "",
    severity: "medium",
    description: "",
    radius: 100,
    status: "active",
    types: [],
  });

  // Filtered zones
  const filteredZones = useMemo(() => {
    return zones.filter((zone) => {
      const matchesSeverity =
        filterSeverity === "all" || zone.severity === filterSeverity;
      const matchesStatus =
        filterStatus === "all" || zone.status === filterStatus;
      const matchesSearch =
        searchQuery === "" ||
        zone.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSeverity && matchesStatus && matchesSearch;
    });
  }, [zones, filterSeverity, filterStatus, searchQuery]);

  // Get severity color
  const getSeverityColor = (severity) => {
    switch (severity) {
      case "high":
        return "#FF3B30";
      case "medium":
        return "#FF9500";
      case "low":
        return "#34C759";
      default:
        return "#8E8E93";
    }
  };

  // Handle zone creation
  const handleCreateZone = () => {
    const newZoneObj = {
      id: Date.now(),
      ...newZone,
      location: mapCenter,
      incidents: 0,
      types: newZone.types || [],
      lastIncident: "Never",
      createdAt: new Date().toISOString().split("T")[0],
      updatedAt: new Date().toISOString().split("T")[0],
    };

    setZones([...zones, newZoneObj]);
    setNewZone({
      name: "",
      severity: "medium",
      description: "",
      radius: 100,
      status: "active",
      types: [],
    });
    setShowCreateModal(false);
  };

  return (
    <div className="danger-zones-page">
      {/* Page Header */}
      <div className="page-header">
        <div className="header-left">
          <h1>Danger Zone Management</h1>
          <p>Monitor and manage campus safety zones</p>
        </div>
        <div className="header-actions">
          <button
            className="btn btn-primary"
            onClick={() => setShowCreateModal(true)}
          >
            📍 Create Danger Zone
          </button>
        </div>
      </div>

      {/* Content Grid */}
      <div className="content-grid">
        {/* Left Panel - Stats & Controls */}
        <div className="left-panel">
          {/* Quick Stats */}
          <div className="stats-cards">
            <div className="stat-card">
              <div className="stat-icon">📍</div>
              <div className="stat-content">
                <h3>{zones.length}</h3>
                <p>Total Zones</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon" style={{ color: "#FF3B30" }}>
                ⚠️
              </div>
              <div className="stat-content">
                <h3>{zones.filter((z) => z.severity === "high").length}</h3>
                <p>High Risk</p>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="filters-section">
            <div className="filter-group">
              <h4>Quick Filters</h4>
              <div className="filter-chips">
                <button
                  className={`filter-chip ${
                    filterSeverity === "all" ? "active" : ""
                  }`}
                  onClick={() => setFilterSeverity("all")}
                >
                  All
                </button>
                <button
                  className={`filter-chip ${
                    filterSeverity === "high" ? "active" : ""
                  }`}
                  onClick={() => setFilterSeverity("high")}
                  style={{ background: "#FF3B3020", color: "#FF3B30" }}
                >
                  High Risk
                </button>
                <button
                  className={`filter-chip ${
                    filterSeverity === "medium" ? "active" : ""
                  }`}
                  onClick={() => setFilterSeverity("medium")}
                  style={{ background: "#FF950020", color: "#FF9500" }}
                >
                  Medium Risk
                </button>
              </div>
            </div>

            <div className="search-box">
              <input
                type="text"
                placeholder="Search zones..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <span className="search-icon">🔍</span>
            </div>
          </div>

          {/* Zone List */}
          <div className="zone-list-container">
            <div className="zone-list-header">
              <h4>Danger Zones ({filteredZones.length})</h4>
              <span className="sort-option">Newest ↓</span>
            </div>
            <div className="zone-list">
              {filteredZones.map((zone) => (
                <div
                  key={zone.id}
                  className={`zone-item ${
                    selectedZone?.id === zone.id ? "selected" : ""
                  }`}
                  onClick={() => {
                    setSelectedZone(zone);
                    setMapCenter(zone.location);
                    setMapZoom(17);
                  }}
                >
                  <div
                    className="zone-marker"
                    style={{ background: getSeverityColor(zone.severity) }}
                  ></div>
                  <div className="zone-content">
                    <div className="zone-header">
                      <h5>{zone.name}</h5>
                      <span className="zone-status">{zone.status}</span>
                    </div>
                    <p className="zone-description">{zone.description}</p>
                    <div className="zone-footer">
                      <span>⚠️ {zone.incidents} incidents</span>
                      <span>📏 {zone.radius}m radius</span>
                    </div>
                  </div>
                  <div className="zone-actions">
                    <button
                      className="action-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowEditModal(true);
                      }}
                    >
                      ✏️
                    </button>
                    <button
                      className="action-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowStatusModal(true);
                      }}
                    >
                      🔄
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
                }}
              >
                {/* Markers */}
                {zones.map((zone) => (
                  <Marker
                    key={zone.id}
                    position={zone.location}
                    icon={{
                      path: window.google.maps.SymbolPath.CIRCLE,
                      fillColor: getSeverityColor(zone.severity),
                      fillOpacity: 0.8,
                      strokeColor: "#FFFFFF",
                      strokeWeight: 2,
                      scale: 10,
                    }}
                    onClick={() => {
                      setSelectedZone(zone);
                      setMapCenter(zone.location);
                    }}
                  />
                ))}

                {/* Info Window */}
                {selectedZone && (
                  <InfoWindow
                    position={selectedZone.location}
                    onCloseClick={() => setSelectedZone(null)}
                  >
                    <div className="info-window">
                      <h4>{selectedZone.name}</h4>
                      <div className="info-tags">
                        <span
                          className="severity-tag"
                          style={{
                            background: getSeverityColor(selectedZone.severity),
                          }}
                        >
                          {selectedZone.severity}
                        </span>
                        <span className="status-tag">
                          {selectedZone.status}
                        </span>
                      </div>
                      <p>{selectedZone.description}</p>
                      <div className="info-stats">
                        <span>📊 {selectedZone.incidents} incidents</span>
                        <span>📍 {selectedZone.radius}m</span>
                      </div>
                      <div className="info-actions">
                        <button className="btn btn-small">View Details</button>
                        <button className="btn btn-small">Edit</button>
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
              }}
            >
              🏛️
            </button>
          </div>

          {/* Recent Incidents */}
          <div className="incidents-panel">
            <div className="panel-header">
              <h4>Recent Incidents</h4>
              <button className="view-all-btn">View All →</button>
            </div>
            <div className="incidents-list">
              {[
                {
                  id: 1,
                  title: "Phone stolen near parking",
                  type: "theft",
                  time: "2h ago",
                },
                {
                  id: 2,
                  title: "Fight reported at cafeteria",
                  type: "assault",
                  time: "5h ago",
                },
                {
                  id: 3,
                  title: "Suspicious person near dorms",
                  type: "suspicious",
                  time: "1d ago",
                },
              ].map((incident) => (
                <div key={incident.id} className="incident-item">
                  <div className="incident-icon">⚠️</div>
                  <div className="incident-content">
                    <h5>{incident.title}</h5>
                    <div className="incident-meta">
                      <span className="incident-type">{incident.type}</span>
                      <span className="incident-time">{incident.time}</span>
                    </div>
                  </div>
                  <button
                    className="link-incident-btn"
                    onClick={() => {
                      setSelectedIncident(incident);
                      setShowLinkModal(true);
                    }}
                  >
                    🔗 Link
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CREATE ZONE MODAL */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create New Danger Zone"
        size="large"
      >
        <div className="modal-form">
          <div className="form-group">
            <label>Zone Name *</label>
            <input
              type="text"
              value={newZone.name}
              onChange={(e) => setNewZone({ ...newZone, name: e.target.value })}
              placeholder="Enter zone name"
            />
          </div>

          <div className="form-group">
            <label>Severity Level *</label>
            <div className="severity-options">
              {["low", "medium", "high"].map((level) => (
                <button
                  key={level}
                  className={`severity-option ${
                    newZone.severity === level ? "selected" : ""
                  }`}
                  onClick={() => setNewZone({ ...newZone, severity: level })}
                  style={{
                    background:
                      newZone.severity === level
                        ? getSeverityColor(level)
                        : getSeverityColor(level) + "20",
                    color:
                      newZone.severity === level
                        ? "white"
                        : getSeverityColor(level),
                  }}
                >
                  {level.charAt(0).toUpperCase() + level.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Radius (meters) *</label>
              <input
                type="range"
                min="50"
                max="500"
                value={newZone.radius}
                onChange={(e) =>
                  setNewZone({ ...newZone, radius: parseInt(e.target.value) })
                }
              />
              <div className="range-value">{newZone.radius}m</div>
            </div>
            <div className="form-group">
              <label>Status *</label>
              <select
                value={newZone.status}
                onChange={(e) =>
                  setNewZone({ ...newZone, status: e.target.value })
                }
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="under_review">Under Review</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Description *</label>
            <textarea
              value={newZone.description}
              onChange={(e) =>
                setNewZone({ ...newZone, description: e.target.value })
              }
              placeholder="Describe why this area is dangerous..."
              rows="4"
            />
          </div>

          <div className="modal-actions">
            <button
              className="btn btn-secondary"
              onClick={() => setShowCreateModal(false)}
            >
              Cancel
            </button>
            <button
              className="btn btn-primary"
              onClick={handleCreateZone}
              disabled={!newZone.name.trim()}
            >
              Create Zone
            </button>
          </div>
        </div>
      </Modal>

      {/* LINK INCIDENT MODAL */}
      <Modal
        isOpen={showLinkModal}
        onClose={() => setShowLinkModal(false)}
        title="Link Incident to Danger Zone"
        size="medium"
      >
        <div className="link-incident-modal">
          {selectedIncident && (
            <div className="incident-info">
              <h4>⚠️ {selectedIncident.title}</h4>
              <p>Type: {selectedIncident.type}</p>
              <p>Time: {selectedIncident.time}</p>
            </div>
          )}

          <div className="form-group">
            <label>Select Danger Zone to Link</label>
            <select className="zone-select">
              <option value="">Select a zone...</option>
              {zones.map((zone) => (
                <option key={zone.id} value={zone.id}>
                  {zone.name} ({zone.severity} risk)
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Link Description (Optional)</label>
            <textarea
              placeholder="Add notes about linking this incident..."
              rows="3"
            />
          </div>

          <div className="modal-actions">
            <button
              className="btn btn-secondary"
              onClick={() => setShowLinkModal(false)}
            >
              Cancel
            </button>
            <button className="btn btn-primary">🔗 Link Incident</button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default DangerZonePage;
