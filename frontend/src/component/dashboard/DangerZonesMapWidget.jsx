import React, { useState } from "react";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
import { MapPin, ZoomIn, ZoomOut, Home } from "lucide-react";
import { useNavigate } from "react-router-dom"

const DangerZonesMapWidget = () => {
  const navigate = useNavigate();

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: "AIzaSyDGOfKLp0FxNKr6BxKHlJPKDcBWji1uGWI",
  });

  const [mapCenter] = useState({ lat: 8.8913, lng: 38.8089 });
  const [mapZoom, setMapZoom] = useState(16);

  const zones = [
    { lat: 8.8925, lng: 38.808, severity: "high" },
    { lat: 8.893, lng: 38.807, severity: "medium" },
    { lat: 8.891, lng: 38.809, severity: "low" },
  ];

  const getSeverityColor = (severity) => {
    switch (severity) {
      case "high": return "#FF3B30";
      case "medium": return "#FF9500";
      case "low": return "#34C759";
      default: return "#8E8E93";
    }
  };

  return (
    <div className="map-widget">
      <div className="widget-header">
        <h3>Danger Zones Map</h3>
        <button className="view-all" onClick={() => navigate("/danger-zones")}>View All</button>
      </div>

      <div className="map-container-small map-container">
        {!isLoaded ? (
          <div className="map-loading">Loading map...</div>
        ) : (
          <GoogleMap
            mapContainerStyle={{ width: "100%", height: "300px" }}
            center={mapCenter}
            zoom={mapZoom}
            options={{
              streetViewControl: false,
              mapTypeControl: false,
              fullscreenControl: false,
            }}
          >
            {zones.map((zone, index) => (
              <Marker
                key={index}
                position={zone}
                icon={{
                  path: window.google.maps.SymbolPath.CIRCLE,
                  fillColor: getSeverityColor(zone.severity),
                  fillOpacity: 0.8,
                  strokeColor: "#FFFFFF",
                  strokeWeight: 2,
                  scale: 8,
                }}
              />
            ))}
          </GoogleMap>
        )}


        <div className="map-controls">
          <button onClick={() => setMapZoom(mapZoom + 1)}>
            <ZoomIn size={16} />
          </button>
          <button onClick={() => setMapZoom(mapZoom - 1)}>
            <ZoomOut size={16} />
          </button>
          <button onClick={() => setMapZoom(16)}>
            <Home size={16} />
          </button>
        </div>
      </div>


      <div className="map-legend">
        <div className="legend-item">
          <span className="legend-dot high"></span>
          <span>High Risk</span>
        </div>
        <div className="legend-item">
          <span className="legend-dot medium"></span>
          <span>Medium Risk</span>
        </div>
        <div className="legend-item">
          <span className="legend-dot low"></span>
          <span>Low Risk</span>
        </div>
      </div>
    </div>
  );
};

export default DangerZonesMapWidget;