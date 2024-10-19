import React from "react";

export default function Navbar() {

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    window.location.href = "/login"; // Redirect to login page
  };

  return (
    <nav className="main-header navbar navbar-expand navbar-white navbar-light">
      <ul className="navbar-nav">
        <li className="nav-item">
          <a className="nav-link" data-widget="pushmenu" href="#" role="button">
            <i className="fas fa-bars"></i>
          </a>
          <button className="btn-xs info" onClick={() => handleLogout()}>logout</button>
          </li>
      </ul>
    </nav>
  );
}
