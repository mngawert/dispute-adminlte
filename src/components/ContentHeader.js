import React, { useState, useRef, useEffect } from 'react';
import { getUserRoles } from '../utils/utils';
import api from '../api';
import './ContentHeader.css'; // We'll create this file for custom styling

const ContentHeader = ({ title }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [imageError, setImageError] = useState(false);
  const dropdownRef = useRef(null);
  const [userDetails, setUserDetails] = useState(null);
  const [loadingUserDetails, setLoadingUserDetails] = useState(false);
  
  const userLogin = JSON.parse(localStorage.getItem('userLogin'));
  const username = userLogin?.username;
  const homeLocationCode = userLogin?.homeLocationCode;
  const empCode = userLogin?.empCode;
  const titleTh = userLogin?.titleTh || '';
  const firstNameTh = userLogin?.firstNameTh || '';
  const lastNameTh = userLogin?.lastNameTh || '';
  const userId = userLogin?.userId;
  
  // Get roles from JWT token
  const roles = getUserRoles();
  
  // Combine Thai name parts, only if at least one of them exists
  const thaiNameDisplay = (titleTh || firstNameTh || lastNameTh) ? 
    `${titleTh} ${firstNameTh} ${lastNameTh}` : '';
  
  // Format roles display
  const rolesDisplay = roles.length > 0 ? roles.join(', ') : '';

  // Helper function to get unique values from comma-separated string
  const getUniqueValues = (str) => {
    if (!str) return '';
    const values = str.split(',').map(v => v.trim()).filter(v => v !== '');
    const uniqueValues = [...new Set(values)];
    return uniqueValues.join(', ');
  };

  // Fetch user details from ReportUser API
  const fetchUserDetails = async () => {
    if (!userId || userDetails) return; // Don't fetch if already loaded or no userId
    
    setLoadingUserDetails(true);
    try {
      const response = await api.get(`/api/Adjustment/ReportUser?userId=${userId}`);
      if (response.data && response.data.length > 0) {
        const data = response.data[0];
        // Process the data to get unique values
        setUserDetails({
          ...data,
          invoicingCompany: getUniqueValues(data.invoicingCompany),
          locations: getUniqueValues(data.locations)
        });
      }
    } catch (error) {
      console.error('Error fetching user details:', error);
    } finally {
      setLoadingUserDetails(false);
    }
  };

  // Fetch user details when dropdown opens
  useEffect(() => {
    if (dropdownOpen && userId && !userDetails) {
      fetchUserDetails();
    }
  }, [dropdownOpen, userId]);

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
                    {rolesDisplay && (
                      <div className="user-detail-item">
                        <i className="nav-icon fas fa-user-tag mr-2"></i>
                        <span>Roles: {rolesDisplay}</span>
                      </div>
                    )}
                    {loadingUserDetails && (
                      <div className="user-detail-item">
                        <i className="nav-icon fas fa-spinner fa-spin mr-2"></i>
                        <span>Loading...</span>
                      </div>
                    )}
                    {userDetails && userDetails.invoicingCompany && (
                      <div className="user-detail-item">
                        <i className="nav-icon fas fa-building mr-2"></i>
                        <span>ICOs: {userDetails.invoicingCompany}</span>
                      </div>
                    )}
                    {userDetails && userDetails.locations && (
                      <div className="user-detail-item">
                        <i className="nav-icon fas fa-map-marked-alt mr-2"></i>
                        <span>Available Locations: {userDetails.locations}</span>
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