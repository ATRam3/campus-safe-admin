import { useNavigate } from "react-router-dom";
import api from "../services/api";
import LoginForm from "../component/form/LoginForm";
import "../css/Login.css";

const Login = () => {
  const navigate = useNavigate();

  const handleLogin = async (values, { setSubmitting, setStatus }) => {
    try {
      const response = await api.post("/auth/login", values);
      if (response.data) {
        // Store token in localStorage
        localStorage.setItem("token", response.data.data.token);
        localStorage.setItem("refreshToken", response.data.data.refreshToken);
        //store user info
        localStorage.setItem(
          "user",
          JSON.stringify({
            id: response.data.data.user._id,
            fullName: response.data.data.user.fullName,
            email: response.data.data.user.email,
            role: response.data.data.user.role,
          })
        );
        // Redirect to dashboard
        navigate("/dashboard");
      }
    } catch (error) {
      setStatus("Invalid credentials");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1 className="login-title">SafeCampus Admin</h1>
        <p className="login-subtitle">Secure Login</p>

        <LoginForm onSubmit={handleLogin} />

        <p className="footer-text">SafeCampus — Admin Portal</p>
      </div>
    </div>
  );
};

export default Login;
