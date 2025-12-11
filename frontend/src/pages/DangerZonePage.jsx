import React, { useState, useMemo, useEffect } from "react";
import {
  GoogleMap,
  Marker,
  InfoWindow,
  useLoadScript,
} from "@react-google-maps/api";
import "../css/DangerZonePage.css";
import Modal from "../component/Modal.jsx";

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
  {
    id: 2,
    name: "North Dorms Alley",
    location: { lat: 8.893, lng: 38.807 },
    severity: "medium",
    description: "Poorly lit pathway with reported harassment cases",
    incidents: 3,
    status: "active",
    radius: 100,
    types: ["harassment", "theft"],
    lastIncident: "1 day ago",
    createdAt: "2024-01-18",
    updatedAt: "2024-01-22",
  },
  {
    id: 3,
    name: "Library Back Entrance",
    location: { lat: 8.891, lng: 38.809 },
    severity: "low",
    description: "Occasional suspicious activity",
    incidents: 1,
    status: "active",
    radius: 80,
    types: ["suspicious"],
    lastIncident: "3 days ago",
    createdAt: "2024-01-20",
    updatedAt: "2024-01-22",
  },
];

// Sample incidents data
const initialIncidents = [
  {
    id: 1,
    title: "Phone stolen near parking",
    type: "theft",
    time: "2h ago",
    status: "unresolved",
    zoneId: 1,
    description: "Student reported phone theft while walking to car",
    reportedBy: "John Doe",
    reportedAt: "2024-01-22 14:30",
  },
  {
    id: 2,
    title: "Fight reported at cafeteria",
    type: "assault",
    time: "5h ago",
    status: "resolved",
    zoneId: null,
    description: "Two students involved in physical altercation",
    reportedBy: "Cafeteria Staff",
    reportedAt: "2024-01-22 11:45",
  },
  {
    id: 3,
    title: "Suspicious person near dorms",
    type: "suspicious",
    time: "1d ago",
    status: "investigating",
    zoneId: 2,
    description: "Unknown individual loitering near dorm entrance",
    reportedBy: "Security Guard",
    reportedAt: "2024-01-21 22:15",
  },
  {
    id: 4,
    title: "Vandalism in restroom",
    type: "vandalism",
    time: "2d ago",
    status: "resolved",
    zoneId: null,
    description: "Graffiti found in 2nd floor restroom",
    reportedBy: "Janitor",
    reportedAt: "2024-01-20 09:20",
  },
  {
    id: 5,
    title: "Harassment near library",
    type: "harassment",
    time: "12h ago",
    status: "unresolved",
    zoneId: 3,
    description: "Student reported verbal harassment",
    reportedBy: "Anonymous",
    reportedAt: "2024-01-22 08:45",
  },
];

