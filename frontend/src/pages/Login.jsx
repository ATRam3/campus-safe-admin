import { useNavigate } from "react-router-dom";
import api from "../services/api";
import LoginForm from "../component/form/LoginForm";
import "../css/Login.css";

const Login = () => {
  const navigate = useNavigate();

  const handleLogin = async (values, { setSubmitting, setStatus }) => {
    let response;
    try {
      response = await api.post("/auth/login", values);

      localStorage.setItem("token", response.data.data.token);
      localStorage.setItem("refreshToken", response.data.data.refreshToken);
      localStorage.setItem(
        "user",
        JSON.stringify(response.data.data.user)
      );

      navigate("/dashboard");
    } catch (error) {
      console.log("response:", response)
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
