import React from "react";
import { Plus } from "lucide-react";

const DangerZoneHeader = ({ onCreateZone }) => {
  return (
    <div className="page-header">
      <div className="header-left">
        <h1>Danger Zone Management</h1>
        <p>Monitor and manage campus safety zones</p>
      </div>
      <div className="header-actions">
        <button
          className="btn btn-primary"
          onClick={onCreateZone}
        >
          <Plus className="icon" size={18} />
          Create Danger Zone
        </button>
      </div>
    </div>
  );
};

export default DangerZoneHeader;