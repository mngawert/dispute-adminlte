import React, { useState } from "react";
import api from "../api";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = async () => {
    // Check if username and password are filled
    if (!username || !password) {
      setErrorMessage("Username and password are required.");
      return;
    }

    // Handle login logic here
    try {
      const response = await api.post("/api/User/Login", {
        username,
        password,
      });
      console.log('response.data:', response.data);
      localStorage.setItem("authToken", response.data.token);
      localStorage.setItem("userLogin", JSON.stringify(response.data.user));

      // Redirect to the earlier wanted URL or default to "/home"
      const redirectUrl = '/NTAdjustor/home';
      localStorage.removeItem('redirectUrl');
      window.location.href = redirectUrl;      
    } catch (error) {
      console.error("There was an error!", error);
      setErrorMessage("Invalid username or password. Please try again.");
    }
  };

  return (
    <div className="hold-transition login-page">
      <div className="login-box">
        <div className="card card-outline">
          <div className="card-header text-center">
            <a href="../../index2.html" className="h1"><b>Adjustor</b> NT</a>
          </div>
          <div className="card-body">
            <p className="login-box-msg">Sign in to start your session</p>
            <div className="input-group mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="User"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
              <div className="input-group-append">
                <div className="input-group-text">
                  <span className="fas fa-user"></span>
                </div>
              </div>
            </div>
            <div className="input-group mb-3">
              <input
                type="password"
                className="form-control"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <div className="input-group-append">
                <div className="input-group-text">
                  <span className="fas fa-lock"></span>
                </div>
              </div>
            </div>
            {errorMessage && (
              <div className="alert alert-danger" role="alert">
                {errorMessage}
              </div>
            )}
            <div className="row">
              <div className="col-12">
                <button type="button" className="btn btn-primary btn-block" onClick={handleLogin}>Sign In</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
