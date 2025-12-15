import React, { useMemo } from "react";
import {
  GoogleMap,
  Marker,
  InfoWindow,
  useLoadScript,
} from "@react-google-maps/api";
import {
  AlertCircle,
  BarChart3,
  Radio,
  Loader2,
  Plus,
  Minus,
  Home,
  TriangleAlert,
} from "lucide-react";

// Define libraries outside the component to prevent re-renders
const libraries = ["places"];

const DangerZoneMap = ({
  zones,
  selectedZone,
  mapCenter,
  mapZoom,
  setMapZoom,
  handleResetMap,
  onZoneSelect,
  onMapCenterChange,
  toGoogleCoords,
  getSeverityColor,
  getSeverityIcon,
  getMarkerIcon,
}) => {
  // Use a stable API key - ensure it's correctly configured in Google Cloud Console
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "AIzaSyDGOfKLp0FxNKr6BxKHlJPKDcBWji1uGWI",
    libraries,
  });

  // Memoize map options to prevent unnecessary re-renders
  const mapOptions = useMemo(
    () => ({
      streetViewControl: false,
      mapTypeControl: false,
      fullscreenControl: false,
      zoomControl: false,
    }),
    []
  );

  if (loadError) {
    console.error("Google Maps load error:", loadError);
    return (
      <div className="map-container">
        <div className="map-error">
          <AlertCircle size={24} />
          <p>Failed to load map. Please check your internet connection.</p>
          <small>Error: {loadError.message}</small>
        </div>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="map-container">
        <div className="map-loading">
          <Loader2 className="loading-spinner" size={24} />
          <p>Loading map...</p>
        </div>
      </div>
    );
  }

  const handleMarkerClick = (zone) => {
    onZoneSelect(zone);
    if (zone.location && zone.location.coordinates) {
      onMapCenterChange(toGoogleCoords(zone.location.coordinates));
    }
  };

  return (
    <div className="map-container">
      <GoogleMap
        mapContainerStyle={{ width: "100%", height: "70vh" }}
        center={mapCenter}
        zoom={mapZoom}
        options={mapOptions}
      >
        {/* Markers */}
        {zones.map((zone) => {
          if (!zone.location || !zone.location.coordinates) return null;

          const position = toGoogleCoords(zone.location.coordinates);
          if (!position.lat || !position.lng) return null;

          return (
            <Marker
              key={zone._id || zone.id}
              position={position}
              icon={{
                path: window.google.maps.SymbolPath.CIRCLE,
                fillColor: getSeverityColor(zone.severity),
                fillOpacity: 0.8,
                strokeColor: "#FFFFFF",
                strokeWeight: 2,
                scale: 10,
                url: "https://pngtree.com/so/location-icon", // Image URL
                scaledSize: new google.maps.Size(30, 30), // Display size
                size: new google.maps.Size(60, 60), // Original image size
                anchor: new google.maps.Point(15, 15), // Anchor point (center)
                origin: new google.maps.Point(0, 0), // Sprite sheet origin
              }}
              onClick={() => handleMarkerClick(zone)}
            />
          );
        })}

        {/* Info Window */}
        {selectedZone &&
          selectedZone.location &&
          selectedZone.location.coordinates && (
            <InfoWindow
              position={toGoogleCoords(selectedZone.location.coordinates)}
              onCloseClick={() => onZoneSelect(null)}
            >
              <div className="info-window">
                <h4>{selectedZone.name || selectedZone.zoneName}</h4>
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
                  <span className="status-tag">{selectedZone.status}</span>
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
      <div className="map-controls">
        <button
          className="control-btn"
          onClick={() => setMapZoom((prev) => prev + 1)}
        >
          <Plus size={20} />
        </button>
        <button
          className="control-btn"
          onClick={() => setMapZoom((prev) => prev - 1)}
        >
          <Minus size={20} />
        </button>
        <button className="control-btn" onClick={handleResetMap}>
          <Home size={20} />
        </button>
      </div>
    </div>
  );
};

export default DangerZoneMap;
