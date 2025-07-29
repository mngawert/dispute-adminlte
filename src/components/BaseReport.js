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

const BaseReport = ({ 
  title = "Report",
  exportFileName = "Report.xlsx",
  allowedDocumentTypes = null, // null means all document types
  documentFilterLabel = "Document Type",
  apiEndpoint = '/api/Adjustment/ReportA'
}) => {
  const [documentNum, setDocumentNum] = useState('');
  const [accountNum, setAccountNum] = useState('');
  const [serviceNum, setServiceNum] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Location filtering states
  const [locations, setLocations] = useState([]);
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [loadingLocations, setLoadingLocations] = useState(false);

  // Hierarchy filter states
  const [workareas, setWorkareas] = useState([]);
  const [regions, setRegions] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [sectors, setSectors] = useState([]);
  
  const [selectedWorkarea, setSelectedWorkarea] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedSector, setSelectedSector] = useState('');

  // Document type states
  const [documentTypes, setDocumentTypes] = useState([]);
  const [selectedDocumentType, setSelectedDocumentType] = useState('');
  const [loadingDocumentTypes, setLoadingDocumentTypes] = useState(false);

  // Update the state variable name
  const [excludeMappedLocations, setExcludeMappedLocations] = useState(false);

  // Add new state variables at the top of the component
  const [userFunction, setUserFunction] = useState('');
  const [userName, setUserName] = useState('');

  // Fetch data when component mounts
  useEffect(() => {
    fetchLocations();
    fetchDocumentTypes();
  }, []);

  // Function to fetch locations
  const fetchLocations = async () => {
    setLoadingLocations(true);
    try {
      const response = await api.get('/api/ServiceLocation/GetAllServiceLocations');
      setLocations(response.data);
      
      // Extract unique values for workarea hierarchy
      const uniqueWorkareas = [...new Set(response.data.map(loc => loc.workarea))].filter(Boolean).sort();
      setWorkareas(uniqueWorkareas);
    } catch (error) {
      console.error('Error fetching locations:', error);
    } finally {
      setLoadingLocations(false);
    }
  };

  // Function to fetch document types with optional filtering
  const fetchDocumentTypes = async () => {
    setLoadingDocumentTypes(true);
    try {
      const response = await api.get('/api/Document/GetDocumentTypes');
      
      if (allowedDocumentTypes) {
        // Filter document types if allowed list is provided
        const filteredDocumentTypes = response.data.filter(docType => 
          allowedDocumentTypes.includes(docType.documentTypeDesc) || 
          allowedDocumentTypes.includes(docType.documentTypeCode)
        );
        
        // Sort document types according to the order in allowedDocumentTypes
        filteredDocumentTypes.sort((a, b) => {
          const indexA = allowedDocumentTypes.indexOf(a.documentTypeDesc) !== -1 
            ? allowedDocumentTypes.indexOf(a.documentTypeDesc)
            : allowedDocumentTypes.indexOf(a.documentTypeCode);
          
          const indexB = allowedDocumentTypes.indexOf(b.documentTypeDesc) !== -1
            ? allowedDocumentTypes.indexOf(b.documentTypeDesc)
            : allowedDocumentTypes.indexOf(b.documentTypeCode);
          
          return indexA - indexB;
        });
        
        setDocumentTypes(filteredDocumentTypes);
      } else {
        // Use all document types if no allowed list is provided
        setDocumentTypes(response.data);
      }
    } catch (error) {
      console.error('Error fetching document types:', error);
    } finally {
      setLoadingDocumentTypes(false);
    }
  };

  // Cascade filter effects
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

  // Main function to fetch report data
  const fetchReportData = useCallback(async () => {
    setLoading(true);
    try {
      // Create base params object with scalar values
      const params = {
        documentNum: documentNum || undefined,
        accountNum: accountNum || undefined,
        serviceNum: serviceNum || undefined,
        fromDate: fromDate || undefined,
        toDate: toDate || undefined,
        // Always send documentTypes - if none selected, send all available codes
        documentTypes: selectedDocumentType || 
          (documentTypes.length > 0 ? documentTypes.map(dt => dt.documentTypeCode).join(',') : undefined),
        excludeMappedLocations: excludeMappedLocations,
        userFunction: userFunction || undefined, // Add the user function parameter
        name: userName || undefined // Add the name parameter
      };
      
      // Create options for axios request
      const options = { params };
      
      // Handle selected locations
      let url = apiEndpoint;
      
      if (selectedLocations.length > 0) {
        // Start with the base URL
        url += '?';
        
        // Add the scalar params first
        Object.keys(params).forEach((key, index) => {
          if (params[key] !== undefined) {
            url += `${index > 0 ? '&' : ''}${key}=${encodeURIComponent(params[key])}`;
          }
        });
        
        // Add each locationCode as a separate parameter
        selectedLocations.forEach(loc => {
          url += `${url.includes('?') ? '&' : ''}locationCodes=${encodeURIComponent(loc.locationCode)}`;
        });
        
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
  }, [documentNum, accountNum, serviceNum, fromDate, toDate, selectedLocations, selectedDocumentType, apiEndpoint, documentTypes, excludeMappedLocations, userFunction, userName]); // Update dependency array

  // Location handling functions
  const handleAddLocation = (locationCode) => {
    const locationToAdd = locations.find(loc => loc.locationCode === locationCode);
    if (locationToAdd && !selectedLocations.some(loc => loc.locationCode === locationCode)) {
      setSelectedLocations([...selectedLocations, locationToAdd]);
    }
  };

  const handleRemoveLocation = (locationCode) => {
    setSelectedLocations(selectedLocations.filter(loc => loc.locationCode !== locationCode));
  };

  // Date handling functions
  const handleFromDateChange = (e) => {
    setFromDate(e.target.value);
  };

  const handleToDateChange = (e) => {
    setToDate(e.target.value);
  };

  // Export to Excel function
  const handleExportToExcel = () => {
    if (reportData.length === 0) {
      alert('No data to export.');
      return;
    }

    // Format data for export
    const exportData = reportData.map(item => ({
      'Document Number': item.documentNum,
      'Document Type': item.documentTypeDesc,
      'Account Number': item.accountNum,
      'Customer Name': item.customerName,
      'Customer Type': item.customerTypeName,
      'Invoicing Company': item.invoicingCoName,
      'Invoice Number': item.invoiceNum,
      'Service Number': item.serviceNum,
      'Bill Date': formatDateForDisplay(item.billDtm),
      'Actual Bill Date': formatDateForDisplay(item.actualBillDtm),
      'Adjustment Type': item.adjustmentTypeName,
      'Amount': item.amount,
      'VAT': item.vat,
      'Total': item.total,
      'Created Date': formatDateForDisplay(item.createdDtm),
      'Created By': item.createdBy,
      'Reviewed Date': formatDateForDisplay(item.reviewedDtm),
      'Reviewed By': item.reviewedBy,
      'Approved Date': formatDateForDisplay(item.approvedDtm),
      'Approved By': item.approvedBy,
      'Finance Reviewed Date': formatDateForDisplay(item.financeReviewedDtm),
      'Finance Reviewed By': item.financeReviewedBy,
      'SAP Doc No': item.sapDocNo,
      'SAP Doc Date': formatDateForDisplay(item.sapDocDate),
      'Home Location Code': item.homeLocationCode,
      'Service Location Code': item.serviceLocationCode,
      'Sector': item.sector,
      'Adjustment Status': item.adjustmentStatus
    }));

    exportToExcel(exportData, exportFileName);
  };

  // Number formatting
  const formatNumber = (num) => {
    return num !== null ? num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '';
  };

  // Get filtered locations for display
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

  // Render component
  return (
    <div className="content-wrapper-x">
      <ContentHeader title={title} />
      <div className="content">
        <div className="container-fluid">
          <div className="row">
            <div className="col-12">
              <div className="card">
                <div className="card-body">
                  {/* Location filters */}
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
                  
                  {/* New checkbox row */}
                  <div className="row mb-3">
                    <div className="col-12">
                      <div className="form-group">
                        <div className="custom-control custom-checkbox">
                          <input
                            type="checkbox"
                            className="custom-control-input"
                            id="excludeMappedLocations"
                            checked={excludeMappedLocations}
                            onChange={(e) => setExcludeMappedLocations(e.target.checked)}
                          />
                          <label className="custom-control-label" htmlFor="excludeMappedLocations">
                            Show transactions from inactive locations
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Row with User Function and date filters - 3 columns */}
                  <div className="row mb-3">
                    <div className="col-md-4">
                      <div className="form-group">
                        <label>User Function</label>
                        <select
                          className="form-control"
                          value={userFunction}
                          onChange={(e) => setUserFunction(e.target.value)}
                        >
                          <option value="">All Functions</option>
                          <option value="Created">Created</option>
                          <option value="Reviewed">Reviewed</option>
                          <option value="Approved">Approved</option>
                          <option value="Finance">Finance</option>
                        </select>
                      </div>
                    </div>
                    
                    <div className="col-md-4">
                      <div className="form-group">
                        <label>From Date</label>
                        <div className="input-group">
                          <input
                            type="date"
                            name="fromDate"
                            value={fromDate}
                            onChange={handleFromDateChange}
                            className="form-control"
                            style={{ width: "0px", padding: "0", border: "none", opacity: 0, position: "absolute" }}
                          />
                          <div 
                            className="form-control" 
                            onClick={() => document.querySelector('input[name="fromDate"]').showPicker()}
                            style={{ cursor: "pointer", background: "#f8f9fa" }}
                          >
                            {fromDate ? formatDateForDisplay(fromDate) : 'Click to select date'}
                          </div>
                          <div className="input-group-append">
                            <button 
                              className="btn btn-outline-secondary" 
                              type="button"
                              onClick={() => setFromDate('')}
                              title="Clear date"
                            >
                              <i className="fa fa-times"></i>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="col-md-4">
                      <div className="form-group">
                        <label>To Date</label>
                        <div className="input-group">
                          <input
                            type="date"
                            name="toDate"
                            value={toDate}
                            onChange={handleToDateChange}
                            className="form-control"
                            style={{ width: "0px", padding: "0", border: "none", opacity: 0, position: "absolute" }}
                          />
                          <div 
                            className="form-control" 
                            onClick={() => document.querySelector('input[name="toDate"]').showPicker()}
                            style={{ cursor: "pointer", background: "#f8f9fa" }}
                          >
                            {toDate ? formatDateForDisplay(toDate) : 'Click to select date'}
                          </div>
                          <div className="input-group-append">
                            <button 
                              className="btn btn-outline-secondary" 
                              type="button"
                              onClick={() => setToDate('')}
                              title="Clear date"
                            >
                              <i className="fa fa-times"></i>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Row for User Name filter */}
                  <div className="row mb-3">
                    <div className="col-md-4">
                      <div className="form-group">
                        <label>User Name</label>
                        <div className="input-group">
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Enter name to filter"
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                          />
                          {userName && (
                            <div className="input-group-append">
                              <button 
                                className="btn btn-outline-secondary" 
                                type="button"
                                onClick={() => setUserName('')}
                                title="Clear name"
                              >
                                <i className="fa fa-times"></i>
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {/* If document type filter is needed, it would go here */}
                    <div className="col-md-4">
                      <div className="form-group">
                        <label>{documentFilterLabel}</label>
                        <select
                          className="form-control"
                          value={selectedDocumentType}
                          onChange={(e) => setSelectedDocumentType(e.target.value)}
                        >
                          <option value="">
                            {allowedDocumentTypes ? `All ${title.replace('Report - ', '')} Document Types` : 'All Document Types'}
                          </option>
                          {documentTypes.map(docType => (
                            <option key={docType.documentTypeCode} value={docType.documentTypeCode}>
                              {docType.documentTypeDesc}
                            </option>
                          ))}
                        </select>
                        {allowedDocumentTypes && (
                          <small className="text-muted">
                            Only showing {title.replace('Report - ', '')} document types
                          </small>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Separate row for action buttons */}
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
                          className="btn btn-success" 
                          onClick={handleExportToExcel} 
                          disabled={loading || reportData.length === 0}
                        >
                          Export to Excel
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Report data table */}
                  <div className="table-responsive" style={{ maxHeight: '600px', overflowY: 'auto' }}>
                    <Table className="table table-head-fixed text-nowrap table-bordered table-hover">
                      <thead>
                        <tr>
                          <th>Document #</th>
                          <th>Type</th>
                          <th>Account #</th>
                          <th>Customer Name</th>
                          <th>Customer Type</th>
                          <th>Invoicing Company</th>
                          <th>Invoice #</th>
                          <th>Service #</th>
                          <th>Bill Date</th>
                          <th>Actual Bill Date</th>
                          <th>Adjustment Type</th>
                          <th>Amount</th>
                          <th>VAT</th>
                          <th>Total</th>
                          <th>Created Date</th>
                          <th>Created By</th>
                          <th>Reviewed Date</th>
                          <th>Reviewed By</th>
                          <th>Approved Date</th>
                          <th>Approved By</th>
                          <th>Finance Date</th>
                          <th>Finance By</th>
                          <th>SAP Doc #</th>
                          <th>SAP Doc Date</th>
                          <th>Home Location</th>
                          <th>Service Location</th>
                          <th>Sector</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {reportData.length === 0 ? (
                          <tr>
                            <td colSpan="28" className="text-center">{loading ? 'Loading...' : 'No data available'}</td>
                          </tr>
                        ) : (
                          reportData.map((item, index) => (
                            <tr key={index}>
                              <td>{item.documentNum}</td>
                              <td>{item.documentTypeDesc}</td>
                              <td>{item.accountNum}</td>
                              <td>{item.customerName}</td>
                              <td>{item.customerTypeName}</td>
                              <td>{item.invoicingCoName}</td>
                              <td>{item.invoiceNum}</td>
                              <td>{item.serviceNum}</td>
                              <td>{formatDateForDisplay(item.billDtm)}</td>
                              <td>{formatDateForDisplay(item.actualBillDtm)}</td>
                              <td>{item.adjustmentTypeName}</td>
                              <td align="right">{formatNumber(item.amount)}</td>
                              <td align="right">{formatNumber(item.vat)}</td>
                              <td align="right">{formatNumber(item.total)}</td>
                              <td>{formatDateForDisplay(item.createdDtm)}</td>
                              <td>{item.createdBy}</td>
                              <td>{formatDateForDisplay(item.reviewedDtm)}</td>
                              <td>{item.reviewedBy}</td>
                              <td>{formatDateForDisplay(item.approvedDtm)}</td>
                              <td>{item.approvedBy}</td>
                              <td>{formatDateForDisplay(item.financeReviewedDtm)}</td>
                              <td>{item.financeReviewedBy}</td>
                              <td>{item.sapDocNo}</td>
                              <td>{formatDateForDisplay(item.sapDocDate)}</td>
                              <td>{item.homeLocationCode}</td>
                              <td>{item.serviceLocationCode}</td>
                              <td>{item.sector}</td>
                              <td>{item.adjustmentStatus}</td>
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

export default BaseReport;