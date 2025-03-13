import React, { useState } from "react";
import "./Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="login-container">
      <h2 className="login-heading">Login</h2>
      <form>
        <div className="login-input-group">
          <label className="login-label" htmlFor="email">
            Email
          </label>
          <input
            type="email"
            id="email"
            className="login-input"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="login-input-group">
          <label className="login-label" htmlFor="password">
            Password
          </label>
          <input
            type="password"
            id="password"
            className="login-input"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="login-actions">
          <button type="submit" className="login-btn">
            Login
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;
