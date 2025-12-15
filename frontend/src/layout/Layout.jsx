import React, { useState, useEffect } from "react";
import { Link, useLocation, Outlet } from "react-router-dom";
import "../css/Layout.css";
import { useNavigate } from "react-router-dom"
import Modal from "../component/shared/Modal"
import ProfileSection from "../component/settings/ProfileSection";
import api from "../services/api"

const Layout = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);
  const [adminData, setAdminData] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { path: "/dashboard", icon: "📊", label: "Dashboard" },
    { path: "/danger-zones", icon: "📍", label: "Danger Zones" },
    { path: "/panic-alerts", icon: "🚨", label: "Panic Alerts" },
    { path: "/incidents", icon: "📋", label: "Incident Reports" },
    { path: "/announcements", icon: "📢", label: "Announcements" },
    { path: "/users", icon: "👥", label: "User Management" },
  ];

  const isActive = (path) => location.pathname === path;

  // Detect title based on active route
  const currentPage = menuItems.find((item) => isActive(item.path));
  const pageTitle = currentPage ? currentPage.label : "";

  //Fetch admin data
  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user) {
          handleLogout();
          throw new Error("User not found");
        }

        const response = await api.get("/profile", user);
        const responseData = response.data.data || [];
        const storedData = JSON.parse(localStorage.getItem("admin"));

        const resAdminData = {
          fullName: storedData?.fullName,
          email: responseData.email,
          phone: storedData?.phone
        }

        setAdminData(resAdminData);
      } catch (error) {
        console.error("Error fetching profile data:", error);
      }
    };

    fetchAdminData();
  }, []);

  const handleLogout = () => {
    navigate("/login", { replace: true });

    // clear after navigation
    setTimeout(() => {
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
    }, 0);
  };


  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <div className={`sidebar ${sidebarCollapsed ? "collapsed" : ""}`}>
        {/* Logo */}
        <div className="sidebar-logo">
          <div className="logo-icon">🛡️</div>

          {!sidebarCollapsed && (
            <div className="logo-text">
              <h2>Safe Campus</h2>
              <p>Admin Portal</p>
            </div>
          )}

          <button
            className="collapse-btn"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          >
            {sidebarCollapsed ? "→" : "←"}
          </button>
        </div>

        {/* Menu */}
        <nav className="sidebar-menu">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`menu-item ${isActive(item.path) ? "active" : ""}`}
            >
              <span className="menu-icon">{item.icon}</span>

              {!sidebarCollapsed && (
                <span className="menu-label">{item.label}</span>
              )}

              {isActive(item.path) && !sidebarCollapsed && (
                <div className="active-indicator"></div>
              )}
            </Link>
          ))}

          {/* Settings button that opens modal */}
          <button
            className="menu-item"
            onClick={() => setSettingsModalOpen(true)}
          >
            <span className="menu-icon">⚙️</span>
            {!sidebarCollapsed && (
              <span className="menu-label">Settings</span>
            )}
          </button>
        </nav>


        {/* User Profile */}
        {!sidebarCollapsed && (
          <div className="sidebar-footer">
            <div className="user-profile">
              <div className="user-avatar">
                <img
                  src="https://api.dicebear.com/7.x/avataaars/svg?seed=Admin"
                  alt="Admin"
                />
              </div>

              <div className="user-info">
                <h4>Campus Security</h4>
                <p>Administrator</p>
              </div>

              <button className="logout-btn" title="Logout" onClick={handleLogout}>
                ↩️
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Top Header */}
        <header className="top-header">
          <div className="header-left">
            <button
              className="menu-toggle"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            >
              ☰
            </button>

            <h1 className="page-title">{pageTitle}</h1>
          </div>

          <div className="header-right">
            <div className="header-actions">
              <button className="notification-btn">
                🔔 <span className="notification-count">3</span>
              </button>
              {/* <button className="quick-action-btn">🚨 Emergency</button> */}

              <div className="user-dropdown">
                <div className="user-trigger">
                  <img
                    src="https://api.dicebear.com/7.x/avataaars/svg?seed=Admin"
                    className="header-avatar"
                    alt="Admin"
                  />
                  <span className="username">{adminData?.fullName || "Admin User"}</span>
                  <span className="dropdown-arrow">▼</span>
                </div>

                <div className="user-menu">
                  <button onClick={() => setSettingsModalOpen(true)}>Settings</button>
                  <button className="logout-btn" onClick={handleLogout}>Logout</button>
                </div>
              </div>

            </div>
          </div>
        </header>

        {/* Page Content Loaded Here */}
        <div className="page-content">
          <Outlet />
        </div>
      </div>

      {/* Settings Modal */}
      <Modal
        isOpen={settingsModalOpen}
        onClose={() => setSettingsModalOpen(false)}
        title="⚙️ Settings"
        size="xlarge"
        children={<ProfileSection
          adminData={adminData}
          setAdminData={setAdminData}
        />}
      />
    </div>
  );
};

export default Layout;
