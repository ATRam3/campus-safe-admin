import React, { useEffect, useState, useRef } from "react";
import {
  GoogleMap,
  Marker,
  InfoWindow,
  useLoadScript,
} from "@react-google-maps/api";
import { io } from "socket.io-client";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import apiClient from "../services/api";
import "../css/PanicAlertPage.css";
import {
  connectPanicAlertSocket,
  disconnectPanicAlertSocket,
  panicAlertSocket,
} from "../services/panicAlertSockets";

dayjs.extend(relativeTime);

const MAP_CENTER = { lat: 8.8913, lng: 38.8089 };
const MAP_ZOOM = 16;

const PanicAlertsPage = () => {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_KEY,
  });

  const [alerts, setAlerts] = useState([]);
  const [selectedAlert, setSelectedAlert] = useState(null);

  const socketRef = useRef(null);

  const mapRef = useRef(null);

  const onMapLoad = (map) => {
    mapRef.current = map;
  };

  /* ================= FETCH INITIAL DATA ================= */
  useEffect(() => {
    const fetchAlerts = async () => {
      const { data } = await apiClient.get("/sos/unresolved");
      console.log("Fetched panic alerts:", data);
      console.log("Raw data:", data.data.data);
      const formatted = data.data.data.map((event) => ({
        id: event._id,
        name: event.userId?.fullName || "Unknown",
        email: event.userId?.email || "N/A",
        location: {
          lat: event.location.coordinates[1],
          lng: event.location.coordinates[0],
        },
        message: event.message || "Emergency alert",
        status: event.resolved ? "resolved" : "active",
        startedAt: event.timeStamp,
      }));
      // Sort by startedAt descending
      formatted.sort((a, b) => new Date(b.startedAt) - new Date(a.startedAt));

      setAlerts(formatted);
      setSelectedAlert(formatted[0] || null);
    };

    fetchAlerts();
  }, []);

  /* ================= SOCKET CONNECTION ================= */
  useEffect(() => {
    const token = localStorage.getItem("token");
    connectPanicAlertSocket(token);
    panicAlertSocket.on("connect", () => {
      console.log("Panic alert socket connected Admin!!!");
    });

    // panicAlertSocket.on("location_update", (data) => {
    //   console.log("Location update received:", data);

    //   const { userId, location } = data;
    //   const panicId = userId; //since userId is panicId in this case
    //   console.log("Panic ID:", panicId);
    //   console.log("Selected Alert ID:", selectedAlert?.id);
    //   if (!selectedAlert || selectedAlert.id !== panicId) return;

    //   const formattedLocation = {
    //     lat: location.latitude,
    //     lng: location.longitude,
    //   };
    //   console.log("Received location update for alert:", formattedLocation);
    //   // update selected alert only
    //   setSelectedAlert((prev) =>
    //     prev ? { ...prev, location: formattedLocation } : prev
    //   );
    // });

    // console.log("Setting up panic alert socket connection");
    // socketRef.current = panicAlertSocket.connect();
    // socketRef.current.on("connect", () => {
    //   console.log("Admin socket connected");
    // });

    // socketRef.current.on("location_update", (data) => {
    //   console.log("Location update received:", data);

    //   const { panicId, location } = data;

    //   if (!selectedAlert || selectedAlert.id !== panicId) return;

    //   const formattedLocation = {
    //     lat: location.lat,
    //     lng: location.lng,
    //   };

    //   // update selected alert only
    //   // setSelectedAlert((prev) =>
    //   //   prev ? { ...prev, location: formattedLocation } : prev
    //   // );
    // });
    // listen to ns.to("admins").emit(`panic:${panicId}`
    //  socketRef.current.on('panic')

    return () => {
      disconnectPanicAlertSocket();
    };
  }, []);

  /* ================= SHOW REAL-TIME LOCATION ================= */
  const handleShowRealTimeLocation = (alert) => {
    setSelectedAlert(alert);
    console.log("Selected alert for real-time tracking:", alert);
    //ns.to("admins").emit(`panic:${panicId}`, {
    panicAlertSocket.on(`panic:${alert.id}`, (data) => {
      console.log(
        "Real-time location update received for alert:",
        `for userId ${data.userId} `,
        data._id,
        data.location
      );
      const updatedLocation = {
        lat: data.location.latitude,
        lng: data.location.longitude,
      };

      //record location in local storage to create a line history if needed,
      //array inside a user key hashmap, a queue of locations(max 50)
      const historyKey = `panic_history_${alert.id}`;
      const existingHistory =
        JSON.parse(localStorage.getItem(historyKey)) || [];
      existingHistory.push(updatedLocation);
      if (existingHistory.length > 50) {
        existingHistory.shift(); // maintain max 50 entries
      }
      localStorage.setItem(historyKey, JSON.stringify(existingHistory));
      setSelectedAlert((prev) =>
        prev ? { ...prev, location: updatedLocation } : prev
      );

      // smooth tracking
      if (mapRef.current) {
        mapRef.current.panTo(updatedLocation);
      }
    });
  };

  useEffect(() => {
    if (selectedAlert && mapRef.current) {
      mapRef.current.panTo(selectedAlert.location);
    }
  }, [selectedAlert]);

  /* ================= RESOLVE PANIC ================= */
  const resolveAlert = async (alertId) => {
    const response = await apiClient.put(`/sos/update/${alertId}`);
    console.log("Resolve response:", response);
    setAlerts((prev) =>
      prev.map((alert) =>
        alert.id === alertId ? { ...alert, status: "resolved" } : alert
      )
    );

    setSelectedAlert((prev) =>
      prev && prev.id === alertId ? { ...prev, status: "resolved" } : prev
    );
  };

  return (
    <div className="panic-alerts-container">
      {/* HEADER */}
      <div className="page-title">
        <h1>🚨 Panic Alerts</h1>
        <p>Live emergency tracking dashboard</p>
      </div>

      <div className="alerts-content">
        {/* ================= LEFT PANEL ================= */}
        <div className="alerts-list-section">
          <div className="alerts-header">
            <h3>Active Alerts ({alerts.length})</h3>
          </div>

          <div className="alerts-list">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className={`alert-card ${
                  selectedAlert?.id === alert.id ? "selected" : ""
                }`}
                onClick={() => handleShowRealTimeLocation(alert)}
              >
                <div className="alert-status" data-status={alert.status} />

                <div className="alert-content">
                  <div className="alert-header">
                    <h4>{alert.name}</h4>
                    <span className="alert-time">
                      {dayjs(alert.startedAt).fromNow()}
                    </span>
                  </div>

                  <p className="alert-email">📧 {alert.email}</p>

                  <p className="alert-location">
                    📍 {alert.location.lat.toFixed(5)},{" "}
                    {alert.location.lng.toFixed(5)}
                  </p>

                  <p className="alert-message">{alert.message}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ================= MAP ================= */}
        <div className="map-section">
          {!isLoaded ? (
            <div className="map-loading">Loading map…</div>
          ) : (
            <>
              <GoogleMap
                onLoad={onMapLoad}
                mapContainerClassName="map-container"
                center={selectedAlert?.location || MAP_CENTER}
                zoom={MAP_ZOOM}
              >
                {/* ALL ACTIVE MARKERS */}
                {/* {alerts
                  .filter((a) => a.status === "active")
                  .map((alert) => (
                    <Marker
                      key={alert.id}
                      position={alert.location}
                      onClick={() => setSelectedAlert(alert)}
                    />
                  ))} */}
                {selectedAlert && selectedAlert.status === "active" && (
                  <Marker position={selectedAlert.location} />
                )}

                {/* INFO WINDOW */}
                {selectedAlert && (
                  <InfoWindow
                    position={selectedAlert.location}
                    onCloseClick={() => setSelectedAlert(null)}
                  >
                    <div className="info-window">
                      <h4>{selectedAlert.name}</h4>
                      <p>{selectedAlert.email}</p>
                      <p>Lat: {selectedAlert.location.lat.toFixed(6)}</p>
                      <p>Lng: {selectedAlert.location.lng.toFixed(6)}</p>
                      <p>Status: {selectedAlert.status}</p>
                    </div>
                  </InfoWindow>
                )}
              </GoogleMap>

              {/* DETAILS PANEL */}
              {selectedAlert && (
                <div className="alert-details">
                  <h3>Selected Alert</h3>

                  <button
                    className="status-toggle-btn"
                    disabled={selectedAlert.status === "resolved"}
                    onClick={() => resolveAlert(selectedAlert.id)}
                  >
                    {selectedAlert.status === "active"
                      ? "Mark as Resolved"
                      : "Resolved"}
                  </button>

                  <div className="details-grid">
                    <div>
                      <label>Name:</label>
                      <span>{selectedAlert.name}</span>
                    </div>
                    <div>
                      <label>Email:</label>
                      <span>{selectedAlert.email}</span>
                    </div>
                    <div>
                      <label>Status:</label>
                      <span className={`status-badge ${selectedAlert.status}`}>
                        {selectedAlert.status}
                      </span>
                    </div>
                    <div>
                      <label>Started:</label>
                      <span>{dayjs(selectedAlert.startedAt).fromNow()}</span>
                    </div>
                  </div>

                  <p className="alert-message-full">
                    <strong>Message:</strong> {selectedAlert.message}
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PanicAlertsPage;
