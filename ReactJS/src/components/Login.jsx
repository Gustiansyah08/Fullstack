import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import "./Login.css"; // Pastikan file CSS sudah di-import

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Add loading state
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Show loading spinner
    try {
      const response = await api.post("/login", { email, password });
      localStorage.setItem("token", response.data.access_token); // Save token
      navigate("/dashboard");  // Navigate to dashboard after login
    } catch (error) {
      setError("Email atau password salah!");  // Display error message
    } finally {
      setIsLoading(false); // Hide loading spinner after the request
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>login</h1>
        </div>
        <form onSubmit={handleLogin}>
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              placeholder="Masukkan email Anda"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={error && !email ? "error-border" : ""}  // Highlight input on error
            />
          </div>
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              placeholder="Masukkan password Anda"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className={error && !password ? "error-border" : ""}  // Highlight input on error
            />
          </div>
          {error && <p className="error-message">{error}</p>}  {/* Show error message */}
          <div className="login-actions">
            <label>
              <input type="checkbox" /> Ingat saya
            </label>
            <a href="/forgot-password" className="forgot-password">
              Lupa password?
            </a>
          </div>
          <button 
            type="submit" 
            className="login-button" 
            disabled={isLoading}  // Disable the button while loading
          >
            {isLoading ? "Memproses..." : "Login"}
          </button>
        </form>
        <div className="register-link">
          <p>Belum punya akun?</p>
          <button
            onClick={() => navigate("/register")}
            className="register-button"
          >
            Daftar
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;
