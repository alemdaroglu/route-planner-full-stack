// src/components/LoginForm.js
import React, { useState } from "react";
import { login } from "../services/api";

const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [token, setToken] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await login(username, password);
      setToken(data.token);
    } catch (error) {
      setError("Invalid username or password");
    }
  };

  return (
    <div>
      <h2>Login</h2>
      {error && <p>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Login</button>
      </form>
      {token && <p>Logged in with token: {token}</p>}
    </div>
  );
};

export default LoginForm;
