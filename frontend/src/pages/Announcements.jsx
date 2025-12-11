import React, { useState } from "react";
import "../css/Announcements.css";

const Announcements = () => {
  // Sample announcements data
  const initialAnnouncements = [
    {
      id: 1,
      title: "Campus Safety Guidelines Update",
      content:
        "All students must attend the mandatory safety workshop next Friday. The workshop will cover emergency procedures, campus safety zones, and how to use the panic alert system.",
      audience: "all_students",
      status: "sent",
      date: "2024-01-22",
      time: "10:30 AM",
      sender: "Security Office",
      sentCount: 2450,
      openedCount: 1987,
      attachments: ["safety_guidelines.pdf"],
    },
    {
      id: 2,
      title: "Emergency Drill Scheduled",
      content:
        "There will be a campus-wide emergency drill this Wednesday at 2 PM. Please follow all instructions from security personnel. This drill will test our new evacuation procedures.",
      audience: "all_users",
      status: "scheduled",
      date: "2024-01-25",
      time: "2:00 PM",
      sender: "Safety Committee",
      sentCount: 3200,
      openedCount: 0,
      attachments: ["drill_procedures.pdf", "evacuation_map.png"],
    },
    {
      id: 3,
      title: "New Safety Features in Mobile App",
      content:
        "We've added new safety features to the campus safety app: 1) Live location sharing during emergencies 2) Quick access to security contacts 3) Campus safety zone alerts. Please update your app to version 3.2.",
      audience: "mobile_users",
      status: "sent",
      date: "2024-01-20",
      time: "3:15 PM",
      sender: "IT Department",
      sentCount: 1800,
      openedCount: 1520,
      attachments: ["app_update_guide.pdf"],
    },
    {
      id: 4,
      title: "Weather Alert: Heavy Rain Warning",
      content:
        "Heavy rainfall expected tomorrow. Please avoid low-lying areas on campus and report any flooding immediately. Campus transport will operate on a modified schedule.",
      audience: "all_users",
      status: "sent",
      date: "2024-01-19",
      time: "4:45 PM",
      sender: "Weather Alert System",
      sentCount: 3100,
      openedCount: 2850,
      attachments: [],
    },
    {
      id: 5,
      title: "Self-Defense Workshop Registration Open",
      content:
        "Free self-defense workshops are now open for registration. Learn essential safety skills from certified instructors. Limited spots available. Register through the campus portal.",
      audience: "students",
      status: "draft",
      date: "2024-01-18",
      time: "11:20 AM",
      sender: "Student Affairs",
      sentCount: 0,
      openedCount: 0,
      attachments: ["workshop_schedule.pdf", "registration_form.docx"],
    },
  ];

  // State management
  const [announcements, setAnnouncements] = useState(initialAnnouncements);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(
    initialAnnouncements[0]
  );

  // Form state
  const [showNewAnnouncement, setShowNewAnnouncement] = useState(false);
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: "",
    content: "",
    audience: "all_users",
    scheduleDate: "",
    scheduleTime: "",
    immediateSend: true,
    attachments: [],
  });

  // Filter announcements
  const filteredAnnouncements = announcements.filter((announcement) => {
    const matchesStatus =
      filterStatus === "all" || announcement.status === filterStatus;
    const matchesSearch =
      searchQuery === "" ||
      announcement.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      announcement.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Get audience label
  const getAudienceLabel = (audience) => {
    const labels = {
      all_users: "All Users",
      all_students: "All Students",
      mobile_users: "Mobile App Users",
      students: "Students Only",
      staff: "Staff Only",
      faculty: "Faculty Only",
    };
    return labels[audience] || audience;
  };

  // Get status badge color
  const getStatusColor = (status) => {
    switch (status) {
      case "sent":
        return "#34C759";
      case "scheduled":
        return "#FF9500";
      case "draft":
        return "#8E8E93";
      default:
        return "#8E8E93";
    }
  };

  // Handle sending new announcement
  const handleSendAnnouncement = () => {
    if (!newAnnouncement.title.trim() || !newAnnouncement.content.trim()) {
      alert("Please fill in all required fields");
      return;
    }

    const newId = Math.max(...announcements.map((a) => a.id)) + 1;
    const now = new Date();

    const newAnnouncementObj = {
      id: newId,
      title: newAnnouncement.title,
      content: newAnnouncement.content,
      audience: newAnnouncement.audience,
      status: newAnnouncement.immediateSend ? "sent" : "scheduled",
      date: now.toISOString().split("T")[0],
      time: now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      sender: "Security Admin",
      sentCount: 0,
      openedCount: 0,
      attachments: newAnnouncement.attachments,
    };

    // If scheduled, update date and time
    if (!newAnnouncement.immediateSend && newAnnouncement.scheduleDate) {
      newAnnouncementObj.date = newAnnouncement.scheduleDate;
      newAnnouncementObj.time = newAnnouncement.scheduleTime || "9:00 AM";
    }

    setAnnouncements([newAnnouncementObj, ...announcements]);
    setSelectedAnnouncement(newAnnouncementObj);
    setNewAnnouncement({
      title: "",
      content: "",
      audience: "all_users",
      scheduleDate: "",
      scheduleTime: "",
      immediateSend: true,
      attachments: [],
    });
    setShowNewAnnouncement(false);
  };

  // Handle file attachment
  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    const fileNames = files.map((file) => file.name);
    setNewAnnouncement({
      ...newAnnouncement,
      attachments: [...newAnnouncement.attachments, ...fileNames],
    });
  };

  // Remove attachment
  const removeAttachment = (index) => {
    const newAttachments = [...newAnnouncement.attachments];
    newAttachments.splice(index, 1);
    setNewAnnouncement({
      ...newAnnouncement,
      attachments: newAttachments,
    });
  };

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Get open rate
  const getOpenRate = (announcement) => {
    if (announcement.sentCount === 0) return 0;
    return Math.round(
      (announcement.openedCount / announcement.sentCount) * 100
    );
  };

  return (
    <div className="announcements-page">
      {/* Page Header */}
      <div className="page-header">
        <div className="header-left">
          <h1>📢 Announcements & Notifications</h1>
          <p>
            Send safety alerts, educational content, and important updates to
            campus users
          </p>
        </div>
        <div className="header-actions">
          <button
            className="btn btn-primary"
            onClick={() => setShowNewAnnouncement(true)}
          >
            ✉️ Create New Announcement
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-section">
        <div className="stats-card">
          <div
            className="stat-icon"
            style={{ background: "#007AFF20", color: "#007AFF" }}
          >
            📤
          </div>
          <div className="stat-info">
            <h3>{announcements.filter((a) => a.status === "sent").length}</h3>
            <p>Sent Announcements</p>
          </div>
        </div>
        <div className="stats-card">
          <div
            className="stat-icon"
            style={{ background: "#FF950020", color: "#FF9500" }}
          >
            ⏰
          </div>
          <div className="stat-info">
            <h3>
              {announcements.filter((a) => a.status === "scheduled").length}
            </h3>
            <p>Scheduled</p>
          </div>
        </div>

        <div className="stats-card">
          <div
            className="stat-icon"
            style={{ background: "#FF3B3020", color: "#FF3B30" }}
          >
            📝
          </div>
          <div className="stat-info">
            <h3>{announcements.filter((a) => a.status === "draft").length}</h3>
            <p>Drafts</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="announcements-content-grid">
        {/* Left Panel - Recent Announcements */}
        <div className="announcements-left-panel">
          <div className="panel-header">
            <h3>Recent Announcements</h3>
            <div className="controls">
              <div className="search-box">
                <input
                  type="text"
                  name=""
                  placeholder="Search announcements..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <span className="search-icon">🔍</span>
              </div>
              <select
                className="filter-select"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="sent">Sent</option>
                <option value="scheduled">Scheduled</option>
                <option value="draft">Draft</option>
              </select>
            </div>
          </div>

          <div className="announcements-list">
            {filteredAnnouncements.map((announcement) => (
              <div
                key={announcement.id}
                className={`announcement-item ${
                  selectedAnnouncement?.id === announcement.id ? "selected" : ""
                }`}
                onClick={() => setSelectedAnnouncement(announcement)}
              >
                <div className="announcement-header">
                  <h4>{announcement.title}</h4>
                  <span
                    className="status-badge"
                    style={{
                      background: getStatusColor(announcement.status) + "20",
                      color: getStatusColor(announcement.status),
                    }}
                  >
                    {announcement.status}
                  </span>
                </div>
                <p className="announcement-preview">
                  {announcement.content.substring(0, 100)}...
                </p>
                <div className="announcement-footer">
                  <span className="audience-badge">
                    👥 {getAudienceLabel(announcement.audience)}
                  </span>
                  <span className="date-info">
                    📅 {formatDate(announcement.date)} at {announcement.time}
                  </span>
                </div>
                {announcement.attachments.length > 0 && (
                  <div className="attachments-preview">
                    📎 {announcement.attachments.length} attachment(s)
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right Panel - Selected Announcement Details */}
        <div className="announcements-right-panel">
          {selectedAnnouncement ? (
            <div className="announcement-details">
              <div className="details-header">
                <div className="title-section">
                  <h2>{selectedAnnouncement.title}</h2>
                  <div className="meta-info">
                    <span className="sender-info">
                      From: {selectedAnnouncement.sender}
                    </span>
                    <span className="date-info">
                      {formatDate(selectedAnnouncement.date)} at{" "}
                      {selectedAnnouncement.time}
                    </span>
                  </div>
                </div>
                <div className="status-section">
                  <div className="status-display">
                    <div
                      className="status-dot"
                      style={{
                        background: getStatusColor(selectedAnnouncement.status),
                      }}
                    ></div>
                    <span className="status-text">
                      {selectedAnnouncement.status.toUpperCase()}
                    </span>
                  </div>
                  <div className="audience-display">
                    👥 Sent to:{" "}
                    {getAudienceLabel(selectedAnnouncement.audience)}
                  </div>
                </div>
              </div>

              <div className="performance-stats">
                <div className="stat-box">
                  <div className="stat-label">Sent To</div>
                  <div className="stat-value">
                    {selectedAnnouncement.sentCount.toLocaleString()}
                  </div>
                </div>
              </div>

              <div className="content-section">
                <h3>Message Content</h3>
                <div className="message-content">
                  {selectedAnnouncement.content
                    .split("\n")
                    .map((paragraph, index) => (
                      <p key={index}>{paragraph}</p>
                    ))}
                </div>
              </div>

              {selectedAnnouncement.attachments.length > 0 && (
                <div className="attachments-section">
                  <h3>
                    📎 Attachments ({selectedAnnouncement.attachments.length})
                  </h3>
                  <div className="attachments-list">
                    {selectedAnnouncement.attachments.map((file, index) => (
                      <div key={index} className="attachment-item">
                        <div className="file-icon">
                          {file.endsWith(".pdf")
                            ? "📄"
                            : file.endsWith(".docx")
                            ? "📝"
                            : file.endsWith(".png") || file.endsWith(".jpg")
                            ? "🖼️"
                            : "📎"}
                        </div>
                        <span className="file-name">{file}</span>
                        <button className="download-btn">⬇️</button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="action-buttons">
                {selectedAnnouncement.status === "draft" && (
                  <>
                    <button className="btn btn-secondary">✏️ Edit Draft</button>
                    <button className="btn btn-primary">📤 Send Now</button>
                  </>
                )}
                {selectedAnnouncement.status === "scheduled" && (
                  <>
                    <button className="btn btn-secondary">⏰ Reschedule</button>
                    <button className="btn btn-primary">📤 Send Now</button>
                  </>
                )}
                {selectedAnnouncement.status === "sent" && (
                  <button className="btn btn-secondary">
                    📊 View Analytics
                  </button>
                )}
                <button className="btn btn-outline">🗑️ Delete</button>
              </div>
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-icon">📢</div>
              <h3>No Announcement Selected</h3>
              <p>
                Select an announcement from the list to view details, or create
                a new one.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* New Announcement Modal */}
      {showNewAnnouncement && (
        <div
          className="modal-overlay"
          onClick={() => setShowNewAnnouncement(false)}
        >
          <div
            className="modal-container large"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h3>Create New Announcement</h3>
              <button
                className="modal-close"
                onClick={() => setShowNewAnnouncement(false)}
              >
                ×
              </button>
            </div>
            <div className="modal-content">
              <div className="announcement-form">
                <div className="form-group">
                  <label>Announcement Title *</label>
                  <input
                    type="text"
                    placeholder="e.g., Safety Alert: Weather Warning"
                    value={newAnnouncement.title}
                    onChange={(e) =>
                      setNewAnnouncement({
                        ...newAnnouncement,
                        title: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Audience *</label>
                    <select
                      value={newAnnouncement.audience}
                      onChange={(e) =>
                        setNewAnnouncement({
                          ...newAnnouncement,
                          audience: e.target.value,
                        })
                      }
                    >
                      <option value="all_users">All Campus Users</option>
                      <option value="all_students">All Students</option>
                      <option value="students">Students Only</option>
                      <option value="staff">Staff Only</option>
                      <option value="faculty">Faculty Only</option>
                      <option value="mobile_users">Mobile App Users</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Sending Option</label>
                    <div className="radio-group">
                      <label className="radio-option">
                        <input
                          type="radio"
                          checked={newAnnouncement.immediateSend}
                          onChange={() =>
                            setNewAnnouncement({
                              ...newAnnouncement,
                              immediateSend: true,
                            })
                          }
                        />
                        <span>Send Immediately</span>
                      </label>
                      <label className="radio-option">
                        <input
                          type="radio"
                          checked={!newAnnouncement.immediateSend}
                          onChange={() =>
                            setNewAnnouncement({
                              ...newAnnouncement,
                              immediateSend: false,
                            })
                          }
                        />
                        <span>Schedule for Later</span>
                      </label>
                    </div>
                  </div>
                </div>

                {!newAnnouncement.immediateSend && (
                  <div className="form-row">
                    <div className="form-group">
                      <label>Schedule Date *</label>
                      <input
                        type="date"
                        value={newAnnouncement.scheduleDate}
                        onChange={(e) =>
                          setNewAnnouncement({
                            ...newAnnouncement,
                            scheduleDate: e.target.value,
                          })
                        }
                        min={new Date().toISOString().split("T")[0]}
                      />
                    </div>
                    <div className="form-group">
                      <label>Schedule Time *</label>
                      <input
                        type="time"
                        value={newAnnouncement.scheduleTime}
                        onChange={(e) =>
                          setNewAnnouncement({
                            ...newAnnouncement,
                            scheduleTime: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                )}

                <div className="form-group">
                  <label>Message Content *</label>
                  <textarea
                    value={newAnnouncement.content}
                    onChange={(e) =>
                      setNewAnnouncement({
                        ...newAnnouncement,
                        content: e.target.value,
                      })
                    }
                    placeholder="Write your announcement message here. You can include safety instructions, educational content, or important updates..."
                    rows="8"
                  />
                  <div className="content-tips">
                    <strong>Tips for effective announcements:</strong>
                    <ul>
                      <li>Start with the most important information</li>
                      <li>Use clear, concise language</li>
                      <li>Include actionable steps if needed</li>
                      <li>Add contact information for questions</li>
                    </ul>
                  </div>
                </div>

                <div className="form-group">
                  <label>Attachments</label>
                  <div className="file-upload-area">
                    <input
                      type="file"
                      id="file-upload"
                      multiple
                      onChange={handleFileUpload}
                      style={{ display: "none" }}
                    />
                    <label htmlFor="file-upload" className="file-upload-btn">
                      📎 Add Files
                    </label>
                    <span className="file-hint">
                      PDF, DOC, JPG, PNG up to 10MB each
                    </span>
                  </div>

                  {newAnnouncement.attachments.length > 0 && (
                    <div className="attachments-preview">
                      {newAnnouncement.attachments.map((file, index) => (
                        <div key={index} className="attachment-preview-item">
                          <span className="file-name">{file}</span>
                          <button
                            type="button"
                            className="remove-file"
                            onClick={() => removeAttachment(index)}
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="modal-actions">
                  <button
                    className="btn btn-secondary"
                    onClick={() => setShowNewAnnouncement(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="btn btn-primary"
                    onClick={handleSendAnnouncement}
                    disabled={
                      !newAnnouncement.title.trim() ||
                      !newAnnouncement.content.trim()
                    }
                  >
                    {newAnnouncement.immediateSend
                      ? "📤 Send Announcement"
                      : "⏰ Schedule Announcement"}
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

export default Announcements;
