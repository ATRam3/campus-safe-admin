import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Layout from "./layout/Layout.jsx";
//import "./App.css";
import Login from "./pages/Login.jsx";

//import pages
import Dashboard from "./pages/Dashboard.jsx";
import PanicAlerts from "./pages/PanicAlert.jsx";
import Incidents from "./pages/Incidents.jsx";
import Announcements from "./pages/Announcements.jsx";
import Users from "./pages/Users.jsx";

import DangerZonePage from "./pages/DangerZonePage.jsx";
import Settings from "./pages/Settings.jsx";
import { io } from "socket.io-client";
import { connectSocket, disconnectSocket, socket } from "./services/socket.js";
import useAuth from "./hooks/useAuth.jsx";

const RequireAuth = ({ children }) => {
  const token = localStorage.getItem("token");
  if (!token) {
    return <Navigate to="/login" replace />; // Redirect to login if no token
  }
  return children;
};

const App = () => {
  const { user } = useAuth();
  console.log("Current user:", user);
  //register admin as online when app loads
  useEffect(() => {
    if (!user) return;
    const token = localStorage.getItem("token");
    connectSocket(token);
    console.log("Connecting socket with token:", token, user);
    socket.on("connect", () => {
      console.log("Admin -", user.email, "socket connected");
      socket.emit("register_online", user.id);
    });

    return () => {
      //disconnect on unmount
      disconnectSocket();
    };
  }, [user]);
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />

        {/* Protected Routes */}
        <Route
          element={
            <RequireAuth>
              <Layout />
            </RequireAuth>
          }
        >
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/danger-zones" element={<DangerZonePage />} />
          <Route path="/panic-alerts" element={<PanicAlerts />} />
          <Route path="/incidents" element={<Incidents />} />
          <Route path="/announcements" element={<Announcements />} />
          <Route path="/users" element={<Users />} />
          <Route path="/analytics" element={<div>Analytics Page</div>} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
