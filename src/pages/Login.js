import React, { useState } from "react";
import api from "../api";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    // Handle login logic here
    try {
      const response = await api.post("/api/User/Login", {
        username,
        password,
      });
      console.log(response.data);
      localStorage.setItem("authToken", response.data.token);
      localStorage.setItem("userLogin", JSON.stringify(response.data.user));

      // Redirect to the earlier wanted URL or default to "/home"
      //const redirectUrl = localStorage.getItem('redirectUrl') || '/home';
      const redirectUrl = '/home';
      localStorage.removeItem('redirectUrl');
      window.location.href = redirectUrl;      
    } catch (error) {
      console.error("There was an error!", error);
    }
  };

  return (
    // <div>
    //   <h1>Login</h1>
    //   <form onSubmit={handleSubmit}>
    //     <label>
    //       Username:
    //       <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
    //     </label>
    //     <label>
    //       Password:
    //       <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
    //     </label>
    //     <button type="submit">Login</button>
    //   </form>
    // </div>
  
<div className="hold-transition login-page">



<div className="login-box">
  {/* /.login-logo */}
  <div className="card card-outline">
    <div className="card-header text-center">
      <a href="../../index2.html" className="h1"><b>Adjustor</b> NT</a>
    </div>
    <div className="card-body">
      <p className="login-box-msg">Sign in to start</p>
      <form onSubmit={handleSubmit}>
        <div className="input-group mb-3">
          <input type="text" value={username} className="form-control" placeholder="User" onChange={(e) => setUsername(e.target.value)} />
          <div className="input-group-append">
            <div className="input-group-text">
              <span className="fas fa-user" />
            </div>
          </div>
        </div>
        <div className="input-group mb-3">
          <input type="password" className="form-control" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <div className="input-group-append">
            <div className="input-group-text">
              <span className="fas fa-lock" />
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-8">
            <div className="icheck-primary">
              {/* <input type="checkbox" id="remember" />
              <label htmlFor="remember">
                Remember Me
              </label> */}
            </div>
          </div>
          {/* /.col */}
          <div className="col-4">
            <button type="submit" className="btn btn-primary btn-block">Sign In</button>
          </div>
          {/* /.col */}
        </div>
      </form>
    </div>
    {/* /.card-body */}
  </div>
  {/* /.card */}
</div>

</div>

  );
};

export default Login;
