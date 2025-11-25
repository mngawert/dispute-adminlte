import React, { useState, useCallback, useEffect } from 'react';
import { Table } from 'react-bootstrap';
import api from '../api';
import ContentHeader from '../components/ContentHeader';
import LocationFilter from '../components/LocationFilter';
import { exportToExcel } from '../utils/exportUtils';
import { formatNumber, truncateText } from '../utils/utils';

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

const ReportB = () => {
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Simplified location states for use with LocationFilter component
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [showOnlyInactiveLocations, setShowOnlyInactiveLocations] = useState(false);
  
  // Add new state variables for user function and name filters
  const [userFunction, setUserFunction] = useState('');
  const [userName, setUserName] = useState('');

  // No need to fetch locations on mount as LocationFilter will handle it
  
  const fetchReportData = useCallback(async () => {
    setLoading(true);
    try {
      // Create base params object with scalar values
      const params = {
        fromDate: fromDate || undefined,
        toDate: toDate || undefined,
        showOnlyInactiveLocations: showOnlyInactiveLocations,
        userFunction: userFunction || undefined, // Add user function parameter
        name: userName || undefined // Add name parameter
      };
      
      // Create options for axios request
      const options = { params };
      
      // If we have locations, add them to the URL manually with proper format
      let url = '/api/Adjustment/ReportB';
      
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
  }, [fromDate, toDate, selectedLocations, showOnlyInactiveLocations, userFunction, userName]); // Add new dependencies

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

  // Keep existing handlers
  const handleFromDateChange = (e) => {
    setFromDate(e.target.value);
  };

  const handleToDateChange = (e) => {
    setToDate(e.target.value);
  };

  const handleExportToExcel = () => {
    if (reportData.length === 0) {
      alert('No data to export.');
      return;
    }

    // Format data for export
    const exportData = reportData.map(item => ({
      'Document Number': item.documentNum,
      'Document Type': item.documentTypeDesc,
      'Account Number (B-)': item.accountNum,
      'Customer Name (B-)': item.customerName,
      'Customer Type (B-)': item.customerTypeName,
      'Invoicing Company (B-)': item.invoicingCoName,
      'Invoice Number': item.invoiceNum,
      'Service Number (B-)': item.serviceNum,
      'Bill Month': item.billMonth,
      'Bill Date': formatDateForDisplay(item.billDtm),
      'Actual Bill Date': formatDateForDisplay(item.actualBillDtm),
      'Account Number (B+)': item.accountNum2,
      'Customer Name (B+)': item.customerName2,
      'Invoicing Company (B+)': item.invoicingCoName2,
      'Service Number (B+)': item.serviceNum2,
      'Amount': item.amount !== null ? Math.abs(item.amount) : null,
      'VAT': item.vat !== null ? Math.abs(item.vat) : null,
      'Total': item.total !== null ? Math.abs(item.total) : null,
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
      'Adjustment Status': item.adjustmentStatus,
      'Reason': item.reason // Use the full reason text for export
    }));

    exportToExcel(exportData, 'ReportB.xlsx');
  };

  return (
    <div className="content-wrapper-x">
      <ContentHeader title="Report - B1+/-" />
      <div className="content">
        <div className="container-fluid">
          <div className="row">
            <div className="col-12">
              <div className="card">
                <div className="card-body">
                  {/* Use LocationFilter component */}
                  <LocationFilter 
                    selectedLocations={selectedLocations}
                    onLocationSelect={handleAddLocation}
                    onLocationRemove={handleRemoveLocation}
                    showOnlyInactiveLocations={showOnlyInactiveLocations}
                    onInactiveLocationsChange={(checked) => setShowOnlyInactiveLocations(checked)}
                    loading={loading}
                  />
                  
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
                  </div>
                  
                  {/* Separate row for action buttons - aligned left instead of center */}
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
                  
                  {/* Report B table with the additional columns */}
                  <div className="table-responsive" style={{ maxHeight: '600px', overflowY: 'auto' }}>
                    <Table className="table table-head-fixed text-nowrap table-bordered table-hover">
                      <thead>
                        <tr>
                          <th>Document #</th>
                          <th>Type</th>
                          <th>Account # (B-)</th>
                          <th>Customer Name (B-)</th>
                          <th>Customer Type (B-)</th>
                          <th>Invoicing Company (B-)</th>
                          <th>Invoice #</th>
                          <th>Service # (B-)</th>
                          <th>Bill Month</th>
                          <th>Bill Date</th>
                          <th>Actual Bill Date</th>
                          <th>Account # (B+)</th>
                          <th>Customer Name (B+)</th>
                          <th>Invoicing Company (B+)</th>
                          <th>Service # (B+)</th>
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
                          <th>Reason</th>
                        </tr>
                      </thead>
                      <tbody>
                        {reportData.length === 0 ? (
                          <tr>
                            <td colSpan="33" className="text-center">{loading ? 'Loading...' : 'No data available'}</td>
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
                              <td>{item.billMonth}</td>
                              <td>{formatDateForDisplay(item.billDtm)}</td>
                              <td>{formatDateForDisplay(item.actualBillDtm)}</td>
                              <td>{item.accountNum2}</td>
                              <td>{item.customerName2}</td>
                              <td>{item.invoicingCoName2}</td>
                              <td>{item.serviceNum2}</td>
                              <td align="right">{item.amount !== null ? formatNumber(Math.abs(item.amount)) : ''}</td>
                              <td align="right">{item.vat !== null ? formatNumber(Math.abs(item.vat)) : ''}</td>
                              <td align="right">{item.total !== null ? formatNumber(Math.abs(item.total)) : ''}</td>
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
                              <td title={item.reason}>{truncateText(item.reason, 30)}</td>
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

export default ReportB;