import React from "react";
import { Search, Filter, AlertOctagon, AlertTriangle, AlertCircle } from "lucide-react";

const DangerZoneFilters = ({ 
  filterSeverity, 
  searchQuery, 
  onFilterChange, 
  onSearchChange 
}) => {
  return (
    <div className="filters-section">
      <div className="filter-group">
        <h4>
          <Filter className="icon" size={16} />
          Quick Filters
        </h4>
        <div className="filter-chips">
          <button
            className={`filter-chip ${filterSeverity === "all" ? "active" : ""}`}
            style={{ color: filterSeverity === "all" ? "" : "#4299e1"}}
            onClick={() => onFilterChange("all")}
          >
            All Zones
          </button>
          <button
            className={`filter-chip ${filterSeverity === "high" ? "active" : ""}`}
            onClick={() => onFilterChange("high")}
            style={{ background: "#FF3B3020", color: "#FF3B30" }}
          >
            <AlertOctagon size={14} />
            High Risk
          </button>
          <button
            className={`filter-chip ${filterSeverity === "medium" ? "active" : ""}`}
            onClick={() => onFilterChange("medium")}
            style={{ background: "#FF950020", color: "#FF9500" }}
          >
            <AlertTriangle size={14} />
            Medium Risk
          </button>
          <button
            className={`filter-chip ${filterSeverity === "low" ? "active" : ""}`}
            onClick={() => onFilterChange("low")}
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
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
    </div>
  );
};

export default DangerZoneFilters;