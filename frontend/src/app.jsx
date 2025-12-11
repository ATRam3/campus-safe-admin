import React from "react";
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

const RequireAuth = ({ children }) => {
  const token = localStorage.getItem("token");
  if (!token) {
    return <Navigate to="/login" replace />; // Redirect to login if no token
  }
  return children;
};

const App = () => {
  return (
    <Router>
      <Routes>
        {/* <Route path="/login" element={<Login />} /> */}

        {/* Protected Routes */}
        <Route element={<Layout />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/danger-zones" element={<DangerZonePage />} />
          <Route path="/panic-alerts" element={<PanicAlerts />} />
          <Route path="/incidents" element={<Incidents />} />
          <Route path="/announcements" element={<Announcements />} />
          <Route path="/users" element={<Users />} />
          <Route path="/analytics" element={<div>Analytics Page</div>} />
          <Route path="/settings" element={<div>Settings Page</div>} />
          <Route path="/login" element={<Login />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
