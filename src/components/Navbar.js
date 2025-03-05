import React from "react";
import $ from "jquery"; // Import jQuery

export default function Navbar() {

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    window.location.href = "/login"; // Redirect to login page
  };

  const handleToggleSidebar = () => {
    $("body").toggleClass("sidebar-collapse");
  };

  return (
    <nav className="main-header navbar navbar-expand navbar-white navbar-light">
      {/* Left navbar links */}
      <ul className="navbar-nav">
        <li className="nav-item">
          <a className="nav-link" href="#" role="button" onClick={handleToggleSidebar}>
            <i className="fas fa-bars"></i>
          </a>
        </li>
        <li className="nav-item d-none d-sm-inline-block">
          {/* <a href="../../index3.html" className="nav-link">Home</a> */}
        </li>
        <li className="nav-item d-none d-sm-inline-block">
          {/* <a href="#" className="nav-link">Contact</a> */}
        </li>
      </ul>
      {/* Right navbar links */}
      <ul className="navbar-nav ml-auto">
        {/* Navbar Search */}
        <li className="nav-item">
          {/* <a href="#" className="nav-link">User</a> */}
        </li>

      </ul>
    </nav>
  );
}
