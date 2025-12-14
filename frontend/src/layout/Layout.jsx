import React, { useState } from "react";
import { Link, useLocation, Outlet } from "react-router-dom";
import "../css/Layout.css";

const Layout = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const location = useLocation();

  const menuItems = [
    { path: "/dashboard", icon: "📊", label: "Dashboard" },
    { path: "/danger-zones", icon: "📍", label: "Danger Zones" },
    { path: "/panic-alerts", icon: "🚨", label: "Panic Alerts" },
    { path: "/incidents", icon: "📋", label: "Incident Reports" },
    { path: "/announcements", icon: "📢", label: "Announcements" },
    { path: "/users", icon: "👥", label: "User Management" },
    { path: "/settings", icon: "⚙️", label: "Settings" },
  ];

  const isActive = (path) => location.pathname === path;

  // Detect title based on active route
  const currentPage = menuItems.find((item) => isActive(item.path));
  const pageTitle = currentPage ? currentPage.label : "";

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

              <button className="logout-btn" title="Logout">
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
              <button className="quick-action-btn">🚨 Emergency</button>

              <div className="user-dropdown">
                <img
                  src="https://api.dicebear.com/7.x/avataaars/svg?seed=Admin"
                  className="header-avatar"
                  alt="Admin"
                />
                <span className="username">Admin User</span>
                <span className="dropdown-arrow">▼</span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content Loaded Here */}
        <div className="page-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;
