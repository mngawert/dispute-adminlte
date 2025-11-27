import React, { useState, useEffect, useRef } from 'react';
import api from '../api';
import { Tab, Tabs } from 'react-bootstrap';
import ReviewDocType from './ReviewDocType';
import ContentHeader from '../components/ContentHeader';
import { loadReviewTabsConfig } from '../utils/configLoader';
import { jwtDecode } from 'jwt-decode';

const Review = ({ reviewType, prevDocumentStatus }) => {

  const [documentNum, setDocumentNum] = useState('');
  const [documents, setDocuments] = useState([]);
  const [selectedDocument, setSelectedDocument] = useState({});
  const [adjustmentRequests, setAdjustmentRequests] = useState([]);
  const [activeTab, setActiveTab] = useState('P35');
  const [visibleTabs, setVisibleTabs] = useState({});
  const [config, setConfig] = useState({
    tabConfig: {}, 
    financeRestrictedTabs: []
  });

  // Add refs to prevent double API calls
  const isUpdatingRef = useRef(false);
  const isFetchingRef = useRef(false);
  const lastUpdateRef = useRef(null);

  // Load configuration on component mount
  useEffect(() => {
    const loadConfig = async () => {
      try {
        console.log("Review: Loading tab configuration...");
        const configData = await loadReviewTabsConfig();
        console.log("Review: Tab configuration loaded:", configData);
        setConfig(configData);
      } catch (error) {
        console.error("Review: Failed to load tab configuration:", error);
      }
    };
    
    loadConfig();
  }, []);

  // Update visible tabs when config or reviewType changes
  useEffect(() => {
    if (Object.keys(config.tabConfig).length === 0) return;

    // Calculate visible tabs based on configuration and review type
    const calculatedVisibleTabs = { ...config.tabConfig };
    
    // For Finance review, hide restricted tabs regardless of config
    if (reviewType === 'Finance') {
      config.financeRestrictedTabs.forEach(tab => {
        calculatedVisibleTabs[tab] = false;
      });
    }
    
    // For Cancel review, check user role
    if (reviewType === 'Cancel') {
      try {
        const token = localStorage.getItem("authToken");
        if (token) {
          const decodedToken = jwtDecode(token);
          const roles = decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || [];
          const userRoles = Array.isArray(roles) ? roles : [roles];
          
          // If user has Approver role (but not Admin), show only Adjust-, Adjust+, and B1+/-
          if (userRoles.includes('Approver') && !userRoles.includes('Admin')) {
            Object.keys(calculatedVisibleTabs).forEach(tab => {
              if (!['Adjust-', 'Adjust+', 'B1+/-'].includes(tab)) {
                calculatedVisibleTabs[tab] = false;
              }
            });
          }
        }
      } catch (error) {
        console.error("Error decoding token for role-based tab visibility:", error);
      }
    }
    
    setVisibleTabs(calculatedVisibleTabs);
    
    // Find the first visible tab to set as active by default
    const firstVisibleTab = Object.keys(calculatedVisibleTabs).find(tab => calculatedVisibleTabs[tab]);
    if (firstVisibleTab && !calculatedVisibleTabs[activeTab]) {
      setActiveTab(firstVisibleTab);
    }
    
    // Only fetch documents if not currently updating
    if (!isUpdatingRef.current) {
      getAllDocuments();
    }
  }, [config, reviewType]);

  const handleInputChange = (e) => {
    setDocumentNum(e.target.value);
  };

  const getAllDocuments = async () => {
    // Prevent double API calls
    if (isFetchingRef.current) {
      console.log('getAllDocuments: Already fetching, skipping duplicate call');
      return;
    }

    isFetchingRef.current = true;
    
    try {
      console.log('getAllDocuments: Starting API call');
      const response = await api.get(`/api/Document/GetAllDocuments`, {
        params: {
          documentStatus: prevDocumentStatus,
          documentNum: documentNum
        }
      });
      const fetchedDocuments = response.data;
      setDocuments(fetchedDocuments);

      console.log('Fetched Documents:', fetchedDocuments);

      if (fetchedDocuments.length === 1) {
        const doc = fetchedDocuments[0];
        console.log('Selected Document:', doc);
        setSelectedDocument(doc);
        // Only set active tab if it's visible
        if (visibleTabs[doc.documentTypeDesc]) {
          setActiveTab(doc.documentTypeDesc);
          fetchAdjustmentRequests(doc.documentNum);
        } else {
          // If tab isn't visible, don't switch to it
          setAdjustmentRequests([]);
        }
      } else {
        setSelectedDocument({});
        setAdjustmentRequests([]);
      }
    } catch (error) {
      console.error('Error fetching data', error);
    } finally {
      isFetchingRef.current = false;
    }
  };

  const handleSearch = async () => {
    getAllDocuments();
  };

  const handleSelectDocument = async (doc) => {
    setSelectedDocument(doc);
    fetchAdjustmentRequests(doc.documentNum);
  };

  const fetchAdjustmentRequests = async (documentNum) => {
    try {
      const response = await api.get(`/api/Adjustment/GetAdjustmentRequests`, {
        params: {
          documentNum: documentNum
        }
      });
      setAdjustmentRequests(response.data);
    } catch (error) {
      console.error('Error fetching adjustment requests', error);
    }
  };

  const handleUpdateDocumentStatus = async (doc, _documentStatus, note, resetMyNote, sapDocNo, sapDocDate) => {
    // SAFETY CHECK 1: Validate required parameters
    if (!doc || !doc.documentNum || !_documentStatus) {
      console.error('handleUpdateDocumentStatus: Missing required parameters', { doc, _documentStatus });
      alert('Error: Missing required document information');
      return;
    }

    // SAFETY CHECK 2: Prevent double API calls with debouncing
    if (isUpdatingRef.current) {
      console.log('handleUpdateDocumentStatus: Update already in progress, skipping duplicate call');
      return;
    }

    // SAFETY CHECK 3: Prevent rapid successive calls
    const currentTime = Date.now();
    if (lastUpdateRef.current && (currentTime - lastUpdateRef.current) < 2000) {
      console.log('handleUpdateDocumentStatus: Recent update detected, skipping duplicate call');
      return;
    }

    // Set protection flags
    isUpdatingRef.current = true;
    lastUpdateRef.current = currentTime;

    try {
      console.log(`handleUpdateDocumentStatus: Starting update for ${doc.documentNum} to ${_documentStatus}`);
      
      // CRITICAL API CALL - This is the most important part
      const response = await api.put(`/api/Document/UpdateDocument${reviewType}Status/${doc.documentNum}`, {
        documentNum: doc.documentNum,
        documentStatus: _documentStatus,
        note: note,
        sapDocNo: sapDocNo,           
        sapDocDate: sapDocDate ? sapDocDate : null,
        updatedBy: JSON.parse(localStorage.getItem('userLogin'))?.userId
      });

      console.log('handleUpdateDocumentStatus: Update successful', response.data);
      
      // SAFETY: Reset page state immediately
      resetPage();
      resetMyNote();
      
      // SAFETY: Force refresh with retry mechanism
      const refreshWithRetry = async (attempts = 0) => {
        if (attempts >= 3) {
          console.error('handleUpdateDocumentStatus: Max refresh attempts reached');
          isUpdatingRef.current = false; // Release lock
          return;
        }

        try {
          // Force refresh by temporarily resetting fetch flag
          isFetchingRef.current = false;
          await getAllDocuments();
          isUpdatingRef.current = false; // Success - release lock
        } catch (refreshError) {
          console.warn(`handleUpdateDocumentStatus: Refresh attempt ${attempts + 1} failed, retrying...`);
          setTimeout(() => refreshWithRetry(attempts + 1), 500);
        }
      };

      // Start refresh after a short delay
      setTimeout(() => {
        console.log('handleUpdateDocumentStatus: Starting refresh with retry mechanism');
        refreshWithRetry();
      }, 300);
      
    } catch (error) {
      console.error('Error updating document status', error);
      
      // SAFETY: Show user-friendly error message
      const errorMessage = error.response?.data?.message || error.message || 'Unknown error occurred';
      alert(`Failed to update document status: ${errorMessage}`);
      
      // SAFETY: Reset flags on error
      isUpdatingRef.current = false;
      
      // SAFETY: Don't reset page state on error - let user retry
    }
  };

  const resetPage = () => {
    setDocumentNum('');
    setDocuments([]);
    setSelectedDocument({});
    setAdjustmentRequests([]);
  };

  const handleTabSelect = (k) => {
    if (visibleTabs[k]) {
      setActiveTab(k);
      setSelectedDocument({});
      setAdjustmentRequests([]);
    }
  };

  return (
    <div className="content-wrapper-x">
      {/* Content Header (Page header) */}
      <ContentHeader title={reviewType + " Adjustments"} />
      {/* /.content-header */}
      {/* Main content */}
      <div className="content">
        <div className="container-fluid">
          <div className="row">
            <div className="col-12">
              {/* START CONTENT */}
              <div className="form-inline">
                <p className="ml-auto flex-column text-right">
                  <input type="text" className="form-control mr-1" placeholder="Document Sequence" onChange={handleInputChange} value={documentNum} />
                  <button type="button" className="btn btn-primary mr-1" onClick={handleSearch} >Search</button>
                </p>
              </div>

              <Tabs activeKey={activeTab} onSelect={handleTabSelect}>
                {visibleTabs['Adjust-'] && (
                  <Tab eventKey="Adjust-" title="Adjust-">
                    <ReviewDocType documentTypeDesc='Adjust-' documents={documents} adjustmentRequests={adjustmentRequests} selectedDocument={selectedDocument} reviewType={reviewType} handleSelectDocument={handleSelectDocument} handleUpdateDocumentStatus={handleUpdateDocumentStatus} isUpdating={isUpdatingRef} />
                  </Tab>
                )}
                {visibleTabs['Adjust+'] && (
                  <Tab eventKey="Adjust+" title="Adjust+">
                    <ReviewDocType documentTypeDesc='Adjust+' documents={documents} adjustmentRequests={adjustmentRequests} selectedDocument={selectedDocument} reviewType={reviewType} handleSelectDocument={handleSelectDocument} handleUpdateDocumentStatus={handleUpdateDocumentStatus} isUpdating={isUpdatingRef} />
                  </Tab>
                )}
                {visibleTabs['P31'] && (
                  <Tab eventKey="P31" title="P31">
                    <ReviewDocType documentTypeDesc='P31' documents={documents} adjustmentRequests={adjustmentRequests} selectedDocument={selectedDocument} reviewType={reviewType} handleSelectDocument={handleSelectDocument} handleUpdateDocumentStatus={handleUpdateDocumentStatus} isUpdating={isUpdatingRef} />
                  </Tab>
                )}
                {visibleTabs['P32'] && (
                  <Tab eventKey="P32" title="P32">
                    <ReviewDocType documentTypeDesc='P32' documents={documents} adjustmentRequests={adjustmentRequests} selectedDocument={selectedDocument} reviewType={reviewType} handleSelectDocument={handleSelectDocument} handleUpdateDocumentStatus={handleUpdateDocumentStatus} isUpdating={isUpdatingRef} />
                  </Tab>
                )}
                {visibleTabs['P35'] && (
                  <Tab eventKey="P35" title="P35">
                    <ReviewDocType documentTypeDesc='P35' documents={documents} adjustmentRequests={adjustmentRequests} selectedDocument={selectedDocument} reviewType={reviewType} handleSelectDocument={handleSelectDocument} handleUpdateDocumentStatus={handleUpdateDocumentStatus} isUpdating={isUpdatingRef} />
                  </Tab>
                )}
                {visibleTabs['P36'] && (
                  <Tab eventKey="P36" title="P36">
                    <ReviewDocType documentTypeDesc='P36' documents={documents} adjustmentRequests={adjustmentRequests} selectedDocument={selectedDocument} reviewType={reviewType} handleSelectDocument={handleSelectDocument} handleUpdateDocumentStatus={handleUpdateDocumentStatus} isUpdating={isUpdatingRef} />
                  </Tab>
                )}
                {visibleTabs['P3-'] && (
                  <Tab eventKey="P3-" title="P3-">
                    <ReviewDocType documentTypeDesc='P3-' documents={documents} adjustmentRequests={adjustmentRequests} selectedDocument={selectedDocument} reviewType={reviewType} handleSelectDocument={handleSelectDocument} handleUpdateDocumentStatus={handleUpdateDocumentStatus} isUpdating={isUpdatingRef} />
                  </Tab>
                )}
                {visibleTabs['P3+'] && (
                  <Tab eventKey="P3+" title="P3+">
                    <ReviewDocType documentTypeDesc='P3+' documents={documents} adjustmentRequests={adjustmentRequests} selectedDocument={selectedDocument} reviewType={reviewType} handleSelectDocument={handleSelectDocument} handleUpdateDocumentStatus={handleUpdateDocumentStatus} isUpdating={isUpdatingRef} />
                  </Tab>
                )}
                {visibleTabs['B1+/-'] && (
                  <Tab eventKey="B1+/-" title="B1+/-">
                    <ReviewDocType documentTypeDesc='B1+/-' documents={documents} adjustmentRequests={adjustmentRequests} selectedDocument={selectedDocument} reviewType={reviewType} handleSelectDocument={handleSelectDocument} handleUpdateDocumentStatus={handleUpdateDocumentStatus} isUpdating={isUpdatingRef} />
                  </Tab>
                )}
              </Tabs>

              {/* END CONTENT */}
            </div>
          </div>
          {/* /.row */}
        </div>
        {/* /.container-fluid */}
      </div>
      {/* /.content */}
    </div>
  );
};

export default Review;