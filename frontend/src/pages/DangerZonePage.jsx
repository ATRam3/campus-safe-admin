import React, { useState, useMemo, useEffect } from "react";
import "../css/DangerZonePage.css";
import api from "../services/api";
import DangerZoneHeader from "../component/dangerZones/DangerZoneHeader";
import DangerZoneStats from "../component/dangerZones/DangerZoneStats";
import DangerZoneFilters from "../component/dangerZones/DangerZoneFilters";
import DangerZoneList from "../component/dangerZones/DangerZoneList";
import DangerZoneMap from "../component/dangerZones/DangerZoneMap";
import CreateZoneModal from "../component/dangerZones/CreateZoneModal";
import MapSelectionModal from "../component/dangerZones/MapSelectionModal";
import DeleteConfirmationModal from "../component/shared/DeleteConfirmationModal";

// Import only needed icons
import {
  AlertOctagon,
  AlertTriangle,
  AlertCircle,
} from "lucide-react";

const DangerZonePage = () => {
  // State Management
  const [zones, setZones] = useState([]);
  const [filterSeverity, setFilterSeverity] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedZone, setSelectedZone] = useState(null);
  const [mapZoom, setMapZoom] = useState(16)
  const [mapCenter, setMapCenter] = useState({ lat: 8.8913, lng: 38.8089 });
  const [loading, setLoading] = useState(false);

  // Modal States
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showMapModal, setShowMapModal] = useState(false);
  const [zoneToDelete, setZoneToDelete] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState({
    lat: 8.8913,
    lng: 38.8089,
  });

  // Error state
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

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

  // Precompute severity counts from zones
  const severityCounts = useMemo(() => {
    const counts = { high: 0, medium: 0, low: 0 };
    zones.forEach((z) => {
      if (z && z.severity) counts[z.severity] = (counts[z.severity] || 0) + 1;
    });
    return counts;
  }, [zones]);

  // Filtered zones
  const filteredZones = useMemo(() => {
    return zones.filter((zone) => {
      const matchesSeverity =
        filterSeverity === "all" || zone.severity === filterSeverity;
      const matchesSearch =
        searchQuery === "" ||
        (zone.zoneName && zone.zoneName.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (zone.name && zone.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (zone.description && zone.description.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesSeverity && matchesSearch;
    });
  }, [zones, filterSeverity, searchQuery]);

  // Helper functions
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

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case "high":
        return <AlertOctagon className="severity-icon" size={16} />;
      case "medium":
        return <AlertTriangle className="severity-icon" size={16} />;
      case "low":
        return <AlertCircle className="severity-icon" size={16} />;
      default:
        return null;
    }
  };

  // Convert coordinates to Google Maps format
  const toGoogleCoords = (coords) => {
    if (!coords) return { lat: 8.8913, lng: 38.8089 };

    // Handle both GeoJSON [lng, lat] and Google {lat, lng} formats
    if (Array.isArray(coords)) {
      return {
        lat: coords[1] || 8.8913, // lat is second in GeoJSON
        lng: coords[0] || 38.8089 // lng is first in GeoJSON
      };
    }

    return coords;
  };

  // Show success message
  const showSuccess = (message) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(null), 5000);
  };

  // Handle zone creation
  const handleCreateZoneSubmit = async (formValues, { setSubmitting, resetForm }) => {
    try {
      setLoading(true);

      const payload = {
        zoneName: formValues.name.trim(),
        severity: formValues.severity,
        description: formValues.description.trim(),
        radius: formValues.radius,
        status: formValues.status,
        location: {
          type: "Point",
          coordinates: [formValues.location.lng, formValues.location.lat] // GeoJSON: [lng, lat]
        }
      };

      console.log("Creating zone with payload:", payload);

      const response = await api.post("/dangerArea", payload);

      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to create zone");
      }

      const newZone = response.data.data;
      setZones(prev => [newZone, ...prev]);
      setSelectedZone(newZone);
      setShowCreateModal(false);

      // Reset form
      resetForm();
      setSelectedLocation({ lat: 8.8913, lng: 38.8089 });

      showSuccess("Danger zone created successfully!");
    } catch (error) {
      console.error("Error creating danger zone:", error);
      const errorMsg = error.response?.data?.message || error.message || "Failed to create zone";
      setError(`Failed to create zone: ${errorMsg}`);
    } finally {
      setLoading(false);
      setSubmitting(false);
    }
  };

  // Handle zone deletion
  const handleDeleteZone = async () => {
    if (!zoneToDelete) return;

    try {
      setLoading(true);
      const response = await api.delete(`/dangerArea/${zoneToDelete._id}`);

      if (response.data.success) {
        setZones(prev => prev.filter(zone => zone._id !== zoneToDelete._id));
        showSuccess("Danger zone deleted successfully!");

        if (selectedZone?._id === zoneToDelete._id) {
          setSelectedZone(null);
        }
      } else {
        throw new Error(response.data.message || "Delete failed");
      }
    } catch (error) {
      console.error("Error deleting danger zone:", error);
      const errorMsg = error.response?.data?.message || error.message || "Failed to delete zone";
      setError(`Failed to delete zone: ${errorMsg}`);
    } finally {
      setLoading(false);
      setShowDeleteModal(false);
      setZoneToDelete(null);
    }
  };

  // Handle map click for location selection
  const handleMapClick = (e) => {
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();

    setSelectedLocation({ lat, lng });
  };

  // Initialize delete confirmation
  const openDeleteModal = (zone, e) => {
    if (e) e.stopPropagation();
    setZoneToDelete(zone);
    setShowDeleteModal(true);
  };

  const handleZoneSelect = (zone) => {
    setSelectedZone(zone);
    if (zone.location?.coordinates) {
      const coords = toGoogleCoords(zone.location.coordinates);
      setMapCenter(coords);
    }
    setMapZoom(17);
  };

  const handleResetMap = () => {
    setMapCenter({ lat: 8.8913, lng: 38.8089 });
    setMapZoom(16);
    setSelectedZone(null);
  };

  return (
    <div className="danger-zones-page">
      <DangerZoneHeader onCreateZone={() => setShowCreateModal(true)} />

      {/* Success Message */}
      {successMessage && (
        <div className="notify notify-success">
          <span className="notify-icon">✅</span>
          <span>{successMessage}</span>
          <button className="notify-close" onClick={() => setSuccessMessage(null)}>×</button>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="notify notify-error">
          <span className="notify-icon">⚠️</span>
          <span>{error}</span>
          <button className="notify-close" onClick={() => setError(null)}>×</button>
        </div>
      )}

      <div className="content-grid">
        <div className="left-panel">
          <DangerZoneStats
            zones={zones}
            severityCounts={severityCounts}
            getSeverityColor={getSeverityColor}
          />

          <DangerZoneFilters
            filterSeverity={filterSeverity}
            searchQuery={searchQuery}
            onFilterChange={setFilterSeverity}
            onSearchChange={setSearchQuery}
          />

          <DangerZoneList
            zones={filteredZones}
            selectedZone={selectedZone}
            onZoneSelect={handleZoneSelect}
            onDeleteZone={openDeleteModal}
            getSeverityColor={getSeverityColor}
            getSeverityIcon={getSeverityIcon}
          />
        </div>

        <div className="right-panel">
          <DangerZoneMap
            zones={zones}
            selectedZone={selectedZone}
            mapCenter={mapCenter}
            mapZoom={mapZoom}
            setMapZoom={setMapZoom}
            handleResetMap={handleResetMap}
            onZoneSelect={setSelectedZone}
            onMapCenterChange={setMapCenter}
            toGoogleCoords={toGoogleCoords}
            getSeverityColor={getSeverityColor}
            getSeverityIcon={getSeverityIcon}
          />
        </div>
      </div>

      <CreateZoneModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        selectedLocation={selectedLocation}
        onShowMapModal={() => setShowMapModal(true)}
        onSubmit={handleCreateZoneSubmit}
        loading={loading}
        getSeverityColor={getSeverityColor}
      />

      <MapSelectionModal
        isOpen={showMapModal}
        onClose={() => setShowMapModal(false)}
        selectedLocation={selectedLocation}
        onMapClick={handleMapClick}
      />

      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        item={zoneToDelete}
        type="zone"
        onConfirm={handleDeleteZone}
        onClose={() => {
          setShowDeleteModal(false);
          setZoneToDelete(null);
        }}
        loading={loading}
      />
    </div>
  );
};

export default DangerZonePage;