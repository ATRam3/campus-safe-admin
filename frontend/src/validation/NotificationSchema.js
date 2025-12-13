import * as Yup from "yup";

export const NotificationSchema = Yup.object({
  title: Yup.string().required("Title is required"),
  content: Yup.string().required("Content is required"),

  type: Yup.string().oneOf(["alert", "announcement"]).required(),

  status: Yup.string().oneOf(["low", "medium", "high"]).required(),

  targetAudience: Yup.string()
    .oneOf(["all", "students", "staff", "faculty"])
    .required(),

  scheduledTime: Yup.date().when(["type", "scheduleMode"], {
    is: (type, scheduleMode) =>
      type === "announcement" && scheduleMode === "schedule",
    then: (schema) =>
      schema
        .required("Scheduled time is required")
        .min(new Date(), "Scheduled time cannot be in the past"),
    otherwise: (schema) => schema.nullable(),
  }),
});
