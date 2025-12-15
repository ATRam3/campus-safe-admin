import React from "react";
import NotificationForm from "../form/NotificationForm";

const CreateNotificationModal = ({ isOpen, loading, onSubmit, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      className="modal-overlay"
      onClick={onClose}
    >
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Create Notification</h3>
          <button
            className="modal-close"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        <div className="modal-content">
          <NotificationForm
            onSubmit={onSubmit}
            loading={loading}
            onCancel={onClose}
          />
        </div>
      </div>
    </div>
  );
};

export default CreateNotificationModal;