import React, { useState, useEffect } from "react";
import api from "../services/api";
import "../css/Users.css";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [filterRole, setFilterRole] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch users from API
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await api.get("/users");
      console.log("Fetched users:", response.data);

      // Handle different response structures
      const usersData = response.data.data || response.data || [];
      setUsers(usersData);
      setError(null);
    } catch (error) {
      console.error("Error fetching users:", error);
      setError("Failed to load users. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Filter users
  const filteredUsers = users.filter((user) => {
    const matchesRole = filterRole === "all" || user.role === filterRole;
    const matchesSearch =
      searchQuery === "" ||
      (user.fullName &&
        user.fullName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (user.studentId &&
        user.studentId.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesRole && matchesSearch;
  });

  // Get role color
  const getRoleColor = (role) => {
    switch (role) {
      case "admin":
        return "#007AFF";
      case "campus_security":
        return "#FF9500";
      case "student":
        return "#34C759";
      default:
        return "#8E8E93";
    }
  };

  // Format role name
  const formatRole = (role) => {
    if (role === "campus_security") return "Campus Security";
    return role.charAt(0).toUpperCase() + role.slice(1);
  };

  // Handle user deletion
  const handleDeleteUser = async () => {
    if (!selectedUser) return;

    try {
      setLoading(true);
      await api.delete(`/users/${selectedUser._id}`);

      setUsers(users.filter((user) => user._id !== selectedUser._id));
      setSelectedUser(null);
      setShowDeleteModal(false);
      setError(null);

      setTimeout(() => {
        setError("✅ User deleted successfully!");
        setTimeout(() => setError(null), 3000);
      }, 100);
    } catch (err) {
      console.error("Error deleting user:", err);
      setError("❌ Failed to delete user. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch (err) {
      return dateString;
    }
  };

  // Calculate stats
  const stats = {
    total: users.length,
    students: users.filter((u) => u.role === "student").length,
    admin: users.filter((u) => u.role === "admin").length,
    campusSecurity: users.filter((u) => u.role === "campus_security").length,
  };

  return (
    <div className="users-management-page">
      {/* Page Header */}
      <div className="page-header">
        <div className="header-left">
          <h1>👥 User Management</h1>
          <p>Manage campus users and their roles</p>
        </div>
        <div className="header-actions">
          <button
            className="btn btn-primary"
            onClick={() => {}}
            disabled={loading}
          >
            {loading ? "Loading..." : "+ Add User"}
          </button>
        </div>
      </div>

      {/* Error/Success Message */}
      {error && (
        <div
          className={`alert ${
            error.includes("✅") ? "alert-success" : "alert-error"
          }`}
        >
          <span>{error}</span>
          <button className="alert-close" onClick={() => setError(null)}>
            ×
          </button>
        </div>
      )}

      {/* Stats Cards */}
      <div className="stats-section">
        <div className="stat-card">
          <div
            className="stat-icon"
            style={{ background: "#007AFF20", color: "#007AFF" }}
          >
            👥
          </div>
          <div className="stat-info">
            <h3>{stats.total}</h3>
            <p>Total Users</p>
          </div>
        </div>
        <div className="stat-card">
          <div
            className="stat-icon"
            style={{ background: "#34C75920", color: "#34C759" }}
          >
            🎓
          </div>
          <div className="stat-info">
            <h3>{stats.students}</h3>
            <p>Students</p>
          </div>
        </div>
        <div className="stat-card">
          <div
            className="stat-icon"
            style={{ background: "#FF950020", color: "#FF9500" }}
          >
            🛡️
          </div>
          <div className="stat-info">
            <h3>{stats.campusSecurity}</h3>
            <p>Security</p>
          </div>
        </div>
        <div className="stat-card">
          <div
            className="stat-icon"
            style={{ background: "#5856D620", color: "#5856D6" }}
          >
            ⚙️
          </div>
          <div className="stat-info">
            <h3>{stats.admin}</h3>
            <p>Admins</p>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="controls-section">
        <div className="filters-row">
          <div className="filter-group">
            <label>Filter by Role</label>
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="filter-select"
              disabled={loading}
            >
              <option value="all">All Roles</option>
              <option value="student">Students</option>
              <option value="campus_security">Campus Security</option>
              <option value="admin">Administrators</option>
            </select>
          </div>

          <div className="filter-group search-group">
            <label>Search Users</label>
            <div className="search-box">
              <input
                type="text"
                placeholder="Search by name, email, or student ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                disabled={loading}
              />
              <span className="search-icon">🔍</span>
            </div>
          </div>
        </div>

        <div className="action-buttons">
          <button
            className="btn btn-outline"
            onClick={fetchUsers}
            disabled={loading}
          >
            🔄 Refresh
          </button>
        </div>
      </div>

      {/* Users Table */}
      <div className="users-table-container">
        <div className="table-header">
          <h3>Registered Users ({filteredUsers.length})</h3>
        </div>

        {loading && users.length === 0 ? (
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Loading users...</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">👤</div>
            <h3>No Users Found</h3>
            <p>Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="users-table">
            <div className="table-row header-row">
              <div className="col col-user">User</div>
              <div className="col col-role">Role</div>
              <div className="col col-student-id">Student ID</div>
              <div className="col col-contacts">Trusted Contacts</div>
              <div className="col col-joined">Joined Date</div>
              <div className="col col-actions">Actions</div>
            </div>

            {filteredUsers.map((user) => (
              <div key={user._id} className="table-row">
                <div className="col col-user">
                  <div className="user-info">
                    <div className="avatar-placeholder">
                      {user.fullName
                        ? user.fullName.charAt(0).toUpperCase()
                        : "U"}
                    </div>
                    <div className="user-details">
                      <h4>{user.fullName || "No Name"}</h4>
                      <p>{user.email}</p>
                    </div>
                  </div>
                </div>

                <div className="col col-role">
                  <span
                    className="role-badge"
                    style={{
                      background: getRoleColor(user.role) + "20",
                      color: getRoleColor(user.role),
                    }}
                  >
                    {formatRole(user.role)}
                  </span>
                </div>

                <div className="col col-student-id">
                  <span className="student-id">
                    {user.role === "student" ? user.studentId || "N/A" : "N/A"}
                  </span>
                </div>

                <div className="col col-contacts">
                  <span className="contacts-count">
                    {user.trustedContacts?.length || 0} contacts
                  </span>
                </div>

                <div className="col col-joined">
                  <span className="joined-date">
                    {formatDate(user.createdAt)}
                  </span>
                </div>

                <div className="col col-actions">
                  <div className="action-buttons-cell">
                    <button
                      className="action-btn view-btn"
                      onClick={() => setSelectedUser(user)}
                      title="View Details"
                    >
                      👁️
                    </button>
                    <button
                      className="action-btn delete-btn"
                      onClick={() => {
                        setSelectedUser(user);
                        setShowDeleteModal(true);
                      }}
                      title="Delete User"
                      disabled={loading}
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* User Details Side Panel */}
      {selectedUser && (
        <div className="user-details-panel">
          <div className="panel-header">
            <h3>User Details</h3>
            <button
              className="panel-close"
              onClick={() => setSelectedUser(null)}
            >
              ×
            </button>
          </div>

          <div className="user-details-content">
            <div className="user-profile">
              <div className="avatar-large">
                {selectedUser.fullName
                  ? selectedUser.fullName.charAt(0).toUpperCase()
                  : "U"}
              </div>
              <h2>{selectedUser.fullName || "No Name"}</h2>
              <p className="user-email">{selectedUser.email}</p>
              <span
                className="role-badge large"
                style={{
                  background: getRoleColor(selectedUser.role) + "20",
                  color: getRoleColor(selectedUser.role),
                }}
              >
                {formatRole(selectedUser.role)}
              </span>
            </div>

            <div className="user-info-section">
              <h4>Basic Information</h4>
              <div className="info-grid">
                <div className="info-item">
                  <span className="info-label">Student ID</span>
                  <span className="info-value">
                    {selectedUser.role === "student"
                      ? selectedUser.studentId || "N/A"
                      : "N/A"}
                  </span>
                </div>
                <div className="info-item">
                  <span className="info-label">Joined Date</span>
                  <span className="info-value">
                    {formatDate(selectedUser.createdAt)}
                  </span>
                </div>
                <div className="info-item">
                  <span className="info-label">Device Token</span>
                  <span className="info-value">
                    {selectedUser.deviceToken ? "Registered" : "Not set"}
                  </span>
                </div>
              </div>
            </div>

            <div className="user-info-section">
              <h4>
                Trusted Contacts ({selectedUser.trustedContacts?.length || 0})
              </h4>
              {selectedUser.trustedContacts?.length > 0 ? (
                <div className="contacts-list">
                  {selectedUser.trustedContacts.map((contact, index) => (
                    <div key={index} className="contact-item">
                      <div className="contact-header">
                        <span className="contact-name">
                          {contact.name || "Unnamed"}
                        </span>
                        <span className="contact-relationship">
                          {contact.relationShip}
                        </span>
                      </div>
                      <div className="contact-details">
                        <span>📧 {contact.email}</span>
                        <span>📞 {contact.phone}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="no-contacts">No trusted contacts added</p>
              )}
            </div>

            <div className="panel-actions">
              <button
                className="btn btn-outline"
                onClick={() => setSelectedUser(null)}
              >
                Close
              </button>
              <button
                className="btn btn-danger"
                onClick={() => {
                  setShowDeleteModal(true);
                }}
              >
                Delete User
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedUser && (
        <div
          className="modal-overlay"
          onClick={() => setShowDeleteModal(false)}
        >
          <div
            className="modal-container small"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h3>Confirm Delete</h3>
              <button
                className="modal-close"
                onClick={() => setShowDeleteModal(false)}
              >
                ×
              </button>
            </div>
            <div className="modal-content">
              <div className="delete-confirmation">
                <div className="warning-icon">⚠️</div>
                <h4>Delete User Account</h4>
                <p>
                  Are you sure you want to delete{" "}
                  <strong>{selectedUser.fullName || selectedUser.email}</strong>
                  's account?
                </p>
                <p className="warning-text">
                  This action cannot be undone. All user data will be
                  permanently removed.
                </p>
                <div className="modal-actions">
                  <button
                    className="btn btn-secondary"
                    onClick={() => setShowDeleteModal(false)}
                    disabled={loading}
                  >
                    Cancel
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={handleDeleteUser}
                    disabled={loading}
                  >
                    {loading ? "Deleting..." : "Delete User"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
