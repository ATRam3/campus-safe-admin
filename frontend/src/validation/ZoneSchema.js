import * as Yup from 'yup';

export const ZoneValidationSchema = Yup.object().shape({
  name: Yup.string()
    .min(3, 'Zone name must be at least 3 characters')
    .max(100, 'Zone name cannot exceed 100 characters')
    .required('Zone name is required'),
  description: Yup.string()
    .min(10, 'Description must be at least 10 characters')
    .max(500, 'Description cannot exceed 500 characters')
    .required('Description is required'),
  severity: Yup.string()
    .oneOf(['low', 'medium', 'high'], 'Invalid severity level')
    .required('Severity is required'),
  status: Yup.string()
    .oneOf(['active', 'inactive', 'under_review'], 'Invalid status')
    .required('Status is required'),
  radius: Yup.number()
    .min(10, 'Radius must be at least 10 meters')
    .max(1000, 'Radius cannot exceed 1000 meters')
    .required('Radius is required'),
  location: Yup.object().shape({
    lat: Yup.number()
      .min(-90, 'Invalid latitude')
      .max(90, 'Invalid latitude')
      .required('Latitude is required'),
    lng: Yup.number()
      .min(-180, 'Invalid longitude')
      .max(180, 'Invalid longitude')
      .required('Longitude is required'),
  }).required('Location is required'),
});

export const IncidentValidationSchema = Yup.object().shape({
  title: Yup.string()
    .min(5, 'Title must be at least 5 characters')
    .max(200, 'Title cannot exceed 200 characters')
    .required('Title is required'),
  description: Yup.string()
    .min(20, 'Description must be at least 20 characters')
    .required('Description is required'),
  severity: Yup.string()
    .oneOf(['low', 'medium', 'high'], 'Invalid severity level')
    .required('Severity is required'),
});