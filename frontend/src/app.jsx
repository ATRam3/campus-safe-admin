import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Layout from "./layout/Layout.jsx";
import DangerZonesPage from "./component/DangerZonePage.jsx";
import "./App.css";
import Login from "./pages/Login.jsx";

const RequireAuth = ({ children }) => {
  const token = localStorage.getItem("token");
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Public Route */}
        <Route path="/login" element={<Login />} />

        {/* Protected Routes */}
        <Route
          element={
            <RequireAuth>
              <Layout />
            </RequireAuth>
          }
        >
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<div>Dashboard Page</div>} />
          <Route path="/danger-zones" element={<DangerZonesPage />} />
          <Route path="/panic-alerts" element={<div>Panic Alerts Page</div>} />
          <Route path="/incidents" element={<div>Incident Reports Page</div>} />
          <Route
            path="/announcements"
            element={<div>Announcements Page</div>}
          />
          <Route path="/users" element={<div>User Management Page</div>} />
          <Route path="/analytics" element={<div>Analytics Page</div>} />
          <Route path="/settings" element={<div>Settings Page</div>} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
