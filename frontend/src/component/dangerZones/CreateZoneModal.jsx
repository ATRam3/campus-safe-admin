import React from "react";
import Modal from "../shared/Modal";
import DangerZoneForm from "../form/DangerZoneForm";

const CreateZoneModal = ({
  isOpen,
  onClose,
  selectedLocation,
  onSubmit,
  onShowMapModal,
  loading,
  getSeverityColor
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create New Danger Zone"
      size="large"
    >
      <DangerZoneForm
        selectedLocation={selectedLocation}
        onSubmit={onSubmit}
        onCancel={onClose}
        onShowMapModal={onShowMapModal}
        loading={loading}
        getSeverityColor={getSeverityColor}
      />
    </Modal>
  );
};

export default CreateZoneModal;