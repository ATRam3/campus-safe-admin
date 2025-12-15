import React from "react";
import Modal from "./Modal";
import { AlertTriangle, X, Trash2 } from "lucide-react";

const DeleteConfirmationModal = ({ 
  isOpen, 
  onClose, 
  item, 
  type = "zone",
  onConfirm 
}) => {
  if (!item) return null;

  const getTitle = () => {
    switch (type) {
      case "zone":
        return "Danger Zone";
      case "incident":
        return "Incident Report";
      case "notification":
        return "Notification";
      default:
        return "Item";
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Confirm Delete"
      size="small"
    >
      <div className="delete-confirmation">
        <div className="warning-icon">
          <AlertTriangle size={48} />
        </div>
        <h4>Delete {getTitle()}</h4>
        <p>
          Are you sure you want to delete{" "}
          <strong>{item.name || item.title || item.zoneName}</strong>?
        </p>
        <p className="warning-text">
          {type === "zone" 
            ? "This action cannot be undone. All data related to this zone will be removed."
            : "This action cannot be undone."
          }
        </p>
        <div className="modal-actions">
          <button
            className="btn btn-secondary"
            onClick={onClose}
          >
            <X size={16} />
            Cancel
          </button>
          <button className="btn btn-danger" onClick={onConfirm}>
            <Trash2 size={16} />
            Delete {getTitle()}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteConfirmationModal;