import React, { useState, useRef, useEffect } from 'react';
import './ContentHeader.css'; // We'll create this file for custom styling

const ContentHeader = ({ title }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [imageError, setImageError] = useState(false);
  const dropdownRef = useRef(null);
  
  const userLogin = JSON.parse(localStorage.getItem('userLogin'));
  const username = userLogin?.username;
  const homeLocationCode = userLogin?.homeLocationCode;
  const empCode = userLogin?.empCode;
  const titleTh = userLogin?.titleTh || '';
  const firstNameTh = userLogin?.firstNameTh || '';
  const lastNameTh = userLogin?.lastNameTh || '';
  
  // Combine Thai name parts, only if at least one of them exists
  const thaiNameDisplay = (titleTh || firstNameTh || lastNameTh) ? 
    `${titleTh} ${firstNameTh} ${lastNameTh}` : '';
    
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };
  
  const handleLogout = () => {
    localStorage.removeItem("authToken");
    window.location.href = "/NTAdjustor/login"; // Redirect to login page with basepath
  };

  return (
    <div className="content-header">
      <div className="container-fluid">
        <div className="row mb-2">
          <div className="col-sm-6">
            <h1 className="m-0">{title}</h1>
          </div>{/* /.col */}
          <div className="col-sm-6">
            <div className="float-sm-right user-profile-container" ref={dropdownRef}>
              <div className="user-profile-icon" onClick={toggleDropdown}>
                <div className="user-avatar">
                  {empCode && !imageError ? (
                    <img 
                      src={`http://intra.tot.co.th/data/intranet/data/employee/${empCode}.jpg`}
                      alt="Profile"
                      onError={() => setImageError(true)}
                    />
                  ) : (
                    <i className="nav-icon fas fa-user"></i>
                  )}
                </div>
              </div>
              {dropdownOpen && (
                <div className="user-profile-dropdown">
                  <div className="user-profile-header">
                    <div className="user-avatar-large">
                      {empCode && !imageError ? (
                        <img 
                          src={`http://intra.tot.co.th/data/intranet/data/employee/${empCode}.jpg`}
                          alt="Profile"
                          onError={() => setImageError(true)}
                        />
                      ) : (
                        <i className="nav-icon fas fa-user"></i>
                      )}
                    </div>
                    <h5>{username}</h5>
                  </div>
                  <div className="user-profile-details">
                    <div className="user-detail-item">
                      <i className="nav-icon fas fa-user mr-2"></i>
                      <span>Username: {username}</span>
                    </div>
                    <div className="user-detail-item">
                      <i className="nav-icon fas fa-map-marker-alt mr-2"></i>
                      <span>Location: {homeLocationCode}</span>
                    </div>
                    {thaiNameDisplay && (
                      <div className="user-detail-item">
                        <i className="nav-icon fas fa-id-card mr-2"></i>
                        <span>Name: {thaiNameDisplay}</span>
                      </div>
                    )}
                    <div className="dropdown-divider"></div>
                    <div className="user-detail-item logout-item" onClick={handleLogout}>
                      <i className="nav-icon fas fa-sign-out-alt mr-2"></i>
                      <span>Logout</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>{/* /.col */}
        </div>{/* /.row */}
      </div>{/* /.container-fluid */}
    </div>
  );
};

export default ContentHeader;