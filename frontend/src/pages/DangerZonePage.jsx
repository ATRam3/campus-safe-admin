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
import { Formik, Form, Field, ErrorMessage } from "formik";
import { ZoneValidationSchema } from "../validation/ZoneSchema";

// Import only needed icons
import {
  MapPin,
  AlertTriangle,
  Bell,
  CheckCircle,
  Search,
  Trash2,
  Home,
  Plus,
  Minus,
  Map,
  X,
  ShieldAlert,
  Users,
  User,
  FileText,
  Flag,
  Loader2,
  AlertOctagon,
  AlertCircle,
  Check,
  ChevronRight,
  BarChart3,
  Radio,
  Type,
  Navigation,
  Filter,
} from "lucide-react";

const DangerZonePage = () => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "AIzaSyDGOfKLp0FxNKr6BxKHlJPKDcBWji1uGWI",
    libraries: ["places"],
  });

  // State Management
  const [zones, setZones] = useState([]);
  const [incidents, setIncidents] = useState([]);
  // Card configuration fetched from DB (optional). If absent, defaults are used.
  const [cardConfig, setCardConfig] = useState(null);
  const [filterSeverity, setFilterSeverity] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedZone, setSelectedZone] = useState(null);
  const [mapCenter, setMapCenter] = useState({ lat: 8.8913, lng: 38.8089 });
  const [mapZoom, setMapZoom] = useState(16);
  const [showIncidentDetails, setShowIncidentDetails] = useState(false);
  const [selectedIncidentDetails, setSelectedIncidentDetails] = useState(null);

  // Modal States
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showMapModal, setShowMapModal] = useState(false);
  const [zoneToDelete, setZoneToDelete] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState({ lat: 8.8913, lng: 38.8089 });

  // Error state
  const [error, setError] = useState(null);

  // Fetch zones on mount
  useEffect(() => {
    const fetchZones = async () => {
      try {
        const response = await api.get("/dangerArea");
        setZones(response.data.data || []);
        console.log("Fetched zones:", response.data.data);
      } catch (error) {
        setError("Failed to load danger zones.");
        console.error("Error fetching danger zones:", error);
      }
    };

    fetchZones();
  }, []);

  // Fetch incidents on mount
  useEffect(() => {
    const fetchIncidents = async () => {
      try {
        const response = await api.get("/report");
        // Ensure we always set an array
        const data = response?.data?.data;
        setIncidents(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching incidents:", error);
      }
    };
    
    fetchIncidents();
  }, []);

  // Optional: fetch card config from backend so icons/labels can be edited in DB
  useEffect(() => {
    const fetchCardConfig = async () => {
      try {
        const res = await api.get("/settings/dangerCards"); // endpoint optional; return format: { severities: [{ key:'high', label:'High Risk', icon:'AlertOctagon', color:'#FF3B30' }, ...] }
        setCardConfig(res?.data?.data || null);
      } catch (err) {
        // If endpoint doesn't exist, fallback to defaults silently
        setCardConfig(null);
      }
    };
    fetchCardConfig();
  }, []);

  // Precompute severity counts from zones
  const severityCounts = useMemo(() => {
    const counts = { high: 0, medium: 0, low: 0 };
    zones.forEach((z) => {
      if (z && z.severity) counts[z.severity] = (counts[z.severity] || 0) + 1;
    });
    return counts;
  }, [zones]);

  // Map icon name (from DB) to actual component
  const iconMap = {
    AlertOctagon,
    AlertTriangle,
    AlertCircle,
    MapPin,
    Bell,
    CheckCircle,
  };

  // Filtered zones
  const filteredZones = useMemo(() => {
    return zones.filter((zone) => {
      const matchesSeverity = filterSeverity === "all" || zone.severity === filterSeverity;
      const matchesSearch = searchQuery === "" ||
        zone.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        zone.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSeverity && matchesSearch;
    });
  }, [zones, filterSeverity, searchQuery]);

  // Helper functions
  const getSeverityColor = (severity) => {
    switch (severity) {
      case "high": return "#FF3B30";
      case "medium": return "#FF9500";
      case "low": return "#34C759";
      default: return "#8E8E93";
    }
  };

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case "high": return <AlertOctagon className="severity-icon" size={16} />;
      case "medium": return <AlertTriangle className="severity-icon" size={16} />;
      case "low": return <AlertCircle className="severity-icon" size={16} />;
      default: return null;
    }
  };

  // Handle zone creation with Formik
  const handleCreateZoneSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      
      // Format data for API
      const zoneData = {
        name: values.name,
        severity: values.severity,
        description: values.description,
        status: values.status,
        radius: values.radius,
        location: {
          coordinates: [values.location.lng, values.location.lat],
          type: "Point"
        }
      };
      
      console.log("Creating zone:", zoneData);
      
      const response = await api.post("/dangerArea", zoneData);

      const createdZone = response.data.data;
      setZones(prev => [...prev, createdZone]);
      setShowCreateModal(false);
      resetForm();
      setSelectedLocation({ lat: 8.8913, lng: 38.8089 });
      
    } catch (error) {
      console.error("Error creating danger zone:", error);
      alert(`Failed to create zone: ${error.response?.data?.message || error.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  // Handle zone deletion
  const handleDeleteZone = async () => {
    if (!zoneToDelete) return;
    
    try {
      const response = await api.delete(`/dangerArea/${zoneToDelete._id}`);
      
      if (response.data.success) {
        setZones(zones.filter((zone) => zone._id !== zoneToDelete._id));
      } else {
        throw new Error(response.data.message || "Delete failed");
      }
      
      setShowDeleteModal(false);
      setZoneToDelete(null);
      setSelectedZone(null);
    } catch (error) {
      console.error("Error deleting danger zone:", error);
      alert("Failed to delete: " + (error.response?.data?.message || error.message));
    }
  };

  // Handle map click for location selection
  const handleMapClick = (e) => {
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();
    setSelectedLocation({ lat, lng });
  };

  // Initialize delete confirmation
  const openDeleteModal = (zone) => {
    setZoneToDelete(zone);
    setShowDeleteModal(true);
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
            {/* Total zones - always shown */}
            <div className="stat-card">
              <div className="stat-icon">
                <MapPin size={20} />
              </div>
              <div className="stat-content">
                <h3>{zones.length}</h3>
                <p>Total Zones</p>
              </div>
            </div>

            {/* Severity cards: read config from DB if available, otherwise use defaults */}
            {(cardConfig?.severities || [
              { key: "high", label: "High Risk", icon: "AlertOctagon", color: "#FF3B30" },
              { key: "medium", label: "Medium Risk", icon: "AlertTriangle", color: "#FF9500" },
              { key: "low", label: "Low Risk", icon: "AlertCircle", color: "#34C759" },
            ]).map((cfg) => {
              const IconComp = iconMap[cfg.icon] || AlertCircle;
              const count = severityCounts[cfg.key] || 0;
              return (
                <div key={cfg.key} className="stat-card">
                  <div className="stat-icon" style={{ background: (cfg.color || getSeverityColor(cfg.key)) + "20" }}>
                    <IconComp size={20} />
                  </div>
                  <div className="stat-content">
                    <h3>{count}</h3>
                    <p>{cfg.label}</p>
                  </div>
                </div>
              );
            })}

            {/* Incidents and resolved */}
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
                <h3>{incidents?.filter((i) => i.status === "resolved").length || 0}</h3>
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
                  className={`filter-chip ${filterSeverity === "all" ? "active" : ""}`}
                  onClick={() => setFilterSeverity("all")}
                >
                  All Zones
                </button>
                <button
                  className={`filter-chip ${filterSeverity === "high" ? "active" : ""}`}
                  onClick={() => setFilterSeverity("high")}
                  style={{ background: "#FF3B3020", color: "#FF3B30" }}
                >
                  <AlertOctagon size={14} />
                  High Risk
                </button>
                <button
                  className={`filter-chip ${filterSeverity === "medium" ? "active" : ""}`}
                  onClick={() => setFilterSeverity("medium")}
                  style={{ background: "#FF950020", color: "#FF9500" }}
                >
                  <AlertTriangle size={14} />
                  Medium Risk
                </button>
                <button
                  className={`filter-chip ${filterSeverity === "low" ? "active" : ""}`}
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
            </div>
            <div className="zone-list">
              {filteredZones.map((zone) => (
                <div
                  key={zone._id}
                  className={`zone-item ${selectedZone?._id === zone._id ? "selected" : ""}`}
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
                      <h5 style={{ color: "black" }}>{zone.name}</h5>
                      <span className="zone-status">{zone.status}</span>
                    </div>
                    <p className="zone-description">{zone.description}</p>
                    <div className="zone-footer">
                      <span>
                        <AlertTriangle size={12} /> {zone.incidents || 0} incidents
                      </span>
                      <span>
                        <Navigation size={12} /> {zone.radius}m radius
                      </span>
                      <span>
                        <MapPin size={12} />
                        {zone?.location?.coordinates[1]?.toFixed(4) || "N/A"},{" "}
                        {zone?.location?.coordinates[0]?.toFixed(4) || "N/A"}
                      </span>
                    </div>
                  </div>
                  <div className="zone-actions">
                    <button
                      className="action-btn delete"
                      onClick={(e) => {
                        e.stopPropagation();
                        openDeleteModal(zone);
                      }}
                      title="Delete"
                      aria-label="Delete zone"
                    >
                      <Trash2 size={30} />
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
                    key={zone._id}
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
                      setMapCenter({
                        lat: zone.location.coordinates[1],
                        lng: zone.location.coordinates[0],
                      });
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
                          <BarChart3 size={12} /> {selectedZone.incidents || 0}{" "}
                          incidents
                        </span>
                        <span>
                          <Radio size={12} /> {selectedZone.radius}m
                        </span>
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
        </div>
      </div>

      {/* CREATE ZONE MODAL WITH FORMIK */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create New Danger Zone"
        size="large"
      >
        <Formik
          initialValues={{
            name: "",
            severity: "medium",
            status: "active",
            description: "",
            radius: 100,
            location: selectedLocation,
          }}
          validationSchema={ZoneValidationSchema}
          onSubmit={handleCreateZoneSubmit}
          enableReinitialize
        >
          {({ values, setFieldValue, isSubmitting, errors, touched }) => (
            <Form className="modal-form">
              {/* Zone Name */}
              <div className="form-group">
                <label>
                  <Type size={16} />
                  Zone Name *
                </label>
                <Field
                  type="text"
                  name="name"
                  placeholder="Enter zone name"
                  className={errors.name && touched.name ? 'error-field' : ''}
                />
                <ErrorMessage name="name" component="div" className="error-message" />
              </div>

              {/* Severity Level */}
              <div className="form-group">
                <label>Severity Level *</label>
                <div className="severity-options" role="group">
                  {["low", "medium", "high"].map((level) => (
                    <button
                      key={level}
                      type="button"
                      className={`severity-option ${values.severity === level ? "selected" : ""}`}
                      onClick={() => setFieldValue("severity", level)}
                      style={{
                        background: values.severity === level
                          ? getSeverityColor(level)
                          : getSeverityColor(level) + "20",
                        color: values.severity === level
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
                <ErrorMessage name="severity" component="div" className="error-message" />
              </div>

              {/* Status */}
              <div className="form-row">
                <div className="form-group">
                  <label>
                    <Flag size={16} />
                    Status *
                  </label>
                  <Field as="select" name="status">
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="under_review">Under Review</option>
                  </Field>
                  <ErrorMessage name="status" component="div" className="error-message" />
                </div>
              </div>

              {/* Radius */}
              <div className="form-group">
                <label>
                  <Radio size={16} />
                  Radius (meters) *
                </label>
                <Field
                  type="number"
                  name="radius"
                  min="10"
                  max="1000"
                  className={errors.radius && touched.radius ? 'error-field' : ''}
                />
                <ErrorMessage name="radius" component="div" className="error-message" />
              </div>

              {/* Location */}
              <div className="form-group">
                <label>
                  <MapPin size={16} />
                  Location *
                </label>
                <div className="location-selector">
                  <div className="location-info">
                    <span>Lat: {selectedLocation.lat.toFixed(6)}</span>
                    <span>Lng: {selectedLocation.lng.toFixed(6)}</span>
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
                <ErrorMessage name="location" component="div" className="error-message" />
              </div>

              {/* Description */}
              <div className="form-group">
                <label>
                  <FileText size={16} />
                  Description *
                </label>
                <Field
                  as="textarea"
                  name="description"
                  placeholder="Describe why this area is dangerous..."
                  rows="4"
                  className={errors.description && touched.description ? 'error-field' : ''}
                />
                <ErrorMessage name="description" component="div" className="error-message" />
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowCreateModal(false)}
                >
                  <X size={16} />
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={isSubmitting}
                >
                  <Check size={16} />
                  {isSubmitting ? "Creating..." : "Create Zone"}
                </button>
              </div>
            </Form>
          )}
        </Formik>
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
            <p>Click on the map to select a location for the danger zone.</p>
            <div className="selected-coordinates">
              <strong>Selected Location:</strong>
              <span>Lat: {selectedLocation.lat.toFixed(6)}</span>
              <span>Lng: {selectedLocation.lng.toFixed(6)}</span>
            </div>
          </div>

          <div className="map-container-small">
            {isLoaded ? (
              <GoogleMap
                mapContainerStyle={{ width: "100%", height: "400px" }}
                center={selectedLocation}
                zoom={17}
                options={{
                  streetViewControl: false,
                  mapTypeControl: true,
                  fullscreenControl: false,
                }}
                onClick={handleMapClick}
              >
                <Marker
                  position={selectedLocation}
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
              onClick={() => {
                // Formik initialValues uses selectedLocation and enableReinitialize is on,
                // so just close the modal — Formik will pick up the updated selectedLocation.
                setShowMapModal(false);
              }}
            >
              <Check size={16} />
              Use This Location
            </button>
          </div>
        </div>
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
                <Trash2 size={16} />
                Delete Zone
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default DangerZonePage;