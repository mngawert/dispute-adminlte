import React, { useState, useEffect } from "react";
import api from "../api";
import config from "../config";
import { loadAuthConfig } from "../utils/configLoader";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false); // Add loading state

  useEffect(() => {
    // Load authentication config from the public config file
    const checkSessionParam = async () => {
      try {
        console.log("Login: Loading auth configuration...");
        // Load auth config from public directory
        const authConfig = await loadAuthConfig();
        console.log("Login: Auth configuration loaded:", authConfig);
        
        // Only check for session parameter if the feature is enabled in config
        if (authConfig.auth.requireSessionQueryParam) {
          console.log("Login: Session parameter check is enabled");
          // Check if there's a session query parameter
          const urlParams = new URLSearchParams(window.location.search);
          const sessionParam = urlParams.get('session');
          console.log("Login: Session parameter value:", sessionParam);
          
          // If no session parameter, redirect to intranet
          if (!sessionParam) {
            console.log("Login: No session parameter, redirecting to:", authConfig.auth.intranetRedirectUrl);
            window.location.href = authConfig.auth.intranetRedirectUrl;
          } else {
            console.log("Login: Session parameter found, continuing to login page");
          }
        } else {
          console.log("Login: Session parameter check is disabled in config");
        }
      } catch (error) {
        console.error("Failed to load auth config:", error);
        // Fallback to static config if dynamic loading fails
        if (config.auth.requireSessionQueryParam) {
          const urlParams = new URLSearchParams(window.location.search);
          const sessionParam = urlParams.get('session');
          
          if (!sessionParam) {
            window.location.href = config.auth.intranetRedirectUrl;
          }
        }
      }
    };
    
    checkSessionParam();
  }, []);

  const handleLogin = async () => {
    // Check if username and password are filled
    if (!username || !password) {
      setErrorMessage("Username and password are required.");
      return;
    }

    // Set loading to true when starting the request
    setLoading(true);
    setErrorMessage("");

    // Handle login logic here
    try {
      const response = await api.post("/api/User/Login", {
        username,
        password,
      });
      console.log('response.data:', response.data);
      localStorage.setItem("authToken", response.data.token);
      localStorage.setItem("userLogin", JSON.stringify(response.data.user));

      // Check if password has been changed
      if (response.data.user.pwdChanged !== "Y") {
        // Redirect to the change-password page
        window.location.href = "/NTAdjustor/change-password";
        return;
      }

      // Redirect to the earlier wanted URL or default to "/home"
      const redirectUrl = '/NTAdjustor';
      localStorage.removeItem('redirectUrl');
      window.location.href = redirectUrl;      
    } catch (error) {
      console.error("There was an error!", error);
      
      // Extract error message from API response if available
      let errorMsg = "Invalid username or password. Please try again.";
      
      if (error.response && error.response.data) {
        // Check if the API returned a message
        if (error.response.data.message) {
          errorMsg = error.response.data.message;
        } else if (typeof error.response.data === 'string') {
          // Some APIs return the error message directly as a string
          errorMsg = error.response.data;
        }
      }
      
      setErrorMessage(errorMsg);
      setLoading(false); // Reset loading state on error
    }
  };

  // Handle Enter key press to submit the form
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <div className="hold-transition login-page">
      <div className="login-box">
        <div className="card card-outline">
          <div className="card-header text-center">
            <a href="#" className="h1"><b>Adjustor</b> NT</a>
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
                onKeyPress={handleKeyPress}
                disabled={loading}
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
                onKeyPress={handleKeyPress}
                disabled={loading}
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
                <button 
                  type="button" 
                  className="btn btn-primary btn-block" 
                  onClick={handleLogin}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"></span>
                      Signing in...
                    </>
                  ) : (
                    'Sign In'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ marginTop: "16px" }}>
        <a
          href="/NTAdjustor/files/Adjust_user_password.doc"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "#0808086e" }}
        >
          แบบฟอร์มขอใช้งานระบบปรับปรุงบิล
        </a>
      </div>       
    </div>
  );
};

export default Login;
