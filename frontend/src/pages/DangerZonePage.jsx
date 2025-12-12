import React, { useState, useMemo, useEffect } from "react";
import {
  GoogleMap,
  Marker,
  InfoWindow,
  useLoadScript,
} from "@react-google-maps/api";
import "../css/DangerZonePage.css";
import Modal from "../component/Modal";
import api from "../services/api";

// Import Lucide Icons
import {
  MapPin,
  AlertTriangle,
  Bell,
  CheckCircle,
  Search,
  Edit2,
  Trash2,
  Home,
  Plus,
  Minus,
  Map,
  X,
  ShieldAlert,
  Users,
  Eye,
  Link,
  Filter,
  Calendar,
  Clock,
  Navigation,
  AlertCircle,
  Check,
  ChevronRight,
  BarChart3,
  Radio,
  Type,
  Loader2,
  AlertOctagon,
  Skull,
  Flame,
  User,
  FileText,
  Tag,
  Flag,
  Circle,
  Square,
} from "lucide-react";

// Sample data
/* const initialZones = [
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
*/
// Sample incidents data
const initialIncidents = [
  {
    id: 1,
    title: "Phone stolen near parking",
    type: "theft",
    time: "2h ago",
    status: "unresolved",
    description: "Student reported phone theft while walking to car...",
    proofImages: ["image1.jpg", "image2.jpg"],
    location: { lat: 8.8925, lng: 38.808 },
    reportCount: 5,
    reportedBy: "Bini",
    reportedAt: "2024-01-22 14:30",
    severity: "high",
    zone: "Main Parking Lot",
    actionsTaken: "Security notified, investigation in progress",
  },
  {
    id: 2,
    title: "Fight reported at cafeteria",
    type: "assault",
    time: "5h ago",
    status: "resolved",
    description:
      "Student reported a physical altercation between two students...",
    proofImages: ["image2.jpg"],
    location: { lat: 8.8925, lng: 38.808 },
    reportCount: 10,
    reportedBy: "Amen",
    reportedAt: "2024-01-22 11:45",
    severity: "low",
    Zone: "LT",
    actionsTaken: "Security notified, investigation in progress",
  },
];

