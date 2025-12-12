/* import React, { useState } from "react";
import "../css/Settings.css";

const Settings = ({ onClose }) => {
  // Admin data (would come from backend in real app)
  const [adminData, setAdminData] = useState({
    name: "Campus Security Admin",
    email: "admin@campus.edu",
    profilePhoto: "https://api.dicebear.com/7.x/avataaars/svg?seed=Admin",
    phone: "+1 (555) 987-6543",
    department: "Security Department",
    role: "Administrator",
    joinedDate: "2023-01-15",
    notifications: {
      email: true,
      push: true,
      sms: false,
    },
  });

  // Help guide sections
  const helpSections = [
    {
      id: 1,
      title: "Getting Started",
      content:
        "Welcome to Safe Campus Admin Portal. This guide will help you navigate through all features.",
      items: [
        "Access all features from the sidebar",
        "Check notifications from the top bar",
        "Use quick actions for emergencies",
        "Review analytics for insights",
      ],
    },
    {
      id: 2,
      title: "Danger Zone Management",
      content: "How to effectively manage campus danger zones:",
      items: [
        "Create zones by clicking on the map",
        "Set severity levels (Low, Medium, High)",
        "Link incidents to specific zones",
        "Monitor incident frequency",
        "Update zone status as needed",
      ],
    },
    {
      id: 3,
      title: "Panic Alerts Response",
      content: "Steps to handle panic alerts efficiently:",
      items: [
        "Immediately view alert location on map",
        "Check user details and emergency contact",
        "Dispatch security team if needed",
        "Update alert status (Active → Responded → Resolved)",
        "Document actions taken",
      ],
    },
    {
      id: 4,
      title: "User Management",
      content: "Managing campus user accounts:",
      items: [
        "Add new users with appropriate roles",
        "Suspend accounts for safety violations",
        "Update user information as needed",
        "Export user lists for reporting",
        "Set notification preferences",
      ],
    },
    {
      id: 5,
      title: "Announcements & Communication",
      content: "Sending effective campus-wide announcements:",
      items: [
        "Craft clear, concise messages",
        "Select appropriate audience",
        "Schedule announcements for optimal timing",
        "Track open and click rates",
        "Use attachments for detailed information",
      ],
    },
    {
      id: 6,
      title: "Analytics & Reporting",
      content: "Understanding safety metrics:",
      items: [
        "Monitor incident trends over time",
        "Identify high-risk zones",
        "Track response times",
        "Generate monthly safety reports",
        "Export data for external analysis",
      ],
    },
  ];

  // Active help section
  const [activeSection, setActiveSection] = useState(helpSections[0].id);

  // Edit mode
  const [editMode, setEditMode] = useState(false);
  const [editedData, setEditedData] = useState({ ...adminData });

  // Handle save changes
  const handleSaveChanges = () => {
    setAdminData(editedData);
    setEditMode(false);
    // Here you would typically make an API call
  };

  return (
    <div className="modal-overlay settings-modal-overlay" onClick={onClose}>
      <div
        className="modal-container xlarge"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h3>⚙️ Settings & Help Guide</h3>
          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="modal-content">
          <div className="settings-container">
            <div className="settings-columns">
              <div className="left-column">
                <div className="profile-section">
                  <div className="profile-header">
                    <h4>👤 Admin Profile</h4>
                    <button
                      className="edit-profile-btn"
                      onClick={() => {
                        setEditMode(!editMode);
                        setEditedData({ ...adminData });
                      }}
                    >
                      {editMode ? "Cancel" : "✏️ Edit"}
                    </button>
                  </div>

                  <div className="profile-content">
                    <div className="profile-avatar-section">
                      <img
                        src={adminData.profilePhoto}
                        alt="Admin"
                        className="profile-avatar"
                      />
                      {editMode && (
                        <button className="change-photo-btn">
                          📷 Change Photo
                        </button>
                      )}
                    </div>

                    {editMode ? (
                      <div className="edit-form">
                        <div className="form-group">
                          <label>Full Name</label>
                          <input
                            type="text"
                            value={editedData.name}
                            onChange={(e) =>
                              setEditedData({
                                ...editedData,
                                name: e.target.value,
                              })
                            }
                          />
                        </div>

                        <div className="form-group">
                          <label>Email Address</label>
                          <input
                            type="email"
                            value={editedData.email}
                            onChange={(e) =>
                              setEditedData({
                                ...editedData,
                                email: e.target.value,
                              })
                            }
                          />
                        </div>

                        <div className="form-group">
                          <label>Phone Number</label>
                          <input
                            type="tel"
                            value={editedData.phone}
                            onChange={(e) =>
                              setEditedData({
                                ...editedData,
                                phone: e.target.value,
                              })
                            }
                          />
                        </div>

                        <div className="form-group">
                          <label>Department</label>
                          <input
                            type="text"
                            value={editedData.department}
                            onChange={(e) =>
                              setEditedData({
                                ...editedData,
                                department: e.target.value,
                              })
                            }
                          />
                        </div>

                        <div className="notifications-section">
                          <h5>🔔 Notification Preferences</h5>
                          <div className="notification-options">
                            <label className="checkbox-label">
                              <input
                                type="checkbox"
                                checked={editedData.notifications.email}
                                onChange={(e) =>
                                  setEditedData({
                                    ...editedData,
                                    notifications: {
                                      ...editedData.notifications,
                                      email: e.target.checked,
                                    },
                                  })
                                }
                              />
                              <span>Email Notifications</span>
                            </label>

                            <label className="checkbox-label">
                              <input
                                type="checkbox"
                                checked={editedData.notifications.push}
                                onChange={(e) =>
                                  setEditedData({
                                    ...editedData,
                                    notifications: {
                                      ...editedData.notifications,
                                      push: e.target.checked,
                                    },
                                  })
                                }
                              />
                              <span>Push Notifications</span>
                            </label>

                            <label className="checkbox-label">
                              <input
                                type="checkbox"
                                checked={editedData.notifications.sms}
                                onChange={(e) =>
                                  setEditedData({
                                    ...editedData,
                                    notifications: {
                                      ...editedData.notifications,
                                      sms: e.target.checked,
                                    },
                                  })
                                }
                              />
                              <span>SMS Alerts</span>
                            </label>
                          </div>
                        </div>

                        <div className="form-actions">
                          <button
                            className="btn btn-secondary"
                            onClick={() => setEditMode(false)}
                          >
                            Cancel
                          </button>
                          <button
                            className="btn btn-primary"
                            onClick={handleSaveChanges}
                          >
                            💾 Save Changes
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="profile-details">
                        <div className="detail-row">
                          <span className="detail-label">Name:</span>
                          <span className="detail-value">{adminData.name}</span>
                        </div>
                        <div className="detail-row">
                          <span className="detail-label">Email:</span>
                          <span className="detail-value">
                            {adminData.email}
                          </span>
                        </div>
                        <div className="detail-row">
                          <span className="detail-label">Phone:</span>
                          <span className="detail-value">
                            {adminData.phone}
                          </span>
                        </div>
                        <div className="detail-row">
                          <span className="detail-label">Department:</span>
                          <span className="detail-value">
                            {adminData.department}
                          </span>
                        </div>
                        <div className="detail-row">
                          <span className="detail-label">Role:</span>
                          <span className="detail-value">{adminData.role}</span>
                        </div>
                        <div className="detail-row">
                          <span className="detail-label">Joined:</span>
                          <span className="detail-value">
                            {adminData.joinedDate}
                          </span>
                        </div>

                        <div className="notifications-display">
                          <h5>🔔 Notification Settings</h5>
                          <div className="notification-status">
                            {adminData.notifications.email && (
                              <span className="status-badge active">
                                📧 Email
                              </span>
                            )}
                            {adminData.notifications.push && (
                              <span className="status-badge active">
                                📱 Push
                              </span>
                            )}
                            {adminData.notifications.sms && (
                              <span className="status-badge active">
                                📞 SMS
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="quick-settings">
                  <h4>⚡ Quick Actions</h4>
                  <div className="quick-actions-grid">
                    <button className="quick-action-btn">
                      🔄 Reset Password
                    </button>
                    <button className="quick-action-btn">
                      📧 Test Notifications
                    </button>
                    <button className="quick-action-btn">
                      📊 View Activity Log
                    </button>
                    <button className="quick-action-btn">
                      🛡️ Security Settings
                    </button>
                  </div>
                </div>
              </div>
              <div className="right-column">
                <div className="help-guide-section">
                  <div className="help-header">
                    <h4>❓ Help & Documentation</h4>
                    <div className="search-help">
                      <input type="text" placeholder="Search help topics..." />
                      <span className="search-icon">🔍</span>
                    </div>
                  </div>

                  <div className="help-tabs">
                    {helpSections.map((section) => (
                      <button
                        key={section.id}
                        className={`help-tab ${
                          activeSection === section.id ? "active" : ""
                        }`}
                        onClick={() => setActiveSection(section.id)}
                      >
                        {section.title}
                      </button>
                    ))}
                  </div>

                  <div className="help-content">
                    {helpSections.map(
                      (section) =>
                        activeSection === section.id && (
                          <div
                            key={section.id}
                            className="help-section-content"
                          >
                            <h3>{section.title}</h3>
                            <p className="section-description">
                              {section.content}
                            </p>

                            <div className="guide-items">
                              {section.items.map((item, index) => (
                                <div key={index} className="guide-item">
                                  <div className="item-number">{index + 1}</div>
                                  <div className="item-content">
                                    <h5>{item.split(":")[0]}</h5>
                                    {item.split(":")[1] && (
                                      <p>{item.split(":")[1]}</p>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>

                            <div className="help-actions">
                              <button className="btn btn-outline">
                                📖 Read Full Guide
                              </button>
                              <button className="btn btn-primary">
                                🎥 Watch Tutorial
                              </button>
                            </div>
                          </div>
                        )
                    )}
                  </div>
                </div>

                <div className="support-section">
                  <h4>🆘 Need More Help?</h4>
                  <div className="support-options">
                    <div className="support-option">
                      <div className="option-icon">📧</div>
                      <div>
                        <h5>Email Support</h5>
                        <p>support@campus.edu</p>
                      </div>
                    </div>
                    <div className="support-option">
                      <div className="option-icon">📞</div>
                      <div>
                        <h5>Phone Support</h5>
                        <p>+1 (555) 123-HELP</p>
                      </div>
                    </div>
                    <div className="support-option">
                      <div className="option-icon">💬</div>
                      <div>
                        <h5>Live Chat</h5>
                        <p>Available 24/7</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
 */
import React from "react";

const Settings = () => {
  return <div></div>;
};

export default Settings;
