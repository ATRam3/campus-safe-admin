import React, { useMemo } from "react";
import Modal from "../shared/Modal";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
import { X, Check, Loader2 } from "lucide-react";

const libraries = ["places"];

const MapSelectionModal = ({ 
  isOpen, 
  onClose, 
  selectedLocation, 
  onMapClick 
}) => {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: "AIzaSyDGOfKLp0FxNKr6BxKHlJPKDcBWji1uGWI",
    libraries,
  });

  const mapOptions = useMemo(() => ({
    streetViewControl: false,
    mapTypeControl: true,
    fullscreenControl: false,
    zoomControl: true,
  }), []);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
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
          {!isLoaded ? (
            <div className="map-loading">
              <Loader2 className="loading-spinner" size={24} />
              <p>Loading map...</p>
            </div>
          ) : (
            <GoogleMap
              mapContainerStyle={{ width: "100%", height: "400px" }}
              center={selectedLocation}
              zoom={17}
              options={mapOptions}
              onClick={onMapClick}
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
          )}
        </div>

        <div className="modal-actions">
          <button
            className="btn btn-secondary"
            onClick={onClose}
          >
            <X size={16} />
            Cancel
          </button>
          <button
            className="btn btn-primary"
            onClick={onClose}
          >
            <Check size={16} />
            Use This Location
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default MapSelectionModal;