import React, { useState, useEffect } from 'react';
import api from '../api';
import { Tab, Tabs } from 'react-bootstrap';
import ReviewDocType from './ReviewDocType';
import ContentHeader from '../components/ContentHeader';
import { loadReviewTabsConfig } from '../utils/configLoader';

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

  // Load configuration on component mount
  useEffect(() => {
    const loadConfig = async () => {
      const configData = await loadReviewTabsConfig();
      setConfig(configData);
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
    
    setVisibleTabs(calculatedVisibleTabs);
    
    // Find the first visible tab to set as active by default
    const firstVisibleTab = Object.keys(calculatedVisibleTabs).find(tab => calculatedVisibleTabs[tab]);
    if (firstVisibleTab && !calculatedVisibleTabs[activeTab]) {
      setActiveTab(firstVisibleTab);
    }
    
    getAllDocuments();
  }, [config, reviewType]);

  const handleInputChange = (e) => {
    setDocumentNum(e.target.value);
  };

  const getAllDocuments = async () => {
    try {
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
    try {
      const response = await api.put(`/api/Document/UpdateDocument${reviewType}Status/${doc.documentNum}`, {
        documentNum: doc.documentNum,
        documentStatus: _documentStatus,
        note: note,
        sapDocNo: sapDocNo,           
        sapDocDate: sapDocDate ? sapDocDate : null,
        updatedBy: JSON.parse(localStorage.getItem('userLogin'))?.userId
      });
      resetPage();
      getAllDocuments();
      resetMyNote();
    } catch (error) {
      console.error('Error updating document status', error);
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
                    <ReviewDocType documentTypeDesc='Adjust-' documents={documents} adjustmentRequests={adjustmentRequests} selectedDocument={selectedDocument} reviewType={reviewType} handleSelectDocument={handleSelectDocument} handleUpdateDocumentStatus={handleUpdateDocumentStatus} />
                  </Tab>
                )}
                {visibleTabs['Adjust+'] && (
                  <Tab eventKey="Adjust+" title="Adjust+">
                    <ReviewDocType documentTypeDesc='Adjust+' documents={documents} adjustmentRequests={adjustmentRequests} selectedDocument={selectedDocument} reviewType={reviewType} handleSelectDocument={handleSelectDocument} handleUpdateDocumentStatus={handleUpdateDocumentStatus} />
                  </Tab>
                )}
                {visibleTabs['P31'] && (
                  <Tab eventKey="P31" title="P31">
                    <ReviewDocType documentTypeDesc='P31' documents={documents} adjustmentRequests={adjustmentRequests} selectedDocument={selectedDocument} reviewType={reviewType} handleSelectDocument={handleSelectDocument} handleUpdateDocumentStatus={handleUpdateDocumentStatus} />
                  </Tab>
                )}
                {visibleTabs['P32'] && (
                  <Tab eventKey="P32" title="P32">
                    <ReviewDocType documentTypeDesc='P32' documents={documents} adjustmentRequests={adjustmentRequests} selectedDocument={selectedDocument} reviewType={reviewType} handleSelectDocument={handleSelectDocument} handleUpdateDocumentStatus={handleUpdateDocumentStatus} />
                  </Tab>
                )}
                {visibleTabs['P35'] && (
                  <Tab eventKey="P35" title="P35">
                    <ReviewDocType documentTypeDesc='P35' documents={documents} adjustmentRequests={adjustmentRequests} selectedDocument={selectedDocument} reviewType={reviewType} handleSelectDocument={handleSelectDocument} handleUpdateDocumentStatus={handleUpdateDocumentStatus} />
                  </Tab>
                )}
                {visibleTabs['P36'] && (
                  <Tab eventKey="P36" title="P36">
                    <ReviewDocType documentTypeDesc='P36' documents={documents} adjustmentRequests={adjustmentRequests} selectedDocument={selectedDocument} reviewType={reviewType} handleSelectDocument={handleSelectDocument} handleUpdateDocumentStatus={handleUpdateDocumentStatus} />
                  </Tab>
                )}
                {visibleTabs['P3-'] && (
                  <Tab eventKey="P3-" title="P3-">
                    <ReviewDocType documentTypeDesc='P3-' documents={documents} adjustmentRequests={adjustmentRequests} selectedDocument={selectedDocument} reviewType={reviewType} handleSelectDocument={handleSelectDocument} handleUpdateDocumentStatus={handleUpdateDocumentStatus} />
                  </Tab>
                )}
                {visibleTabs['P3+'] && (
                  <Tab eventKey="P3+" title="P3+">
                    <ReviewDocType documentTypeDesc='P3+' documents={documents} adjustmentRequests={adjustmentRequests} selectedDocument={selectedDocument} reviewType={reviewType} handleSelectDocument={handleSelectDocument} handleUpdateDocumentStatus={handleUpdateDocumentStatus} />
                  </Tab>
                )}
                {visibleTabs['B1+/-'] && (
                  <Tab eventKey="B1+/-" title="B1+/-">
                    <ReviewDocType documentTypeDesc='B1+/-' documents={documents} adjustmentRequests={adjustmentRequests} selectedDocument={selectedDocument} reviewType={reviewType} handleSelectDocument={handleSelectDocument} handleUpdateDocumentStatus={handleUpdateDocumentStatus} />
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