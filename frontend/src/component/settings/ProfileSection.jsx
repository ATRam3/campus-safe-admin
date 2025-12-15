import React, { useState } from 'react';
import ProfileForm from '../form/ProfileForm';
import "../../css/Profile.css"

const ProfileSection = ({ adminData, setAdminData }) => {
    const [editMode, setEditMode] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (values, { setSubmitting }) => {
        setIsSubmitting(true);

        const updatedData = {
            ...adminData,
            ...values
        };
        const submitedData = {
            fullName: updatedData.fullName,
            email: updatedData.email,
            phone: updatedData.phone
        }

        try {
            // await new api.post("/profile", form);

            setAdminData(updatedData);
            setEditMode(false);

            console.log("submitting...")
            localStorage.setItem("admin", JSON.stringify(submitedData));
        } catch (error) {
            console.error('Failed to update profile:', error);
        } finally {
            setIsSubmitting(false);
            setSubmitting(false);
        }
    };

    const handleCancel = () => {
        setEditMode(false);
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <div className="profile-section">
            <div className="profile-header">
                <div className="profile-header-left">
                    <h4>👤 Admin Profile</h4>
                    <span className="profile-role-badge">
                        {adminData.role || 'Administrator'}
                    </span>
                </div>

                <button
                    className="edit-profile-btn"
                    onClick={() => setEditMode(!editMode)}
                    disabled={isSubmitting}
                >
                    {editMode ? (
                        <>
                            <span className="btn-icon">✕</span>
                            Cancel Edit
                        </>
                    ) : (
                        <>
                            <span className="btn-icon">✏️</span>
                            Edit Profile
                        </>
                    )}
                </button>
            </div>

            <div className="profile-content">
                <div className="profile-avatar-section">
                    <div className="avatar-wrapper">
                        <div className="avatar-placeholder">
                            {adminData.fullName?.charAt(0) || 'A'}
                        </div>
                    </div>
                </div>

                <div className="profile-details-container">
                    {editMode ? (
                        <ProfileForm
                            adminData={adminData}
                            onCancel={handleCancel}
                            onSubmit={handleSubmit}
                            isSubmitting={isSubmitting}
                        />
                    ) : (
                        <>
                            <div className="profile-info-grid">
                                <div className="info-card">
                                    <h5>Personal Information</h5>
                                    <div className="info-item">
                                        <span className="info-label">Full Name:</span>
                                        <span className="info-value">{adminData.fullName || 'Not set'}</span>
                                    </div>
                                    <div className="info-item">
                                        <span className="info-label">Email:</span>
                                        <span className="info-value">{adminData.email}</span>
                                    </div>
                                    <div className="info-item">
                                        <span className="info-label">Phone:</span>
                                        <span className="info-value">{adminData.phone || 'Not provided'}</span>
                                    </div>
                                </div>

                                {adminData.department && (
                                    <div className="info-card">
                                        <h5>Work Information</h5>
                                        <div className="info-item">
                                            <span className="info-label">Department:</span>
                                            <span className="info-value">{adminData.department}</span>
                                        </div>
                                        <div className="info-item">
                                            <span className="info-label">Role:</span>
                                            <span className="info-value">{adminData.role || 'Admin'}</span>
                                        </div>
                                        <div className="info-item">
                                            <span className="info-label">Employee ID:</span>
                                            <span className="info-value">{adminData.employeeId || 'N/A'}</span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="profile-metadata">
                                <div className="metadata-item">
                                    <span className="metadata-label">Account Created:</span>
                                    <span className="metadata-value">
                                        {formatDate(adminData.createdAt)}
                                    </span>
                                </div>
                                <div className="metadata-item">
                                    <span className="metadata-label">Last Updated:</span>
                                    <span className="metadata-value">
                                        {formatDate(adminData.updatedAt) || 'Never'}
                                    </span>
                                </div>
                                <div className="metadata-item">
                                    <span className="metadata-label">Status:</span>
                                    <span className="status-badge active">
                                        ● Active
                                    </span>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProfileSection;