import React, { useEffect, useState } from "react";
import "../css/Incidents.css";
import api from "../services/api";

export default function Incidents() {
  const [incidents, setIncidents] = useState([]);
  const [selectedIncident, setSelectedIncident] = useState(null);

  useEffect(() => {
    const fetchIncidents = async () => {
      const response = await api.get("/report");
      console.log("Fetched incidents:", response.data);
      setIncidents(response.data.data.reports);
    };
    fetchIncidents();
  }, []);

  const updateStatus = async (id, status) => {
    const response = await api.put(`/report/${id}`, { status });

    setIncidents((prev) =>
      prev.map((i) => (i._id === id ? response.data.data : i))
    );

    setSelectedIncident(response.data.data);
  };

  return (
    <div className="incidents-admin-container">
      <h1 className="incidents-title">Incident Reports</h1>

      <div className="incidents-layout">
        {/* LEFT: Incident List */}
        <div className="incident-list-panel">
          <h2 className="section-header">All Reports</h2>

          {incidents.map((incident) => (
            <div
              key={incident._id}
              className={`incident-card ${
                selectedIncident?._id === incident._id ? "active" : ""
              }`}
              onClick={() => setSelectedIncident(incident)}
            >
              <div className="incident-card-header">
                <h3 className="incident-tag">{incident.tag || "Untitled"}</h3>

                <span className={`status-chip status-${incident.status}`}>
                  {incident.status}
                </span>
              </div>

              <p className="incident-date">
                {new Date(incident.reportedAt).toLocaleString()}
              </p>

              <p className="incident-desc">
                {incident.description.substring(0, 60)}...
              </p>
            </div>
          ))}
        </div>

        {/* RIGHT: Detail Panel */}
        <div className="incident-details-panel">
          {selectedIncident ? (
            <div className="detail-content">
              <h2 className="detail-title">{selectedIncident.tag}</h2>

              <div className="detail-info">
                <p>
                  <strong>Status:</strong>{" "}
                  <span
                    className={`status-chip large status-${selectedIncident.status}`}
                  >
                    {selectedIncident.status}
                  </span>
                </p>

                <p>
                  <strong>Description:</strong> <br />
                  {selectedIncident.description}
                </p>

                <p>
                  <strong>Anonymous:</strong>{" "}
                  {selectedIncident.anonymous ? "Yes" : "No"}
                </p>

                <p>
                  <strong>Location:</strong>{" "}
                  {selectedIncident.location.coordinates.join(", ")}
                </p>

                {selectedIncident.evidenceImage && (
                  <img
                    className="evidence-image"
                    src={selectedIncident.evidenceImage}
                    alt="Evidence"
                  />
                )}
              </div>

              <div className="status-action-buttons">
                <button
                  onClick={() => updateStatus(selectedIncident._id, "pending")}
                  className="btn-action pending"
                >
                  Mark as Pending
                </button>
                <button
                  onClick={() => updateStatus(selectedIncident._id, "resolved")}
                  className="btn-action resolved"
                >
                  Mark as Resolved
                </button>
                <button
                  onClick={() => updateStatus(selectedIncident._id, "rejected")}
                  className="btn-action rejected"
                >
                  Reject Report
                </button>
              </div>
            </div>
          ) : (
            <div className="empty-panel">Select a report to view details</div>
          )}
        </div>
      </div>
    </div>
  );
}
