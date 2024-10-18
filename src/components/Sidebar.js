import React from "react";

export default function Sidebar() {
  return (
    <aside className="main-sidebar sidebar-dark-primary elevation-4">
      <a href="/" className="brand-link">
        <span className="brand-text font-weight-light">AdminLTE React</span>
      </a>
      <div className="sidebar">
        <nav className="mt-2">
          <ul className="nav nav-pills nav-sidebar flex-column" role="menu">
            <li className="nav-item">
              <a href="/" className="nav-link">
                <i className="nav-icon fas fa-tachometer-alt"></i>
                <p>Home</p>
              </a>
            </li>
            <li className="nav-item">
              <a href="/Dashboard" className="nav-link">
                <i className="nav-icon fas fa-tachometer-alt"></i>
                <p>Dashboard</p>
              </a>
            </li>
            <li className="nav-item">
              <a href="/Dispute" className="nav-link">
                <i className="nav-icon fas fa-tachometer-alt"></i>
                <p>Dispute</p>
              </a>
            </li>
            <li className="nav-item">
              <a href="/DisputeData" className="nav-link">
                <i className="nav-icon fas fa-tachometer-alt"></i>
                <p>DisputeData</p>
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </aside>
  );
}
