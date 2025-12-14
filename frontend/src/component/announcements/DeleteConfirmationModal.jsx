import React from "react";

const DeleteConfirmationModal = ({ isOpen, loading, notification, onConfirm, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      className="modal-overlay"
      onClick={onClose}
    >
      <div
        className="modal-container small"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h3>Delete Notification</h3>
          <button
            className="modal-close"
            onClick={onClose}
          >
            ×
          </button>
        </div>
        <div className="modal-content">
          <div className="delete-confirmation">
            <div className="warning-icon">⚠️</div>
            <h4>Are you sure?</h4>
            <p>This will permanently delete the notification:</p>
            <div className="announcement-to-delete">
              <strong>{notification?.title}</strong>
              <p>{notification?.content.substring(0, 100)}...</p>
            </div>
            <p className="warning-text">This action cannot be undone.</p>
            <div className="modal-actions">
              <button
                className="btn btn-secondary"
                onClick={onClose}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                className="btn btn-danger"
                onClick={onConfirm}
                disabled={loading}
              >
                {loading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;