const DangerZonesPage = () => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "AIzaSyDGOfKLp0FxNKr6BxKHlJPKDcBWji1uGWI",
    libraries: ["places"],
  });

  // State Management
  const [zones, setZones] = useState(initialZones);
  const [incidents, setIncidents] = useState(initialIncidents);
  const [filterSeverity, setFilterSeverity] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedZone, setSelectedZone] = useState(null);
  const [mapCenter, setMapCenter] = useState({ lat: 8.8913, lng: 38.8089 });
  const [mapZoom, setMapZoom] = useState(16);

  // Modal States
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showMapModal, setShowMapModal] = useState(false);
  const [showIncidentDeleteModal, setShowIncidentDeleteModal] = useState(false);
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [zoneToDelete, setZoneToDelete] = useState(null);
  const [incidentToDelete, setIncidentToDelete] = useState(null);

  // Form States
  const [newZone, setNewZone] = useState({
    name: "",
    severity: "medium",
    description: "",
    radius: 100,
    status: "active",
    types: [],
    location: { lat: 8.8913, lng: 38.8089 },
  });

  const [editZone, setEditZone] = useState(null);

  // Filtered zones
  const filteredZones = useMemo(() => {
    return zones.filter((zone) => {
      const matchesSeverity =
        filterSeverity === "all" || zone.severity === filterSeverity;
      const matchesStatus =
        filterStatus === "all" || zone.status === filterStatus;
      const matchesSearch =
        searchQuery === "" ||
        zone.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        zone.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSeverity && matchesStatus && matchesSearch;
    });
  }, [zones, filterSeverity, filterStatus, searchQuery]);

  // Filtered incidents
  const filteredIncidents = useMemo(() => {
    return incidents.filter((incident) => {
      const matchesType = filterStatus === "all" || true; // Simplified for now
      const matchesSearch =
        searchQuery === "" ||
        incident.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        incident.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesType && matchesSearch;
    });
  }, [incidents, searchQuery, filterStatus]);

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

  // Get incident status color
  const getIncidentStatusColor = (status) => {
    switch (status) {
      case "resolved":
        return "#34C759";
      case "investigating":
        return "#FF9500";
      case "unresolved":
        return "#FF3B30";
      default:
        return "#8E8E93";
    }
  };

  // Handle zone creation
  const handleCreateZone = () => {
    const newZoneObj = {
      id: Date.now(),
      ...newZone,
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
      location: { lat: 8.8913, lng: 38.8089 },
    });
    setShowCreateModal(false);
  };

  // Handle zone edit
  const handleEditZone = () => {
    if (!editZone) return;

    setZones(
      zones.map((zone) =>
        zone.id === editZone.id
          ? { ...editZone, updatedAt: new Date().toISOString().split("T")[0] }
          : zone
      )
    );
    setShowEditModal(false);
    setEditZone(null);
  };

  // Handle zone deletion
  const handleDeleteZone = () => {
    if (!zoneToDelete) return;

    setZones(zones.filter((zone) => zone.id !== zoneToDelete.id));

    // Also remove this zone from any incidents
    setIncidents(
      incidents.map((incident) =>
        incident.zoneId === zoneToDelete.id
          ? { ...incident, zoneId: null }
          : incident
      )
    );

    setShowDeleteModal(false);
    setZoneToDelete(null);
    setSelectedZone(null);
  };

  // Handle incident deletion
  const handleDeleteIncident = () => {
    if (!incidentToDelete) return;

    setIncidents(
      incidents.filter((incident) => incident.id !== incidentToDelete.id)
    );
    setShowIncidentDeleteModal(false);
    setIncidentToDelete(null);
  };

  // Handle map click for location selection
  const handleMapClick = (e) => {
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();

    if (showCreateModal) {
      setNewZone({ ...newZone, location: { lat, lng } });
    } else if (showEditModal && editZone) {
      setEditZone({ ...editZone, location: { lat, lng } });
    }
  };

  // Initialize edit form
  const openEditModal = (zone) => {
    setEditZone({ ...zone });
    setShowEditModal(true);
  };

  // Initialize delete confirmation
  const openDeleteModal = (zone) => {
    setZoneToDelete(zone);
    setShowDeleteModal(true);
  };

  // Initialize incident delete confirmation
  const openIncidentDeleteModal = (incident) => {
    setIncidentToDelete(incident);
    setShowIncidentDeleteModal(true);
  };

  // Get zone name by ID
  const getZoneName = (zoneId) => {
    const zone = zones.find((z) => z.id === zoneId);
    return zone ? zone.name : "No zone linked";
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
            <div className="stat-card">
              <div className="stat-icon">🚨</div>
              <div className="stat-content">
                <h3>{incidents.length}</h3>
                <p>Total Incidents</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon" style={{ color: "#34C759" }}>
                ✅
              </div>
              <div className="stat-content">
                <h3>
                  {incidents.filter((i) => i.status === "resolved").length}
                </h3>
                <p>Resolved</p>
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
                  All Zones
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
                <button
                  className={`filter-chip ${
                    filterSeverity === "low" ? "active" : ""
                  }`}
                  onClick={() => setFilterSeverity("low")}
                  style={{ background: "#34C75920", color: "#34C759" }}
                >
                  Low Risk
                </button>
              </div>
            </div>

            <div className="search-box">
              <input
                type="text"
                placeholder="Search zones or incidents..."
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
                      <span>
                        📍 {zone.location.lat.toFixed(4)},{" "}
                        {zone.location.lng.toFixed(4)}
                      </span>
                    </div>
                  </div>
                  <div className="zone-actions">
                    <button
                      className="action-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        openEditModal(zone);
                      }}
                      title="Edit"
                    >
                      ✏️
                    </button>
                    <button
                      className="action-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        openDeleteModal(zone);
                      }}
                      title="Delete"
                      style={{ background: "#FF3B3020", color: "#FF3B30" }}
                    >
                      🗑️
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
                        <button
                          className="btn btn-small"
                          onClick={() => openEditModal(selectedZone)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-small"
                          onClick={() => openDeleteModal(selectedZone)}
                        >
                          Delete
                        </button>
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
                setSelectedZone(null);
              }}
            >
              🏛️
            </button>
          </div>

          {/* Recent Incidents */}
          <div className="incidents-panel">
            <div className="panel-header">
              <h4>Recent Incidents ({filteredIncidents.length})</h4>
              <button className="view-all-btn">View All →</button>
            </div>
            <div className="incidents-list">
              {filteredIncidents.map((incident) => (
                <div key={incident.id} className="incident-item">
                  <div
                    className="incident-icon"
                    style={{
                      background:
                        getIncidentStatusColor(incident.status) + "20",
                      color: getIncidentStatusColor(incident.status),
                    }}
                  >
                    ⚠️
                  </div>
                  <div className="incident-content">
                    <div className="incident-header">
                      <h5>{incident.title}</h5>
                      <span
                        className="incident-status"
                        style={{
                          background:
                            getIncidentStatusColor(incident.status) + "20",
                          color: getIncidentStatusColor(incident.status),
                        }}
                      >
                        {incident.status}
                      </span>
                    </div>
                    <p className="incident-description">
                      {incident.description}
                    </p>
                    <div className="incident-meta">
                      <span className="incident-type">{incident.type}</span>
                      <span className="incident-time">{incident.time}</span>
                      <span className="incident-zone">
                        📍 {getZoneName(incident.zoneId)}
                      </span>
                    </div>
                  </div>
                  <div className="incident-actions">
                    <button
                      className="delete-incident-btn"
                      onClick={() => openIncidentDeleteModal(incident)}
                      title="Delete Incident"
                    >
                      🗑️
                    </button>
                  </div>
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
                  type="button"
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
            <label>Location *</label>
            <div className="location-selector">
              <div className="location-info">
                <span>Lat: {newZone.location.lat.toFixed(6)}</span>
                <span>Lng: {newZone.location.lng.toFixed(6)}</span>
              </div>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setShowMapModal(true)}
              >
                📍 Select on Map
              </button>
            </div>
            <small className="hint">
              Click the button to select location on map
            </small>
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
              disabled={!newZone.name.trim() || !newZone.description.trim()}
            >
              Create Zone
            </button>
          </div>
        </div>
      </Modal>

      {/* EDIT ZONE MODAL */}
      <Modal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setEditZone(null);
        }}
        title="Edit Danger Zone"
        size="large"
      >
        {editZone && (
          <div className="modal-form">
            <div className="form-group">
              <label>Zone Name *</label>
              <input
                type="text"
                value={editZone.name}
                onChange={(e) =>
                  setEditZone({ ...editZone, name: e.target.value })
                }
                placeholder="Enter zone name"
              />
            </div>

            <div className="form-group">
              <label>Severity Level *</label>
              <div className="severity-options">
                {["low", "medium", "high"].map((level) => (
                  <button
                    key={level}
                    type="button"
                    className={`severity-option ${
                      editZone.severity === level ? "selected" : ""
                    }`}
                    onClick={() =>
                      setEditZone({ ...editZone, severity: level })
                    }
                    style={{
                      background:
                        editZone.severity === level
                          ? getSeverityColor(level)
                          : getSeverityColor(level) + "20",
                      color:
                        editZone.severity === level
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
                  value={editZone.radius}
                  onChange={(e) =>
                    setEditZone({
                      ...editZone,
                      radius: parseInt(e.target.value),
                    })
                  }
                />
                <div className="range-value">{editZone.radius}m</div>
              </div>
              <div className="form-group">
                <label>Status *</label>
                <select
                  value={editZone.status}
                  onChange={(e) =>
                    setEditZone({ ...editZone, status: e.target.value })
                  }
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="under_review">Under Review</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Location *</label>
              <div className="location-selector">
                <div className="location-info">
                  <span>Lat: {editZone.location.lat.toFixed(6)}</span>
                  <span>Lng: {editZone.location.lng.toFixed(6)}</span>
                </div>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowMapModal(true)}
                >
                  📍 Change Location
                </button>
              </div>
              <small className="hint">
                Click the button to change location on map
              </small>
            </div>

            <div className="form-group">
              <label>Description *</label>
              <textarea
                value={editZone.description}
                onChange={(e) =>
                  setEditZone({ ...editZone, description: e.target.value })
                }
                placeholder="Describe why this area is dangerous..."
                rows="4"
              />
            </div>

            <div className="form-group">
              <label>Incident Types</label>
              <div className="type-tags">
                {[
                  "theft",
                  "assault",
                  "harassment",
                  "vandalism",
                  "suspicious",
                ].map((type) => (
                  <button
                    key={type}
                    type="button"
                    className={`type-tag ${
                      editZone.types?.includes(type) ? "selected" : ""
                    }`}
                    onClick={() => {
                      const newTypes = editZone.types?.includes(type)
                        ? editZone.types.filter((t) => t !== type)
                        : [...(editZone.types || []), type];
                      setEditZone({ ...editZone, types: newTypes });
                    }}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <div className="modal-actions">
              <button
                className="btn btn-secondary"
                onClick={() => {
                  setShowEditModal(false);
                  setEditZone(null);
                }}
              >
                Cancel
              </button>
              <button
                className="btn btn-primary"
                onClick={handleEditZone}
                disabled={!editZone.name.trim() || !editZone.description.trim()}
              >
                Save Changes
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* DELETE ZONE CONFIRMATION MODAL */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setZoneToDelete(null);
        }}
        title="Confirm Delete"
        size="small"
      >
        {zoneToDelete && (
          <div className="delete-confirmation">
            <div className="warning-icon">⚠️</div>
            <h4>Delete Danger Zone</h4>
            <p>
              Are you sure you want to delete{" "}
              <strong>{zoneToDelete.name}</strong>?
            </p>
            <p className="warning-text">
              This action cannot be undone. All data related to this zone will
              be removed.
            </p>
            <div className="modal-actions">
              <button
                className="btn btn-secondary"
                onClick={() => {
                  setShowDeleteModal(false);
                  setZoneToDelete(null);
                }}
              >
                Cancel
              </button>
              <button className="btn btn-danger" onClick={handleDeleteZone}>
                Delete Zone
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* DELETE INCIDENT CONFIRMATION MODAL */}
      <Modal
        isOpen={showIncidentDeleteModal}
        onClose={() => {
          setShowIncidentDeleteModal(false);
          setIncidentToDelete(null);
        }}
        title="Confirm Delete"
        size="small"
      >
        {incidentToDelete && (
          <div className="delete-confirmation">
            <div className="warning-icon">⚠️</div>
            <h4>Delete Incident Report</h4>
            <p>
              Are you sure you want to delete{" "}
              <strong>{incidentToDelete.title}</strong>?
            </p>
            <p className="warning-text">This action cannot be undone.</p>
            <div className="modal-actions">
              <button
                className="btn btn-secondary"
                onClick={() => {
                  setShowIncidentDeleteModal(false);
                  setIncidentToDelete(null);
                }}
              >
                Cancel
              </button>
              <button className="btn btn-danger" onClick={handleDeleteIncident}>
                Delete Incident
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* MAP SELECTION MODAL */}
      <Modal
        isOpen={showMapModal}
        onClose={() => setShowMapModal(false)}
        title="Select Location on Map"
        size="large"
      >
        <div className="map-selection-modal">
          <div className="map-instructions">
            <p>
              Click on the map to select a location. The selected coordinates
              will be used for the danger zone.
            </p>
            <div className="selected-coordinates">
              <strong>Selected Location:</strong>
              <span>
                Lat:{" "}
                {(showCreateModal
                  ? newZone.location.lat
                  : editZone?.location.lat || 0
                ).toFixed(6)}
              </span>
              <span>
                Lng:{" "}
                {(showCreateModal
                  ? newZone.location.lng
                  : editZone?.location.lng || 0
                ).toFixed(6)}
              </span>
            </div>
          </div>

          <div className="map-container-small">
            {isLoaded ? (
              <GoogleMap
                mapContainerStyle={{ width: "100%", height: "400px" }}
                center={
                  showCreateModal
                    ? newZone.location
                    : editZone?.location || mapCenter
                }
                zoom={17}
                options={{
                  streetViewControl: false,
                  mapTypeControl: true,
                  fullscreenControl: false,
                }}
                onClick={handleMapClick}
              >
                {/* Marker for selected location */}
                <Marker
                  position={
                    showCreateModal
                      ? newZone.location
                      : editZone?.location || mapCenter
                  }
                  icon={{
                    path: window.google.maps.SymbolPath.CIRCLE,
                    fillColor: "#FF3B30",
                    fillOpacity: 1,
                    strokeColor: "#FFFFFF",
                    strokeWeight: 2,
                    scale: 8,
                  }}
                />
              </GoogleMap>
            ) : (
              <div className="map-loading">Loading map...</div>
            )}
          </div>

          <div className="modal-actions">
            <button
              className="btn btn-secondary"
              onClick={() => setShowMapModal(false)}
            >
              Cancel
            </button>
            <button
              className="btn btn-primary"
              onClick={() => setShowMapModal(false)}
            >
              Use This Location
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default DangerZonesPage;
