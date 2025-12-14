import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { ZoneValidationSchema } from "../../validation/ZoneSchema";
import {
  Type,
  AlertOctagon,
  AlertTriangle,
  AlertCircle,
  Flag,
  Radio,
  MapPin,
  Map,
  FileText,
  X,
  Check,
} from "lucide-react";

const DangerZoneForm = ({
  selectedLocation,
  onSubmit,
  onCancel,
  onShowMapModal,
  loading,
  getSeverityColor
}) => {
  return (
    <Formik
      initialValues={{
        name: "",
        severity: "medium",
        status: "active",
        description: "",
        radius: 100,
        location: selectedLocation,
      }}
      validationSchema={ZoneValidationSchema}
      onSubmit={onSubmit}
    >
      {({ values, setFieldValue, isSubmitting, errors, touched }) => (
        <Form className="modal-form">
          {/* Zone Name */}
          <div className="form-group">
            <label>
              <Type size={16} />
              Zone Name *
            </label>
            <Field
              type="text"
              name="name"
              placeholder="Enter zone name"
              className={errors.name && touched.name ? "error-field" : ""}
            />
            <ErrorMessage
              name="name"
              component="div"
              className="error-message"
            />
          </div>

          {/* Severity Level */}
          <div className="form-group">
            <label>Severity Level *</label>
            <div className="severity-options" role="group">
              {["low", "medium", "high"].map((level) => (
                <button
                  key={level}
                  type="button"
                  className={`severity-option ${values.severity === level ? "selected" : ""
                    }`}
                  onClick={() => setFieldValue("severity", level)}
                  style={{
                    background:
                      values.severity === level
                        ? getSeverityColor(level)
                        : getSeverityColor(level) + "20",
                    color:
                      values.severity === level
                        ? "white"
                        : getSeverityColor(level),
                  }}
                >
                  {level === "high" ? (
                    <AlertOctagon size={16} />
                  ) : level === "medium" ? (
                    <AlertTriangle size={16} />
                  ) : (
                    <AlertCircle size={16} />
                  )}
                  {level.charAt(0).toUpperCase() + level.slice(1)}
                </button>
              ))}
            </div>
            <ErrorMessage
              name="severity"
              component="div"
              className="error-message"
            />
          </div>

          {/* Status */}
          <div className="form-group">
            <label>
              <Flag size={16} />
              Status *
            </label>
            <Field as="select" name="status">
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="under_review">Under Review</option>
            </Field>
            <ErrorMessage
              name="status"
              component="div"
              className="error-message"
            />
          </div>

          {/* Radius */}
          <div className="form-group">
            <label>
              <Radio size={16} />
              Radius (meters) *
            </label>
            <Field
              type="number"
              name="radius"
              min="10"
              max="1000"
              className={
                errors.radius && touched.radius ? "error-field" : ""
              }
            />
            <ErrorMessage
              name="radius"
              component="div"
              className="error-message"
            />
          </div>

          {/* Location */}
          <div className="form-group">
            <label>
              <MapPin size={16} />
              Location *
            </label>
            <div className="location-selector">
              <div className="location-info">
                <span>Lat: {selectedLocation.lat.toFixed(6)}</span>
                <span>Lng: {selectedLocation.lng.toFixed(6)}</span>
              </div>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onShowMapModal}
              >
                <Map size={16} />
                Select on Map
              </button>
            </div>
            <small className="hint">
              Click the button to select location on map
            </small>
            <Field type="hidden" name="location" value={JSON.stringify(selectedLocation)} />
            <ErrorMessage
              name="location"
              component="div"
              className="error-message"
            />
          </div>

          {/* Description */}
          <div className="form-group">
            <label>
              <FileText size={16} />
              Description *
            </label>
            <Field
              as="textarea"
              name="description"
              placeholder="Describe why this area is dangerous..."
              rows="4"
              className={
                errors.description && touched.description
                  ? "error-field"
                  : ""
              }
            />
            <ErrorMessage
              name="description"
              component="div"
              className="error-message"
            />
          </div>

          <div className="modal-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onCancel}
              disabled={isSubmitting || loading}
            >
              <X size={16} />
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting || loading}
            >
              <Check size={16} />
              {(isSubmitting || loading) ? "Creating..." : "Create Zone"}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default DangerZoneForm;