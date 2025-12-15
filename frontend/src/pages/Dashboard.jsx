import React, { useState, useEffect } from "react";
import StatsGrid from "../component/dashboard/StatsGrid";
import DangerZonesMapWidget from "../component/dashboard/DangerZonesMapWidget";
import RecentIncidentsWidget from "../component/dashboard/RecentIncidentsWidget";
import SosAlertsWidget from "../component/dashboard/SosAlertsWidget";
import api from "../services/api";
import "../css/DashboardPage.css";

const DashboardPage = () => {
  const [stats, setStats] = useState({
    totalZones: 0,
    totalIncidents: 0,
    activeAlerts: 0,
    resolvedToday: 0,
  });
  const [loading, setLoading] = useState(true);
  const [recentData, setRecentData] = useState({
    incidents: [],
    alerts: [],
    announcements: [],
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      const [zonesRes, incidentsRes, panicAlertsRes] = await Promise.all([
        api.get("/dangerArea"),
        api.get("/report"),
        api.get("/sos/get-all"),
      ]);

      const zones = zonesRes.data.data || [];
      const incidents = incidentsRes.data.data?.reports || [];
      const panicAlerts = panicAlertsRes.data.data.data || [];

      // const resolvedToday = incidents.filter(inc =>
      //   inc.resolved &&
      //   new Date(inc.updatedAt).toDateString() === new Date().toDateString()
      // ).length;

      const resolvedTotal = panicAlerts.filter(al =>
        al.resolved == true || al.resolved == "true").length;

      setStats({
        totalZones: zones.length,
        totalIncidents: incidents.length,
        activeAlerts: panicAlerts.length,
        resolvedTotal,
      });

      console.log("panic ", panicAlerts);
      setRecentData({
        incidents: incidents.slice(0, 5),
        alerts: panicAlerts.slice(0, 5),
      });
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <div className="dashboard-stats">
      <StatsGrid stats={stats} />
</div>
      <div className="dashboard-grid">
        <div className="grid-left">
          <DangerZonesMapWidget />
          <RecentIncidentsWidget incidents={recentData.incidents} />
        </div>

        <div className="grid-right">
          <SosAlertsWidget sosAlerts={recentData.alerts} />
        </div>
      </div>
    </>
  );
};

export default DashboardPage;