const DangerZonesPage = () => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "AIzaSyDGOfKLp0FxNKr6BxKHlJPKDcBWji1uGWI",
    libraries: ["places"],
  });

  // State Management
  const [zones, setZones] = useState([]);
  const [incidents, setIncidents] = useState(initialIncidents);
  const [filterSeverity, setFilterSeverity] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedZone, setSelectedZone] = useState(null);
  const [mapCenter, setMapCenter] = useState({ lat: 8.8913, lng: 38.8089 });
  const [mapZoom, setMapZoom] = useState(16); // Add these to your existing useState section
  const [showIncidentDetails, setShowIncidentDetails] = useState(false);
  const [selectedIncidentDetails, setSelectedIncidentDetails] = useState(null);

  // Modal States
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showMapModal, setShowMapModal] = useState(false);
  const [showIncidentDeleteModal, setShowIncidentDeleteModal] = useState(false);
  const [zoneToDelete, setZoneToDelete] = useState(null);
  const [incidentToDelete, setIncidentToDelete] = useState(null);

  // Error state
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchZones = async () => {
      try {
        // Fetch zones from API
        const response = await api.get("/dangerArea");
        console.log("zones", response.data.data);

        setZones(response.data.data);
      } catch (error) {
        setError("Failed to load danger zones.");
        console.error("Error fetching danger zones:", error);
      }
    };

    fetchZones();
  }, []);

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

  // Get severity icon
  const getSeverityIcon = (severity) => {
    switch (severity) {
      case "high":
        return <AlertOctagon className="severity-icon" size={16} />;
      case "medium":
        return <AlertTriangle className="severity-icon" size={16} />;
      case "low":
        return <AlertCircle className="severity-icon" size={16} />;
      default:
        return <Circle className="severity-icon" size={16} />;
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

  // Get incident type icon
  const getIncidentTypeIcon = (type) => {
    switch (type) {
      case "theft":
        return <ShieldAlert size={14} />;
      case "assault":
        return <Users size={14} />;
      case "harassment":
        return <User size={14} />;
      case "vandalism":
        return <FileText size={14} />;
      case "suspicious":
        return <Eye size={14} />;
      default:
        return <Flag size={14} />;
    }
  };

  // Handle zone creation
  const handleCreateZone = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const response = await api.post("/dangerArea", newZone, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const createdZone = response.data.data;
      setZones([...zones, createdZone]);
      setShowCreateModal(false);
      // Reset new zone form
      setNewZone({
        name: "",
        severity: "medium",
        description: "",
        radius: 100,
        status: "active",
        types: [],
        location: { lat: 8.8913, lng: 38.8089 },
      });
    } catch (error) {
      console.error("Error creating danger zone:", error);
    }
  };

  // Handle zone edit
  const handleEditZone = async () => {
    if (!editZone) return;
    try {
      const response = await api.put(`/dangerArea/${editZone.id}`, editZone);
      const updatedZone = response.data.data;

      setZones(
        zones.map((zone) =>
          zone.id === editZone.id
            ? {
                ...updatedZone,
                updatedAt: new Date().toISOString().split("T")[0],
              }
            : zone
        )
      );
      setShowEditModal(false);
      setEditZone(null);
    } catch (error) {
      console.error("Error updating danger zone:", error);
    }
  };

  // Handle zone deletion
  const handleDeleteZone = () => {

    if (!zoneToDelete) return;

    try{ 
      const response = api.delete(`/dangerArea/${zoneToDelete.id}`);
      setZones(zones.filter((zone) => zone.id !== zoneToDelete.id));  
      setShowDeleteModal(false);
      setZoneToDelete(null);
    } catch (error){      
      console.error("Error deleting danger zone:", error);
    }

    
  };

  // Handle incident deletion
  const handleDeleteIncident = () => {
    if (!incidentToDelete) return;

    const response = api.delete(`/incidents/${incidentToDelete.id}`);
    setIncidents()

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
    setEditZone({
      ...zone,
      location: {
        lat: zone.location.coordinates[1],
        lng: zone.location.coordinates[0],
      },
    });
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
            <Plus className="icon" size={18} />
            Create Danger Zone
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
              <div className="stat-icon">
                <MapPin size={20} />
              </div>
              <div className="stat-content">
                <h3>{zones.length}</h3>
                <p>Total Zones</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon high-risk">
                <AlertOctagon size={20} />
              </div>
              <div className="stat-content">
                <h3>{zones.filter((z) => z.severity === "high").length}</h3>
                <p>High Risk</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">
                <Bell size={20} />
              </div>
              <div className="stat-content">
                <h3>{incidents.length}</h3>
                <p>Total Incidents</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon resolved">
                <CheckCircle size={20} />
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
              <h4>
                <Filter className="icon" size={16} />
                Quick Filters
              </h4>
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
                  <AlertOctagon size={14} />
                  High Risk
                </button>
                <button
                  className={`filter-chip ${
                    filterSeverity === "medium" ? "active" : ""
                  }`}
                  onClick={() => setFilterSeverity("medium")}
                  style={{ background: "#FF950020", color: "#FF9500" }}
                >
                  <AlertTriangle size={14} />
                  Medium Risk
                </button>
                <button
                  className={`filter-chip ${
                    filterSeverity === "low" ? "active" : ""
                  }`}
                  onClick={() => setFilterSeverity("low")}
                  style={{ background: "#34C75920", color: "#34C759" }}
                >
                  <AlertCircle size={14} />
                  Low Risk
                </button>
              </div>
            </div>

            <div className="search-box">
              <Search className="search-icon" size={18} />
              <input
                type="text"
                placeholder="Search zones or incidents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
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
                    setMapCenter({
                      lat: zone.location.coordinates[1],
                      lng: zone.location.coordinates[0],
                    });
                    setMapZoom(17);
                  }}
                >
                  <div
                    className="zone-marker"
                    style={{ background: getSeverityColor(zone.severity) }}
                  >
                    {getSeverityIcon(zone.severity)}
                  </div>
                  <div className="zone-content">
                    <div className="zone-header">
                      <h5>{zone.name}</h5>
                      <span className="zone-status">{zone.status}</span>
                    </div>
                    <p className="zone-description">{zone.description}</p>
                    <div className="zone-footer">
                      <span>
                        <AlertTriangle size={12} /> {zone.incidents} incidents
                      </span>
                      <span>
                        <Navigation size={12} /> {zone.radius}m radius
                      </span>
                      <span>
                        <MapPin size={12} />{" "}
                        {zone?.location?.coordinates[1].toFixed(4)},{" "}
                        {zone?.location?.coordinates[0].toFixed(4)}
                      </span>
                    </div>
                  </div>
                  <div className="zone-actions">
                    <button
                      className="action-btn edit"
                      onClick={(e) => {
                        e.stopPropagation();
                        openEditModal(zone);
                      }}
                      title="Edit"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      className="action-btn delete"
                      onClick={(e) => {
                        e.stopPropagation();
                        openDeleteModal(zone);
                      }}
                      title="Delete"
                    >
                      <Trash2 className="icon" size={32} />
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
              <div className="map-error">
                <AlertCircle size={24} />
                <p>Failed to load map</p>
              </div>
            ) : !isLoaded ? (
              <div className="map-loading">
                <Loader2 className="loading-spinner" size={24} />
                <p>Loading map...</p>
              </div>
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
                    position={{
                      lat: zone.location.coordinates[1],
                      lng: zone.location.coordinates[0],
                    }}
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
                    position={{
                      lat: selectedZone.location.coordinates[1],
                      lng: selectedZone.location.coordinates[0],
                    }}
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
                          {getSeverityIcon(selectedZone.severity)}
                          {selectedZone.severity}
                        </span>
                        <span className="status-tag">
                          {selectedZone.status}
                        </span>
                      </div>
                      <p>{selectedZone.description}</p>
                      <div className="info-stats">
                        <span>
                          <BarChart3 size={12} /> {selectedZone.incidents}{" "}
                          incidents
                        </span>
                        <span>
                          <Radio size={12} /> {selectedZone.radius}m
                        </span>
                      </div>
                      <div className="info-actions">
                        <button
                          className="btn btn-small"
                          onClick={() => openEditModal(selectedZone)}
                        >
                          <Edit2 size={14} />
                          Edit
                        </button>
                        <button
                          className="btn btn-small"
                          onClick={() => openDeleteModal(selectedZone)}
                        >
                          <Trash2 className="icon" size={32} />
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
              <Plus size={20} />
            </button>
            <button
              className="control-btn"
              onClick={() => setMapZoom(mapZoom - 1)}
            >
              <Minus size={20} />
            </button>
            <button
              className="control-btn"
              onClick={() => {
                setMapCenter({ lat: 8.8913, lng: 38.8089 });
                setMapZoom(16);
                setSelectedZone(null);
              }}
            >
              <Home size={20} />
            </button>
          </div>

          {/* Recent Incidents */}
          <div className="incidents-panel">
            <div className="panel-header">
              <h4>Recent Incidents ({incidents.length})</h4>
              <button className="view-all-btn">
                View All
                <ChevronRight size={16} />
              </button>
            </div>
            <div className="incidents-list">
              {incidents.map((incident) => (
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
                    className="view-details-btn"
                    onClick={() => {
                      setSelectedIncidentDetails(incident);
                      setShowIncidentDetails(true);
                    }}
                  >
                    View Details
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CREATE ZONE MODAL */}

      {/* Incident Details Modal */}
      <Modal
        isOpen={showIncidentDetails}
        onClose={() => setShowIncidentDetails(false)}
        title="Incident Details"
        size="large"
      >
        {selectedIncidentDetails && (
          <div className="incident-details-modal">
            <div className="incident-details-modal">
              {/* Header with status */}
              <div className="incident-header">
                <h3>{selectedIncidentDetails.title}</h3>
                <span
                  className={`status-badge ${selectedIncidentDetails.status}`}
                >
                  {selectedIncidentDetails.status}
                </span>
              </div>

              {/* Basic Info Grid */}
              <div className="info-grid">
                <div className="info-item">
                  <span className="label">Type:</span>
                  <span className="value">{selectedIncidentDetails.type}</span>
                </div>
                <div className="info-item">
                  <span className="label">Reported By:</span>
                  <span className="value">
                    {selectedIncidentDetails.reportedBy}
                  </span>
                </div>
                <div className="info-item">
                  <span className="label">Time:</span>
                  <span className="value">{selectedIncidentDetails.time}</span>
                </div>
                <div className="info-item">
                  <span className="label">Reports:</span>
                  <span className="value">
                    {selectedIncidentDetails.reportCount} reports
                  </span>
                </div>
                <div className="info-item">
                  <span className="label">Severity:</span>
                  <span className="value">
                    {selectedIncidentDetails.severity}
                  </span>
                </div>
                <div className="info-item">
                  <span className="label">Zone:</span>
                  <span className="value">{selectedIncidentDetails.zone}</span>
                </div>
              </div>

              {/* Location */}
              <div className="location-section">
                <h4>📍 Location</h4>
                <p>Lat: {selectedIncidentDetails.location.lat.toFixed(6)}</p>
                <p>Lng: {selectedIncidentDetails.location.lng.toFixed(6)}</p>
              </div>

              {/* Description */}
              <div className="description-section">
                <h4>📝 Description</h4>
                <p>{selectedIncidentDetails.description}</p>
              </div>

              {/* Actions Taken */}
              <div className="actions-section">
                <h4>🛡️ Actions Taken</h4>
                <p>{selectedIncidentDetails.actionsTaken}</p>
              </div>

              {/* Proof Images */}
              {selectedIncidentDetails.proofImages.length > 0 && (
                <div className="images-section">
                  <h4>
                    🖼️ Proof Images (
                    {selectedIncidentDetails.proofImages.length})
                  </h4>
                  <div className="image-grid">
                    {selectedIncidentDetails.proofImages.map((img, index) => (
                      <div key={index} className="image-preview">
                        <img src={img} alt={`Proof ${index + 1}`} />
                        <button className="view-full-btn">View Full</button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create New Danger Zone"
        size="large"
      >
        <div className="modal-form">
          <div className="form-group">
            <label>
              <Type size={16} />
              Zone Name *
            </label>
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
                  {level === "high" ? (
                    <AlertOctagon size={16} />
                  ) : level === "medium" ? (
                    <AlertTriangle size={16} />
                  ) : (
                    <AlertCircle size={16} />
                  )}
                  {level.charAt(0).toUpperCase() + level.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>
                <Radio size={16} />
                Radius (meters) *
              </label>
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
              <label>
                <Flag size={16} />
                Status *
              </label>
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
            <label>
              <MapPin size={16} />
              Location *
            </label>
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
                <Map size={16} />
                Select on Map
              </button>
            </div>
            <small className="hint">
              Click the button to select location on map
            </small>
          </div>

          <div className="form-group">
            <label>
              <FileText size={16} />
              Description *
            </label>
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
              <X size={16} />
              Cancel
            </button>
            <button className="btn btn-primary" onClick={handleCreateZone}>
              <Check size={16} />
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
              <label>
                <Type size={16} />
                Zone Name *
              </label>
              <input
                type="text"
                value={editZone.zoneName}
                onChange={(e) =>
                  setEditZone({ ...editZone, zoneName: e.target.value })
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
                    {level === "high" ? (
                      <AlertOctagon size={16} />
                    ) : level === "medium" ? (
                      <AlertTriangle size={16} />
                    ) : (
                      <AlertCircle size={16} />
                    )}
                    {level.charAt(0).toUpperCase() + level.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>
                  <Flag size={16} />
                  Status *
                </label>
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
              <label>
                <MapPin size={16} />
                Location *
              </label>
              <div className="location-selector">
                <div className="location-info">
                  <span>Lat: {editZone?.location?.lat.toFixed(6)}</span>
                  <span>Lng: {editZone?.location?.lng.toFixed(6)}</span>
                </div>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowMapModal(true)}
                >
                  <Map size={16} />
                  Change Location
                </button>
              </div>
              <small className="hint">
                Click the button to change location on map
              </small>
            </div>

            <div className="form-group">
              <label>
                <FileText size={16} />
                Description *
              </label>
              <textarea
                value={editZone.types.join("\n")}
                onChange={(e) =>
                  setEditZone({
                    ...editZone,
                    types: e.target.value.split("\n"),
                  })
                }
                placeholder="Describe why this area is dangerous..."
                rows="4"
              />
            </div>

            <div className="modal-actions">
              <button
                className="btn btn-secondary"
                onClick={() => {
                  setShowEditModal(false);
                  setEditZone(null);
                }}
              >
                <X size={16} />
                Cancel
              </button>
              <button
                className="btn btn-primary"
                onClick={handleEditZone}
                disabled={
                  /* !editZone.zoneName.trim() || */ !editZone.types.map(
                    (type) => type.trim()
                  ).length
                }
              >
                <Check size={16} />
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
            <div className="warning-icon">
              <AlertTriangle size={48} />
            </div>
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
                <X size={16} />
                Cancel
              </button>
              <button className="btn btn-danger" onClick={handleDeleteZone}>
                <Trash2 className="icon" size={32} />
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
            <div className="warning-icon">
              <AlertTriangle size={48} />
            </div>
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
                <X size={16} />
                Cancel
              </button>
              <button className="btn btn-danger" onClick={handleDeleteIncident}>
                <Trash2 size={16} />
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
              <div className="map-loading">
                <Loader2 className="loading-spinner" size={24} />
                <p>Loading map...</p>
              </div>
            )}
          </div>

          <div className="modal-actions">
            <button
              className="btn btn-secondary"
              onClick={() => setShowMapModal(false)}
            >
              <X size={16} />
              Cancel
            </button>
            <button
              className="btn btn-primary"
              onClick={() => setShowMapModal(false)}
            >
              <Check size={16} />
              Use This Location
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default DangerZonesPage;
