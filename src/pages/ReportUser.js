import React, { useState, useCallback, useEffect } from 'react';
import { Table } from 'react-bootstrap';
import api from '../api';
import ContentHeader from '../components/ContentHeader';
import { exportToExcel } from '../utils/exportUtils';
import LocationFilter from '../components/LocationFilter';

const formatDateForDisplay = (dateString) => {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    if (!isNaN(date.getTime())) {
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    }
    return '';
  } catch (error) {
    console.error('Error formatting date:', error);
    return '';
  }
};

const ReportUser = () => {
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Location state (simplified using LocationFilter component)
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [showInactiveLocations, setShowInactiveLocations] = useState(false);
  
  // User filter states
  const [empCode, setEmpCode] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [roleId, setRoleId] = useState('');
  const [userStatus, setUserStatus] = useState(''); // New userStatus filter

  // Add a new state to store available roles
  const [roles, setRoles] = useState([]);
  const [loadingRoles, setLoadingRoles] = useState(false);

  // Fetch roles when component mounts
  useEffect(() => {
    fetchRoles();
  }, []);

  // Add a function to fetch available roles
  const fetchRoles = async () => {
    setLoadingRoles(true);
    try {
      const response = await api.get('/api/Group/GetAllRoles');
      setRoles(response.data);
    } catch (error) {
      console.error('Error fetching roles:', error);
    } finally {
      setLoadingRoles(false);
    }
  };

  const fetchReportData = useCallback(async () => {
    setLoading(true);
    try {
      // Create base params object with scalar values
      const params = {
        empCode: empCode || undefined,
        firstName: firstName || undefined,
        lastName: lastName || undefined,
        roleId: roleId || undefined,
        userStatus: userStatus || undefined, // Add userStatus to params
      };
      
      // Create options for axios request
      const options = { params };
      
      // If we have locations, add them to the URL manually with proper format
      let url = '/api/Adjustment/ReportUser';
      
      if (selectedLocations.length > 0) {
        // Start with the base URL
        url += '?';
        
        // Add the scalar params first
        Object.keys(params).forEach((key, index) => {
          if (params[key] !== undefined) {
            url += `${index > 0 ? '&' : ''}${key}=${encodeURIComponent(params[key])}`;
          }
        });
        
        // Now add each locationCode as a separate parameter (without array notation)
        selectedLocations.forEach(loc => {
          url += `${url.includes('?') ? '&' : ''}locationCodes=${encodeURIComponent(loc.locationCode)}`;
        });
        
        // Since we built the URL manually, use empty params
        options.params = {};
      }

      const response = await api.get(url, options);
      setReportData(response.data);
    } catch (error) {
      console.error('Error fetching report data:', error);
      alert('Failed to fetch report data. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [empCode, firstName, lastName, roleId, userStatus, selectedLocations, showInactiveLocations]); // Update dependency array

  // Function to handle adding a location to selected locations
  const handleAddLocation = (location) => {
    if (!selectedLocations.some(loc => loc.locationCode === location.locationCode)) {
      setSelectedLocations([...selectedLocations, location]);
    }
  };

  // Function to handle removing a location from selected locations
  const handleRemoveLocation = (locationCode) => {
    setSelectedLocations(selectedLocations.filter(loc => loc.locationCode !== locationCode));
  };

  // Handle toggle for inactive locations
  const handleToggleInactiveLocations = (checked) => {
    setShowInactiveLocations(checked);
  };

  const handleExportToExcel = () => {
    if (reportData.length === 0) {
      alert('No data to export.');
      return;
    }

    // Format data for export
    const exportData = reportData.map(item => ({
      'User ID': item.userId,
      'Employee Code': item.empCode || '',
      'Title (TH)': item.titleTh || '',
      'First Name (TH)': item.firstNameTh || '',
      'Last Name (TH)': item.lastNameTh || '',
      'Position': item.posAbbr || '',
      'Tel': item.tel || '',
      'Credit Limit': item.creditLimit,
      'Roles': item.roleIds || '',
      'Locations': item.locations || '',
      'Groups': item.groupIds || '',
      'Invoicing Companies': item.invoicingCompany || '',
      'User Status': item.userStatus || '',
      'User Location Code': item.userLocationCode || '',
      'Location Name': item.locationName || '',
      'Sector': item.sector || '',
      'Department': item.department || '',
      'Region': item.region || '',
      'Workarea': item.workarea || '',
      'Start Date': formatDateForDisplay(item.startDate),
      'End Date': formatDateForDisplay(item.endDate),
      'Last Used': formatDateForDisplay(item.lastUsed)
    }));

    exportToExcel(exportData, 'UserReport.xlsx');
  };

  return (
    <div className="content-wrapper-x">
      <ContentHeader title="Report - User" />
      <div className="content">
        <div className="container-fluid">
          <div className="row">
            <div className="col-12">
              <div className="card">
                <div className="card-body">
                  {/* Use the LocationFilter component */}
                  <div className="row mb-3">
                    <div className="col-12">
                      <LocationFilter
                        selectedLocations={selectedLocations}
                        onLocationSelect={handleAddLocation}
                        onLocationRemove={handleRemoveLocation}
                        showOnlyInactiveLocations={showInactiveLocations}
                        onInactiveLocationsChange={handleToggleInactiveLocations}
                        loading={loading}
                      />
                    </div>
                  </div>
                  
                  {/* Second row with user filters and action buttons */}
                  <div className="row mb-3">
                    <div className="col-md-2">
                      <div className="form-group">
                        <label>Employee Code</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Employee Code"
                          value={empCode}
                          onChange={(e) => setEmpCode(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="col-md-2">
                      <div className="form-group">
                        <label>First Name</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="First Name"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="col-md-2">
                      <div className="form-group">
                        <label>Last Name</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Last Name"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="col-md-2">
                      <div className="form-group">
                        <label>Role</label>
                        <select
                          className="form-control"
                          value={roleId}
                          onChange={(e) => setRoleId(e.target.value)}
                          disabled={loadingRoles}
                        >
                          <option value="">All Roles</option>
                          {roles.map(role => (
                            <option key={role.roleId} value={role.roleId}>
                              {role.roleName || role.roleId}
                            </option>
                          ))}
                        </select>
                        {loadingRoles && <small className="text-muted">Loading roles...</small>}
                      </div>
                    </div>
                    <div className="col-md-2">
                      <div className="form-group">
                        <label>User Status</label>
                        <select
                          className="form-control"
                          value={userStatus}
                          onChange={(e) => setUserStatus(e.target.value)}
                        >
                          <option value="">All Statuses</option>
                          <option value="Active">Active</option>
                          <option value="Inactive">Inactive</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  
                  {/* New row for buttons */}
                  <div className="row mb-3">
                    <div className="col-12">
                      <div className="form-group">
                        <button 
                          type="button" 
                          className="btn btn-primary mr-2" 
                          onClick={fetchReportData} 
                          disabled={loading}
                        >
                          {loading ? 'Loading...' : 'Generate Report'}
                        </button>
                        <button 
                          type="button" 
                          className="btn btn-success mr-2" 
                          onClick={handleExportToExcel} 
                          disabled={loading || reportData.length === 0}
                        >
                          Export to Excel
                        </button>
                        <button 
                          type="button" 
                          className="btn btn-secondary" 
                          onClick={() => window.location.reload()}
                        >
                          Clear All
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  {/* User Report Table */}
                  <div className="table-responsive" style={{ maxHeight: '600px', overflowY: 'auto' }}>
                    <Table className="table table-head-fixed text-nowrap table-bordered table-hover">
                      <thead>
                        <tr>
                          <th>#</th> {/* Replace User ID with row number */}
                          <th>Employee Code</th>
                          <th>First Name (TH)</th>
                          <th>Last Name (TH)</th>
                          <th>Position</th>
                          <th>Tel</th>
                          <th>Credit Limit</th>
                          <th>Roles</th>
                          <th>Locations</th>
                          <th>Groups</th>
                          <th>Invoicing Companies</th>
                          <th>Status</th>
                          <th>Location Code</th>
                          <th>Location Name</th>
                          <th>Sector</th>
                          <th>Department</th>
                          <th>Region</th>
                          <th>Workarea</th>
                          <th>Last Used</th>
                        </tr>
                      </thead>
                      <tbody>
                        {reportData.length === 0 ? (
                          <tr>
                            <td colSpan="19" className="text-center">{loading ? 'Loading...' : 'No data available'}</td>
                          </tr>
                        ) : (
                          reportData.map((item, index) => (
                            <tr key={index}>
                              <td>{index + 1}</td> {/* Display row number (index + 1) instead of userId */}
                              <td>{item.empCode}</td>
                              <td>{item.firstNameTh}</td>
                              <td>{item.lastNameTh}</td>
                              <td>{item.posAbbr}</td>
                              <td>{item.tel}</td>
                              <td>{item.creditLimit}</td>
                              <td>{item.roleIds}</td>
                              <td>{item.locations}</td>
                              <td>{item.groupIds}</td>
                              <td>{item.invoicingCompany}</td>
                              <td>{item.userStatus}</td>
                              <td>{item.userLocationCode}</td>
                              <td>{item.locationName}</td>
                              <td>{item.sector}</td>
                              <td>{item.department}</td>
                              <td>{item.region}</td>
                              <td>{item.workarea}</td>
                              <td>{formatDateForDisplay(item.lastUsed)}</td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </Table>
                  </div>
                  
                  {reportData.length > 0 && (
                    <div className="mt-3">
                      <strong>Total Records: {reportData.length}</strong>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportUser;