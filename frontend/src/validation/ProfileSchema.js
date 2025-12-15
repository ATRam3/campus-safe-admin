import * as Yup from 'yup';

export const profileValidationSchema = Yup.object().shape({
  fullName: Yup.string()
    .required('Full name is required')
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be less than 50 characters'),
  
  email: Yup.string()
    .required('Email is required')
    .email('Invalid email format'),
  
  phone: Yup.string()
    .required('Phone number is required')
    .matches(/^[0-9+\-\s()]*$/, 'Invalid phone number format'),
});

export const initialValues = (adminData) => ({
  name: adminData.name || '',
  email: adminData.email || '',
  phone: adminData.phone || '',
});