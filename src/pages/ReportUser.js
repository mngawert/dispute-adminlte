import React, { useState, useCallback, useEffect } from 'react';
import { Table } from 'react-bootstrap';
import api from '../api';
import ContentHeader from '../components/ContentHeader';
import { exportToExcel } from '../utils/exportUtils';

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
  
  // Add state variables for location filtering
  const [locations, setLocations] = useState([]);
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [loadingLocations, setLoadingLocations] = useState(false);

  // State variables for the cascade filter
  const [workareas, setWorkareas] = useState([]);
  const [regions, setRegions] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [sectors, setSectors] = useState([]);

  const [selectedWorkarea, setSelectedWorkarea] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedSector, setSelectedSector] = useState('');
  
  // User filter states
  const [empCode, setEmpCode] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [roleId, setRoleId] = useState(''); // Replace userStatus with roleId

  // Add a new state to store available roles
  const [roles, setRoles] = useState([]);
  const [loadingRoles, setLoadingRoles] = useState(false);

  // Fetch locations when component mounts
  useEffect(() => {
    fetchLocations();
    fetchRoles(); // Add this to fetch roles
  }, []);

  // Function to fetch locations
  const fetchLocations = async () => {
    setLoadingLocations(true);
    try {
      const response = await api.get('/api/ServiceLocation/GetAllServiceLocations');
      setLocations(response.data);
      
      // Extract unique values for each level of the hierarchy
      const uniqueWorkareas = [...new Set(response.data.map(loc => loc.workarea))].filter(Boolean).sort();
      setWorkareas(uniqueWorkareas);
    } catch (error) {
      console.error('Error fetching locations:', error);
    } finally {
      setLoadingLocations(false);
    }
  };

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

  // Update regions when workarea changes
  useEffect(() => {
    if (selectedWorkarea) {
      const filteredLocations = locations.filter(loc => loc.workarea === selectedWorkarea);
      const uniqueRegions = [...new Set(filteredLocations.map(loc => loc.region))].filter(Boolean).sort();
      setRegions(uniqueRegions);
      setSelectedRegion('');
      setSelectedDepartment('');
      setSelectedSector('');
      setDepartments([]);
      setSectors([]);
    } else {
      setRegions([]);
      setDepartments([]);
      setSectors([]);
      setSelectedRegion('');
      setSelectedDepartment('');
      setSelectedSector('');
    }
  }, [selectedWorkarea, locations]);

  // Update departments when region changes
  useEffect(() => {
    if (selectedRegion) {
      const filteredLocations = locations.filter(loc => 
        loc.workarea === selectedWorkarea && loc.region === selectedRegion
      );
      const uniqueDepartments = [...new Set(filteredLocations.map(loc => loc.department))].filter(Boolean).sort();
      setDepartments(uniqueDepartments);
      setSelectedDepartment('');
      setSelectedSector('');
      setSectors([]);
    } else {
      setDepartments([]);
      setSectors([]);
      setSelectedDepartment('');
      setSelectedSector('');
    }
  }, [selectedRegion, selectedWorkarea, locations]);

  // Update sectors when department changes
  useEffect(() => {
    if (selectedDepartment) {
      const filteredLocations = locations.filter(loc => 
        loc.workarea === selectedWorkarea && 
        loc.region === selectedRegion && 
        loc.department === selectedDepartment
      );
      const uniqueSectors = [...new Set(filteredLocations.map(loc => loc.sector))].filter(Boolean).sort();
      setSectors(uniqueSectors);
      setSelectedSector('');
    } else {
      setSectors([]);
      setSelectedSector('');
    }
  }, [selectedDepartment, selectedRegion, selectedWorkarea, locations]);

  const fetchReportData = useCallback(async () => {
    setLoading(true);
    try {
      // Create base params object with scalar values - replace userStatus with roleId
      const params = {
        empCode: empCode || undefined,
        firstName: firstName || undefined,
        lastName: lastName || undefined,
        roleId: roleId || undefined, // Replace userStatus with roleId
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
  }, [empCode, firstName, lastName, roleId, selectedLocations]); // Update dependency array

  // Function to handle adding a location to selected locations
  const handleAddLocation = (locationCode) => {
    const locationToAdd = locations.find(loc => loc.locationCode === locationCode);
    if (locationToAdd && !selectedLocations.some(loc => loc.locationCode === locationCode)) {
      setSelectedLocations([...selectedLocations, locationToAdd]);
    }
  };

  // Function to handle removing a location from selected locations
  const handleRemoveLocation = (locationCode) => {
    setSelectedLocations(selectedLocations.filter(loc => loc.locationCode !== locationCode));
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

  // Get filtered locations based on selections
  const getFilteredLocations = () => {
    let filtered = [...locations];
    
    if (selectedWorkarea) {
      filtered = filtered.filter(loc => loc.workarea === selectedWorkarea);
    }
    
    if (selectedRegion) {
      filtered = filtered.filter(loc => loc.region === selectedRegion);
    }
    
    if (selectedDepartment) {
      filtered = filtered.filter(loc => loc.department === selectedDepartment);
    }
    
    if (selectedSector) {
      filtered = filtered.filter(loc => loc.sector === selectedSector);
    }
    
    return filtered.filter(loc => !selectedLocations.some(selected => selected.locationCode === loc.locationCode));
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
                  {/* Top row with location filters - with consistent fixed heights */}
                  <div className="row mb-3">
                    <div className="col-md-4">
                      <div className="card">
                        <div className="card-header">
                          <h3 className="card-title">Location Filters</h3>
                        </div>
                        <div className="card-body" style={{ height: '350px', overflowY: 'auto' }}>
                          <div className="form-group mb-2">
                            <label>Workarea</label>
                            <select
                              className="form-control"
                              value={selectedWorkarea}
                              onChange={(e) => setSelectedWorkarea(e.target.value)}
                            >
                              <option value="">-- Select Workarea --</option>
                              {workareas.map(workarea => (
                                <option key={workarea} value={workarea}>{workarea}</option>
                              ))}
                            </select>
                          </div>
                          <div className="form-group mb-2">
                            <label>Region</label>
                            <select
                              className="form-control"
                              value={selectedRegion}
                              onChange={(e) => setSelectedRegion(e.target.value)}
                              disabled={!selectedWorkarea}
                            >
                              <option value="">-- Select Region --</option>
                              {regions.map(region => (
                                <option key={region} value={region}>{region}</option>
                              ))}
                            </select>
                          </div>
                          <div className="form-group mb-2">
                            <label>Department</label>
                            <select
                              className="form-control"
                              value={selectedDepartment}
                              onChange={(e) => setSelectedDepartment(e.target.value)}
                              disabled={!selectedRegion}
                            >
                              <option value="">-- Select Department --</option>
                              {departments.map(dept => (
                                <option key={dept} value={dept}>{dept}</option>
                              ))}
                            </select>
                          </div>
                          <div className="form-group">
                            <label>Sector</label>
                            <select
                              className="form-control"
                              value={selectedSector}
                              onChange={(e) => setSelectedSector(e.target.value)}
                              disabled={!selectedDepartment}
                            >
                              <option value="">-- Select Sector --</option>
                              {sectors.map(sector => (
                                <option key={sector} value={sector}>{sector}</option>
                              ))}
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="col-md-4">
                      <div className="card">
                        <div className="card-header">
                          <h3 className="card-title">Available Locations</h3>
                        </div>
                        <div className="card-body" style={{ height: '350px', overflowY: 'auto' }}>
                          {loadingLocations ? (
                            <p className="text-center">Loading locations...</p>
                          ) : (
                            <ul className="list-group">
                              {getFilteredLocations().map(location => (
                                <li key={location.locationCode} className="list-group-item d-flex align-items-center justify-content-between">
                                  <span>{location.locationCode} - {location.locationName}</span>
                                  <button
                                    className="btn btn-sm btn-primary"
                                    onClick={() => handleAddLocation(location.locationCode)}
                                    title="Add Location"
                                  >
                                    <i className="fa fa-plus-circle" aria-hidden="true"></i>
                                  </button>
                                </li>
                              ))}
                            </ul>
                          )}
                          
                          {getFilteredLocations().length === 0 && !loadingLocations && (
                            <p className="text-center text-muted mt-3">No locations match the selected criteria</p>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="col-md-4">
                      <div className="card">
                        <div className="card-header">
                          <h3 className="card-title">Selected Locations</h3>
                        </div>
                        <div className="card-body" style={{ height: '350px', overflowY: 'auto' }}>
                          {selectedLocations.length === 0 ? (
                            <p className="text-muted">No locations selected (will search all locations)</p>
                          ) : (
                            <ul className="list-group">
                              {selectedLocations.map(location => (
                                <li key={location.locationCode} className="list-group-item d-flex align-items-center justify-content-between">
                                  <span>{location.locationCode} - {location.locationName}</span>
                                  <button
                                    className="btn btn-sm btn-danger"
                                    onClick={() => handleRemoveLocation(location.locationCode)}
                                    title="Remove Location"
                                  >
                                    <i className="fa fa-minus-circle" aria-hidden="true"></i>
                                  </button>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      </div>
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
                    <div className="col-md-4">
                      <div className="form-group" style={{ marginTop: '32px' }}>
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
                          className="btn btn-success" 
                          onClick={handleExportToExcel} 
                          disabled={loading || reportData.length === 0}
                        >
                          Export to Excel
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