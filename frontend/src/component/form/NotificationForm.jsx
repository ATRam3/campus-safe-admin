import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { NotificationSchema } from "../../validation/NotificationSchema";

const NotificationForm = ({ onSubmit, loading, onCancel }) => {
  return (
    <Formik
      initialValues={{
        title: "",
        content: "",
        status: "low",
        type: "alert",
        scheduleMode: "now",
        scheduledTime: "",
        targetAudience: "all",
      }}
      validationSchema={NotificationSchema}
      onSubmit={(values, formikHelpers) => {
        const payload = {
          ...values,
          scheduledTime:
            values.type === "announcement" && values.scheduleMode === "schedule"
              ? values.scheduledTime
              : null,
        };

        onSubmit(payload, formikHelpers);
        onCancel();
      }}
    >
      {({ values, setFieldValue }) => (
        <Form className="announcement-form">
          {/* Title */}
          <label>Title *</label>
          <Field name="title" />
          <ErrorMessage
            name="title"
            component="div"
            className="error-message"
          />

          {/* Content */}
          <label>Content *</label>
          <Field as="textarea" name="content" rows="6" />
          <ErrorMessage
            name="content"
            component="div"
            className="error-message"
          />

          {/* Type */}
          <label>Notification Type *</label>
          <Field as="select" name="type">
            <option value="alert">Alert</option>
            <option value="announcement">Announcement</option>
          </Field>
          <ErrorMessage name="type" component="div" className="error-message" />

          {/* Priority */}
          <label>Priority *</label>
          <Field as="select" name="status">
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </Field>
          <ErrorMessage
            name="status"
            component="div"
            className="error-message"
          />

          {/* Target Audience */}
          <label>Target Audience *</label>
          <Field as="select" name="targetAudience">
            <option value="all">All</option>
            <option value="students">Students</option>
            <option value="staff">Staff</option>
            <option value="faculty">Faculty</option>
          </Field>
          <ErrorMessage
            name="targetAudience"
            component="div"
            className="error-message"
          />

          {/* Delivery Mode (ONLY for announcements) */}
          {values.type === "announcement" && (
            <>
              <label>Delivery *</label>
              <div className="radio-group">
                <label>
                  <Field type="radio" name="scheduleMode" value="now" />
                  Send Now
                </label>

                <label>
                  <Field type="radio" name="scheduleMode" value="schedule" />
                  Schedule
                </label>
              </div>
              <ErrorMessage
                name="scheduleMode"
                component="div"
                className="error-message"
              />
            </>
          )}

          {/* Scheduled Time (ONLY if scheduled) */}
          {values.type === "announcement" &&
            values.scheduleMode === "schedule" && (
              <>
                <label>Scheduled Time *</label>
                <input
                  type="datetime-local"
                  name="scheduledTime"
                  value={values.scheduledTime}
                  onChange={(e) =>
                    setFieldValue("scheduledTime", e.target.value)
                  }
                />
                <ErrorMessage
                  name="scheduledTime"
                  component="div"
                  className="error-message"
                />
              </>
            )}

          {/* Submit + Cancel buttons */}
          <div style={{ display: "flex", gap: "10px", marginTop: "1rem" }}>
            <button
              style={{ display: "flex", width: "100%" }}
              type="button"
              className="btn btn-secondary"
              onClick={onCancel}
            >
              Cancel
            </button>

            <button
              type="submit"
              style={{ display: "flex", width: "100%" }}
              className="btn btn-primary"
              disabled={loading}
            >
              {loading
                ? "Sending..."
                : values.type === "alert"
                ? "🚨 Send Alert"
                : values.scheduleMode === "schedule"
                ? "⏰ Schedule Announcement"
                : "📢 Send Announcement"}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default NotificationForm;
