import React, { useState } from "react";
import "../css/Users.css";

const Users = () => {
  // Sample users data
  const initialUsers = [
    {
      id: 1,
      name: "John Doe",
      email: "john.doe@university.edu",
      role: "student",
      status: "active",
      phone: "+1 (555) 123-4567",
      department: "Computer Science",
      year: "3rd Year",
      joinedDate: "2023-09-15",
      lastLogin: "2 hours ago",
      profilePhoto: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
      courses: ["CS101", "CS202", "CS303"],
      emergencyContact: "Jane Doe (+1-555-987-6543)",
    },
    {
      id: 2,
      name: "Sarah Johnson",
      email: "sarah.j@university.edu",
      role: "student",
      status: "inactive",
      phone: "+1 (555) 234-5678",
      department: "Engineering",
      year: "4th Year",
      joinedDate: "2022-08-20",
      lastLogin: "1 week ago",
      profilePhoto: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
      courses: ["ENG201", "ENG305", "ENG410"],
      emergencyContact: "Mike Johnson (+1-555-876-5432)",
    },
    {
      id: 3,
      name: "Dr. Michael Chen",
      email: "michael.c@university.edu",
      role: "faculty",
      status: "active",
      phone: "+1 (555) 345-6789",
      department: "Physics",
      position: "Professor",
      joinedDate: "2018-03-10",
      lastLogin: "1 day ago",
      profilePhoto: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael",
      courses: ["PHY101", "PHY301", "PHY450"],
      office: "Science Building, Room 205",
    },
    {
      id: 4,
      name: "Emma Wilson",
      email: "emma.w@university.edu",
      role: "staff",
      status: "active",
      phone: "+1 (555) 456-7890",
      department: "Security",
      position: "Security Officer",
      joinedDate: "2021-05-12",
      lastLogin: "5 hours ago",
      profilePhoto: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emma",
      shift: "Night Shift (10 PM - 6 AM)",
      badgeNumber: "SEC-0456",
    },
    {
      id: 5,
      name: "Robert Taylor",
      email: "robert.t@university.edu",
      role: "admin",
      status: "active",
      phone: "+1 (555) 567-8901",
      department: "IT Department",
      position: "System Administrator",
      joinedDate: "2020-11-30",
      lastLogin: "30 minutes ago",
      profilePhoto: "https://api.dicebear.com/7.x/avataaars/svg?seed=Robert",
      permissions: ["full_access", "user_management", "system_config"],
    },
    {
      id: 6,
      name: "Lisa Martinez",
      email: "lisa.m@university.edu",
      role: "student",
      status: "suspended",
      phone: "+1 (555) 678-9012",
      department: "Business",
      year: "2nd Year",
      joinedDate: "2023-01-25",
      lastLogin: "2 weeks ago",
      profilePhoto: "https://api.dicebear.com/7.x/avataaars/svg?seed=Lisa",
      courses: ["BUS101", "BUS202"],
      suspensionReason: "Violation of safety protocols",
    },
  ];

  // State management
  const [users, setUsers] = useState(initialUsers);
  const [filterRole, setFilterRole] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserDetails, setShowUserDetails] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Filter users
  const filteredUsers = users.filter((user) => {
    const matchesRole = filterRole === "all" || user.role === filterRole;
    const matchesStatus =
      filterStatus === "all" || user.status === filterStatus;
    const matchesSearch =
      searchQuery === "" ||
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.department.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesRole && matchesStatus && matchesSearch;
  });

  // Get role color
  const getRoleColor = (role) => {
    switch (role) {
      case "admin":
        return "#007AFF";
      case "faculty":
        return "#5856D6";
      case "staff":
        return "#FF9500";
      case "student":
        return "#34C759";
      default:
        return "#8E8E93";
    }
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "#34C759";
      case "inactive":
        return "#8E8E93";
      case "suspended":
        return "#FF3B30";
      case "pending":
        return "#FF9500";
      default:
        return "#8E8E93";
    }
  };

  // Format role name
  const formatRole = (role) => {
    return role.charAt(0).toUpperCase() + role.slice(1);
  };

  // Handle user status change
  const handleStatusChange = (userId, newStatus) => {
    setUsers(
      users.map((user) =>
        user.id === userId ? { ...user, status: newStatus } : user
      )
    );
  };

  // Handle user deletion
  const handleDeleteUser = () => {
    if (!selectedUser) return;
    setUsers(users.filter((user) => user.id !== selectedUser.id));
    setShowDeleteModal(false);
    setSelectedUser(null);
  };

  return (
    <div className="users-management-page">
      {/* Page Header */}
      <div className="page-header">
        <div className="header-left">
          <h1>👥 User Management</h1>
          <p>Manage campus users, roles, and permissions</p>
        </div>
        <div className="header-actions">
          <button className="btn btn-primary">👤 Add New User</button>
          <button className="btn btn-secondary">📥 Import Users</button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-section">
        <div className="stat-card">
          <div
            className="stat-icon"
            style={{ background: "#34C75920", color: "#34C759" }}
          >
            👥
          </div>
          <div className="stat-info">
            <h3>{users.length}</h3>
            <p>Total Users</p>
          </div>
        </div>
        <div className="stat-card">
          <div
            className="stat-icon"
            style={{ background: "#FF950020", color: "#FF9500" }}
          >
            🎓
          </div>
          <div className="stat-info">
            <h3>{users.filter((u) => u.role === "student").length}</h3>
            <p>Students</p>
          </div>
        </div>
        <div className="stat-card">
          <div
            className="stat-icon"
            style={{ background: "#5856D620", color: "#5856D6" }}
          >
            👨‍🏫
          </div>
          <div className="stat-info">
            <h3>{users.filter((u) => u.role === "faculty").length}</h3>
            <p>Faculty</p>
          </div>
        </div>
        <div className="stat-card">
          <div
            className="stat-icon"
            style={{ background: "#FF3B3020", color: "#FF3B30" }}
          >
            ⚠️
          </div>
          <div className="stat-info">
            <h3>{users.filter((u) => u.status === "suspended").length}</h3>
            <p>Suspended</p>
          </div>
        </div>
      </div>

      {/* Filters and Controls */}
      <div className="controls-section">
        <div className="filters-row">
          <div className="filter-group">
            <label>Filter by Role</label>
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Roles</option>
              <option value="student">Students</option>
              <option value="faculty">Faculty</option>
              <option value="staff">Staff</option>
              <option value="admin">Administrators</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Filter by Status</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="suspended">Suspended</option>
              <option value="pending">Pending</option>
            </select>
          </div>

          <div className="filter-group search-group">
            <label>Search Users</label>
            <div className="search-box">
              <input
                type="text"
                placeholder="Search by name, email, or department..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <span className="search-icon">🔍</span>
            </div>
          </div>
        </div>

        <div className="action-buttons">
          <button className="btn btn-outline">📋 Export List</button>
          <button className="btn btn-outline">🔄 Refresh</button>
        </div>
      </div>

      {/* Users Table */}
      <div className="users-table-container">
        <div className="table-header">
          <h3>Registered Users ({filteredUsers.length})</h3>
          <span className="table-info">Sorted by: Most Recent</span>
        </div>

        <div className="users-table">
          <div className="table-row header-row">
            <div className="col col-user">User</div>
            <div className="col col-role">Role</div>
            <div className="col col-department">Department</div>
            <div className="col col-status">Status</div>
            <div className="col col-last-login">Last Login</div>
            <div className="col col-actions">Actions</div>
          </div>

          {filteredUsers.map((user) => (
            <div key={user.id} className="table-row">
              <div className="col col-user">
                <div className="user-info">
                  <img
                    src={user.profilePhoto}
                    alt={user.name}
                    className="user-avatar"
                  />
                  <div className="user-details">
                    <h4>{user.name}</h4>
                    <p>{user.email}</p>
                    <span className="user-phone">{user.phone}</span>
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
                {user.year && <span className="year-badge">{user.year}</span>}
              </div>

              <div className="col col-department">
                <span className="department-name">{user.department}</span>
                {user.position && (
                  <span className="position">{user.position}</span>
                )}
              </div>

              <div className="col col-status">
                <div className="status-cell">
                  <div
                    className="status-dot"
                    style={{ background: getStatusColor(user.status) }}
                  ></div>
                  <span className="status-text">{user.status}</span>
                  <div className="status-actions">
                    <select
                      value={user.status}
                      onChange={(e) =>
                        handleStatusChange(user.id, e.target.value)
                      }
                      className="status-select"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="suspended">Suspended</option>
                      <option value="pending">Pending</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="col col-last-login">
                <span className="login-time">{user.lastLogin}</span>
              </div>

              <div className="col col-actions">
                <div className="action-buttons-cell">
                  <button
                    className="action-btn view-btn"
                    onClick={() => {
                      setSelectedUser(user);
                      setShowUserDetails(true);
                    }}
                    title="View Details"
                  >
                    👁️
                  </button>
                  <button
                    className="action-btn edit-btn"
                    onClick={() => {
                      setSelectedUser(user);
                      setShowEditModal(true);
                    }}
                    title="Edit User"
                  >
                    ✏️
                  </button>
                  <button
                    className="action-btn delete-btn"
                    onClick={() => {
                      setSelectedUser(user);
                      setShowDeleteModal(true);
                    }}
                    title="Delete User"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* User Details Modal */}
      {selectedUser && showUserDetails && (
        <div
          className="modal-overlay"
          onClick={() => setShowUserDetails(false)}
        >
          <div
            className="modal-container large"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h3>User Details</h3>
              <button
                className="modal-close"
                onClick={() => setShowUserDetails(false)}
              >
                ×
              </button>
            </div>
            <div className="modal-content">
              <div className="user-details-modal">
                {/* User Details Content */}
              </div>
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
                  <strong>{selectedUser.name}</strong>'s account?
                </p>
                <p className="warning-text">
                  This action cannot be undone. All user data will be
                  permanently removed.
                </p>
                <div className="modal-actions">
                  <button
                    className="btn btn-secondary"
                    onClick={() => setShowDeleteModal(false)}
                  >
                    Cancel
                  </button>
                  <button className="btn btn-danger" onClick={handleDeleteUser}>
                    Delete User
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
