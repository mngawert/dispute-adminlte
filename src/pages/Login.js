import React, { useState } from "react";
import config from "../config";
import api from "../api";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    // Handle login logic here
    try {
      const response = await api.post(`${config.apiBaseUrl}/api/User/Login`, {
        username,
        password,
      });
      console.log(response.data);
      localStorage.setItem("authToken", response.data.token);
      window.location.href = "/home"; // Redirect to login page
    } catch (error) {
      console.error("There was an error!", error);
    }
  };

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Username:
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
        </label>
        <label>
          Password:
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </label>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
