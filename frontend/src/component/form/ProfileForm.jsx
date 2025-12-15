import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { profileValidationSchema } from '../../validation/ProfileSchema';

const ProfileForm = ({
    adminData,
    onCancel,
    onSubmit,
    isSubmitting = false
}) => {

    const adjustedInitialValues = {
        fullName: adminData.fullName || '',
        email: adminData.email || '',
        phone: adminData.phone || '',
    };

    const handleSubmit = async (values, { setSubmitting }) => {
        const transformedValues = {
            fullName: values.fullName,
            email: values.email,
            phone: values.phone,
        };

        await onSubmit(transformedValues, { setSubmitting });
    };

    return (
        <Formik
            initialValues={adjustedInitialValues}
            validationSchema={profileValidationSchema}
            onSubmit={handleSubmit}
            enableReinitialize
        >
            {({ values, errors, touched, handleChange, handleBlur, isValid, dirty }) => (
                <Form className="profile-form">
                    <div className="form-section">
                        <h4>Edit Profile</h4>

                        {/* Full Name Field */}
                        <div className="form-group">
                            <label htmlFor="fullName" className="form-label">
                                Full Name *
                            </label>
                            <Field
                                type="text"
                                name="fullName"
                                id="fullName"
                                className={`form-input ${touched.fullName && errors.fullName ? 'form-input-error' : ''
                                    }`}
                                placeholder="Enter your full name"
                                aria-describedby={errors.fullName ? "fullName-error" : undefined}
                            />
                            <ErrorMessage
                                name="fullName"
                                component="div"
                                id="fullName-error"
                                className="error-message"
                            />
                        </div>

                        {/* Email Field */}
                        <div className="form-group">
                            <label htmlFor="email" className="form-label">
                                Email Address *
                            </label>
                            <Field
                                type="email"
                                name="email"
                                id="email"
                                className={`form-input ${touched.email && errors.email ? 'form-input-error' : ''
                                    }`}
                                placeholder="Enter your email address"
                                aria-describedby={errors.email ? "email-error" : undefined}
                            />
                            <ErrorMessage
                                name="email"
                                component="div"
                                id="email-error"
                                className="error-message"
                            />
                        </div>

                        {/* Phone Field */}
                        <div className="form-group">
                            <label htmlFor="phone" className="form-label">
                                Phone Number *
                            </label>
                            <Field
                                type="tel"
                                name="phone"
                                id="phone"
                                className={`form-input ${touched.phone && errors.phone ? 'form-input-error' : ''
                                    }`}
                                placeholder="Enter your phone number"
                                aria-describedby={errors.phone ? "phone-error" : undefined}
                            />
                            <ErrorMessage
                                name="phone"
                                component="div"
                                id="phone-error"
                                className="error-message"
                            />
                        </div>

                        {/* Form Actions */}
                        <div className="form-actions">
                            <button
                                type="button"
                                onClick={onCancel}
                                className="btn btn-secondary"
                                disabled={isSubmitting}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={isSubmitting || !isValid || !dirty}
                            >
                                {isSubmitting ? (
                                    <>
                                        <span className="spinner"></span>
                                        Saving...
                                    </>
                                ) : (
                                    'Save Changes'
                                )}
                            </button>
                        </div>
                    </div>
                </Form>
            )}
        </Formik>
    );
};

export default ProfileForm;