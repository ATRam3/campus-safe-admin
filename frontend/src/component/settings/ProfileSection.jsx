import React, { useState } from "react";

const ProfileSection = ({ adminData, setAdminData }) => {
    const [editMode, setEditMode] = useState(false);
    const [editedData, setEditedData] = useState({ ...adminData });

    const handleSaveChanges = () => {
        setAdminData(editedData);
        setEditMode(false);
        // Here you would typically make an API call
    };

    return (
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
                    <EditForm
                        editedData={editedData}
                        setEditedData={setEditedData}
                        onCancel={() => setEditMode(false)}
                        onSave={handleSaveChanges}
                    />
                ) : (
                    <ProfileDetails adminData={adminData} />
                )}
            </div>
        </div>
    );
};

const EditForm = ({ editedData, setEditedData, onCancel, onSave }) => {
    return (
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

            <NotificationSettings
                notifications={editedData.notifications}
                onChange={(updatedNotifications) =>
                    setEditedData({
                        ...editedData,
                        notifications: updatedNotifications,
                    })
                }
            />

            <div className="form-actions">
                <button className="btn btn-secondary" onClick={onCancel}>
                    Cancel
                </button>
                <button className="btn btn-primary" onClick={onSave}>
                    💾 Save Changes
                </button>
            </div>
        </div>
    );
};

const NotificationSettings = ({ notifications, onChange }) => {
    return (
        <div className="notifications-section">
            <h5>🔔 Notification Preferences</h5>
            <div className="notification-options">
                <label className="checkbox-label">
                    <input
                        type="checkbox"
                        checked={notifications.email}
                        onChange={(e) =>
                            onChange({
                                ...notifications,
                                email: e.target.checked,
                            })
                        }
                    />
                    <span>Email Notifications</span>
                </label>

                <label className="checkbox-label">
                    <input
                        type="checkbox"
                        checked={notifications.push}
                        onChange={(e) =>
                            onChange({
                                ...notifications,
                                push: e.target.checked,
                            })
                        }
                    />
                    <span>Push Notifications</span>
                </label>

                <label className="checkbox-label">
                    <input
                        type="checkbox"
                        checked={notifications.sms}
                        onChange={(e) =>
                            onChange({
                                ...notifications,
                                sms: e.target.checked,
                            })
                        }
                    />
                    <span>SMS Alerts</span>
                </label>
            </div>
        </div>
    );
};

const ProfileDetails = ({ adminData }) => {
    return (
        <div className="profile-details">
            <div className="detail-row">
                <span className="detail-label">Name:</span>
                <span className="detail-value">{adminData.name}</span>
            </div>
            <div className="detail-row">
                <span className="detail-label">Email:</span>
                <span className="detail-value">{adminData.email}</span>
            </div>
            <div className="detail-row">
                <span className="detail-label">Phone:</span>
                <span className="detail-value">{adminData.phone}</span>
            </div>
            <div className="detail-row">
                <span className="detail-label">Department:</span>
                <span className="detail-value">{adminData.department}</span>
            </div>
            <div className="detail-row">
                <span className="detail-label">Role:</span>
                <span className="detail-value">{adminData.role}</span>
            </div>
            <div className="detail-row">
                <span className="detail-label">Joined:</span>
                <span className="detail-value">{adminData.joinedDate}</span>
            </div>

            <div className="notifications-display">
                <h5>🔔 Notification Settings</h5>
                <div className="notification-status">
                    {adminData.notifications.email && (
                        <span className="status-badge active">📧 Email</span>
                    )}
                    {adminData.notifications.push && (
                        <span className="status-badge active">📱 Push</span>
                    )}
                    {adminData.notifications.sms && (
                        <span className="status-badge active">📞 SMS</span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProfileSection;