import { Formik, Form, Field, ErrorMessage } from "formik";
import loginSchema from "../../validation/LoginSchema";

const LoginForm = ({
    onSubmit,
    initialValues = { email: "", password: "" },
    submitText = "Log In",
    loadingText = "Logging in...",
}) => {
    return (
        <Formik
            initialValues={initialValues}
            validationSchema={loginSchema}
            onSubmit={onSubmit}
        >
            {({ isSubmitting, status }) => (
                <Form className="login-form">
                    <div className="form-group">
                        <label>Email</label>
                        <Field
                            type="email"
                            name="email"
                            placeholder="admin@safecampus.com"
                        />
                        <ErrorMessage name="email" component="span" />
                    </div>

                    <div className="form-group">
                        <label>Password</label>
                        <Field
                            type="password"
                            name="password"
                            placeholder="Enter your password"
                        />
                        <ErrorMessage name="password" component="span" />
                    </div>

                    {status && <div className="form-error">{status}</div>}

                    <button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? loadingText : submitText}
                    </button>
                </Form>
            )}
        </Formik>
    );
};

export default LoginForm;
