import React, { useEffect, useState, useRef } from "react";
import {
  GoogleMap,
  Marker,
  InfoWindow,
  Polyline,
  useLoadScript,
} from "@react-google-maps/api";
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

/* ================= CONSTANTS ================= */
const MAP_CENTER = { lat: 8.8913, lng: 38.8089 };
const MAP_ZOOM = 16;
const MAX_HISTORY = 50;
const MIN_DISTANCE_METERS = 8;
const SMOOTH_STEPS = 6;
const SMOOTH_INTERVAL = 50;

/* ================= HELPERS ================= */

const getDistanceInMeters = (a, b) => {
  const R = 6371000;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const lat1 = (a.lat * Math.PI) / 180;
  const lat2 = (b.lat * Math.PI) / 180;

  const x =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;

  return 2 * R * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
};

const interpolatePoints = (from, to, steps) =>
  Array.from({ length: steps }, (_, i) => ({
    lat: from.lat + ((to.lat - from.lat) * (i + 1)) / steps,
    lng: from.lng + ((to.lng - from.lng) * (i + 1)) / steps,
  }));

/* ================= COMPONENT ================= */

const PanicAlertsPage = () => {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_KEY,
  });

  const [alerts, setAlerts] = useState([]); // active alerts
  const [resolvedAlerts, setResolvedAlerts] = useState([]);
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [routeHistory, setRouteHistory] = useState([]);
  const [showResolved, setShowResolved] = useState(false);

  const mapRef = useRef(null);
  const activePanicIdRef = useRef(null);
  const animationRef = useRef(null);

  /* ================= MAP ================= */

  const onMapLoad = (map) => {
    mapRef.current = map;
  };

  /* ================= FETCH ALERTS ================= */

  useEffect(() => {
    const fetchAlerts = async () => {
      console.log("API BASE URL:", apiClient.defaults.baseURL);
      const [unresolvedRes, resolvedRes] = await Promise.all([
        apiClient.get("/sos/unresolved"),
        apiClient.get("/sos/resolved"),
      ]);

      const formatAlert = (event, status) => ({
        id: event._id,
        name: event.userId?.fullName || "Unknown",
        email: event.userId?.email || "N/A",
        location: {
          lat: event.location.coordinates[1],
          lng: event.location.coordinates[0],
        },
        message: event.message || "Emergency alert",
        status,
        startedAt: event.timeStamp,
      });
      console.log("Unresolved Formatted Alerts:", unresolvedRes);

      const unresolvedFormatted = unresolvedRes.data.data.data.map((e) =>
        formatAlert(e, "active")
      );

      const resolvedFormatted = resolvedRes.data.data.data.map((e) =>
        formatAlert(e, "resolved")
      );

      unresolvedFormatted.sort(
        (a, b) => new Date(b.startedAt) - new Date(a.startedAt)
      );
      resolvedFormatted.sort(
        (a, b) => new Date(b.startedAt) - new Date(a.startedAt)
      );

      setAlerts(unresolvedFormatted);
      setResolvedAlerts(resolvedFormatted);
    };

    fetchAlerts();
  }, []);

  /* ================= SOCKET ================= */

  useEffect(() => {
    const token = localStorage.getItem("token");
    connectPanicAlertSocket(token);
    return () => disconnectPanicAlertSocket();
  }, []);

  /* ================= REAL-TIME TRACKING ================= */

  const handleShowRealTimeLocation = (alert) => {
    if (activePanicIdRef.current) {
      panicAlertSocket.off(`panic:${activePanicIdRef.current}`);
    }

    activePanicIdRef.current = alert.id;
    setSelectedAlert(alert);

    const historyKey = `panic_history_${alert.id}`;
    const storedHistory = JSON.parse(localStorage.getItem(historyKey)) || [];
    setRouteHistory(storedHistory);

    panicAlertSocket.on(`panic:${alert.id}`, (data) => {
      const newPoint = {
        lat: data.location.latitude,
        lng: data.location.longitude,
      };

      setSelectedAlert((prev) => {
        if (!prev) return prev;

        const distance = getDistanceInMeters(prev.location, newPoint);
        if (distance < MIN_DISTANCE_METERS) return prev;

        const steps = interpolatePoints(prev.location, newPoint, SMOOTH_STEPS);

        clearTimeout(animationRef.current);

        steps.forEach((point, index) => {
          animationRef.current = setTimeout(() => {
            setSelectedAlert((p) => (p ? { ...p, location: point } : p));
            mapRef.current?.panTo(point);
          }, index * SMOOTH_INTERVAL);
        });

        return prev;
      });

      setRouteHistory((prev) => {
        const last = prev[prev.length - 1];
        if (last && getDistanceInMeters(last, newPoint) < MIN_DISTANCE_METERS) {
          return prev;
        }

        const updated = [...prev, newPoint].slice(-MAX_HISTORY);
        localStorage.setItem(historyKey, JSON.stringify(updated));
        return updated;
      });
    });
  };

  /* ================= RESOLVE ================= */

  const resolveAlert = async (alertId) => {
    await apiClient.put(`/sos/update/${alertId}`);

    setAlerts((prev) => prev.filter((a) => a.id !== alertId));

    const resolved = alerts.find((a) => a.id === alertId);
    if (resolved) {
      setResolvedAlerts((prev) => [
        { ...resolved, status: "resolved" },
        ...prev,
      ]);
    }

    if (selectedAlert?.id === alertId) {
      setSelectedAlert((prev) => ({ ...prev, status: "resolved" }));
    }
  };

  /* ================= RENDER ================= */

  return (
    <div className="panic-alerts-container">
      <div className="page-title">
        <h1>🚨 Panic Alerts</h1>
        <p>Live emergency tracking dashboard</p>
      </div>

      <div className="alerts-content">
        {/* LEFT PANEL */}
        <div className="alerts-list-section">
          <div className="alerts-tabs">
            <button
              className={`filter-btn ${
                !showResolved ? "filter-btn--active" : ""
              }`}
              onClick={() => setShowResolved(false)}
            >
              Active Alerts
            </button>

            <button
              className={`filter-btn ${
                showResolved ? "filter-btn--active" : ""
              }`}
              onClick={() => setShowResolved(true)}
            >
              Resolved Alerts
            </button>
          </div>

          {(showResolved ? resolvedAlerts : alerts).map((alert) => (
            <div
              key={alert.id}
              className={`alert-card ${
                selectedAlert?.id === alert.id ? "selected" : ""
              }`}
              onClick={() => handleShowRealTimeLocation(alert)}
            >
              <h4>{alert.name}</h4>
              <p>{dayjs(alert.startedAt).fromNow()}</p>
              <p>{alert.email}</p>
            </div>
          ))}
        </div>

        {/* MAP */}
        <div className="map-section">
          {!isLoaded ? (
            <div>Loading map…</div>
          ) : (
            <>
              <GoogleMap
                onLoad={onMapLoad}
                mapContainerClassName="map-container"
                center={selectedAlert?.location || MAP_CENTER}
                zoom={MAP_ZOOM}
              >
                {routeHistory.length > 1 && (
                  <Polyline
                    path={routeHistory}
                    options={{
                      strokeColor: "#FF0000",
                      strokeOpacity: 0.7,
                      strokeWeight: 4,
                    }}
                  />
                )}

                {selectedAlert && selectedAlert.status === "active" && (
                  <Marker position={selectedAlert.location} />
                )}

                {selectedAlert && (
                  <InfoWindow position={selectedAlert.location}>
                    <div>
                      <h4>{selectedAlert.name}</h4>
                      <p>{selectedAlert.email}</p>
                      <p>Status: {selectedAlert.status}</p>
                    </div>
                  </InfoWindow>
                )}
              </GoogleMap>

              {selectedAlert && (
                <div className="alert-details">
                  <button
                    disabled={selectedAlert.status === "resolved"}
                    onClick={() => resolveAlert(selectedAlert.id)}
                  >
                    Mark as Resolved
                  </button>
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
