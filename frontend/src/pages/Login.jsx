import React, { useState } from "react";
import "../css/Login.css"; // import the CSS file
import api from "../services/api";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post("/login", {
        email,
        password,
      });

      console.log(response.data);
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1 className="login-title">SafeCampus Admin</h1>
        <h2 className="login-subtitle">Login</h2>

        <form onSubmit={handleLogin}>
          <label>Email</label>
          <input
            type="email"
            placeholder="admin@safecampus.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label>Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit">Log In</button>
        </form>

        <p className="footer-text">SafeCampus — Admin Portal</p>
      </div>
    </div>
  );
};

export default Login;
