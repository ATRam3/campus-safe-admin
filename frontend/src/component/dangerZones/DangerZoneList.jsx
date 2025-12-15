import React from "react";
import { AlertTriangle, Navigation, MapPin, Trash2 } from "lucide-react";

const DangerZoneList = ({ 
  zones, 
  selectedZone, 
  onZoneSelect, 
  onDeleteZone,
  getSeverityColor,
  getSeverityIcon 
}) => {
  return (
    <div className="zone-list-container">
      <div className="zone-list-header">
        <h4>Danger Zones ({zones.length})</h4>
      </div>
      <div className="zone-list">
        {zones.map((zone) => (
          <div
            key={zone._id}
            className={`zone-item ${selectedZone?._id === zone._id ? "selected" : ""}`}
            onClick={() => onZoneSelect(zone)}
          >
            <div
              className="zone-marker"
              style={{ background: getSeverityColor(zone.severity) }}
            >
              {getSeverityIcon(zone.severity)}
            </div>
            <div className="zone-content">
              <div className="zone-header">
                <h5 style={{ color: "black" }}>{zone.zoneName || zone.name}</h5>
                <span className="zone-status">{zone.status}</span>
              </div>
              <p className="zone-description">{zone.description}</p>
              <div className="zone-footer">
                <span>
                  <AlertTriangle size={12} /> {zone.incidents || 0}{" "}
                  incidents
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
                  onDeleteZone(zone);
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
  );
};

export default DangerZoneList;