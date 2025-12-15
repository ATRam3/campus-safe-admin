import React, { useMemo } from "react";
import {
  GoogleMap,
  Marker,
  InfoWindow,
  useLoadScript,
} from "@react-google-maps/api";
import { AlertCircle, Loader2 } from "lucide-react";

const libraries = ["places"];

const IncidentMap = ({ incident }) => {
  const { location, tag, description, status } = incident || {};
  const coordinates = location?.coordinates;

  const toGoogleCoords = (coords) => {
    if (!coords || coords.length !== 2) return null;
    return { lat: coords[1], lng: coords[0] };
  };

  const mapCenter = useMemo(() => {
    const position = toGoogleCoords(coordinates);
    return position || { lat: 27.7172, lng: 85.324 };
  }, [coordinates]);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "resolved":
        return "#10b981"; // green
      case "rejected":
        return "#ef4444"; // red
      case "pending":
      default:
        return "#f59e0b"; // amber
    }
  };

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "AIzaSyDGOfKLp0FxNKr6BxKHlJPKDcBWji1uGWI",
    libraries,
  });

  const mapOptions = useMemo(
    () => ({
      streetViewControl: false,
      mapTypeControl: false,
      fullscreenControl: true,
      zoomControl: true,
    }),
    []
  );

  const [infoWindowOpen, setInfoWindowOpen] = React.useState(true);

  if (loadError) {
    console.error("Google Maps load error:", loadError);
    return (
      <div className="map-container">
        <div className="map-error">
          <AlertCircle size={24} />
          <p>Failed to load map.</p>
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

  const markerPosition = toGoogleCoords(coordinates);

  if (!markerPosition) {
    return (
      <div className="map-error">
        <p>No valid location data for this incident.</p>
      </div>
    );
  }

  return (
    <div className="incident-map-container">
      <GoogleMap
        mapContainerStyle={{ width: "100%", height: "100%" }}
        center={mapCenter}
        zoom={15}
        options={mapOptions}
      >
        {/* Single Marker for the Incident */}
        <Marker
          position={markerPosition}
          onClick={() => setInfoWindowOpen(true)}
          icon={{
            path: window.google.maps.SymbolPath.CIRCLE,
            fillColor: getStatusColor(status),
            fillOpacity: 0.9,
            strokeColor: "#ffffff",
            strokeWeight: 2,
            scale: 12,
          }}
        />

        {/* InfoWindow for incident details */}
        {infoWindowOpen && (
          <InfoWindow
            position={markerPosition}
            onCloseClick={() => setInfoWindowOpen(false)}
          >
            <div className="incident-info-window">
              <h4>{tag || "Incident Report"}</h4>
              <p className="info-status">
                Status: <strong>{status}</strong>
              </p>
              <p className="info-description">
                {description?.substring(0, 100)}
                {description?.length > 100 ? "..." : ""}
              </p>
              <p className="info-coordinates">
                <small>
                  Lat: {markerPosition.lat.toFixed(4)}, Lng:{" "}
                  {markerPosition.lng.toFixed(4)}
                </small>
              </p>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </div>
  );
};

export default IncidentMap;
