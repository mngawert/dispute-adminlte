import React, { useState, useEffect } from 'react';
import api from '../api';
import { Tab, Tabs } from 'react-bootstrap';
import ReviewDocType from './ReviewDocType';
import ContentHeader from '../components/ContentHeader';

const Review = ({ reviewType, prevDocumentStatus }) => {

  const [documentNum, setDocumentNum] = useState('');
  const [documents, setDocuments] = useState([]);
  const [selectedDocument, setSelectedDocument] = useState({});
  const [adjustmentRequests, setAdjustmentRequests] = useState([]);
  const [activeTab, setActiveTab] = useState('P35');

  useEffect(() => {
    getAllDocuments();
  }, []);

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

      if (fetchedDocuments.length === 1) {
        const doc = fetchedDocuments[0];
        setSelectedDocument(doc);
        setActiveTab(doc.documentTypeDesc);
        fetchAdjustmentRequests(doc.documentNum);
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

  const handleUpdateDocumentStatus = async (doc, _documentStatus, note, resetMyNote) => {
    try {
      const response = await api.put(`/api/Document/UpdateDocument${reviewType}Status/${doc.documentNum}`, {
        documentNum: doc.documentNum,
        documentStatus: _documentStatus,
        note: note,
        updatedBy: JSON.parse(localStorage.getItem('userLogin'))?.userId
      });
      resetPage();
      getAllDocuments();
      resetMyNote(); // Reset myNote after updating document status
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
    setActiveTab(k);
    setSelectedDocument({});
    setAdjustmentRequests([]);
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
                <Tab eventKey="Adjust-" title="Adjust-">
                  <ReviewDocType documentTypeDesc='Adjust-' documents={documents} adjustmentRequests={adjustmentRequests} selectedDocument={selectedDocument} reviewType={reviewType} handleSelectDocument={handleSelectDocument} handleUpdateDocumentStatus={handleUpdateDocumentStatus} />
                </Tab>
                <Tab eventKey="Adjust+" title="Adjust+">
                  <ReviewDocType documentTypeDesc='Adjust+' documents={documents} adjustmentRequests={adjustmentRequests} selectedDocument={selectedDocument} reviewType={reviewType} handleSelectDocument={handleSelectDocument} handleUpdateDocumentStatus={handleUpdateDocumentStatus} />
                </Tab>
                <Tab eventKey="P31" title="P31">
                  <ReviewDocType documentTypeDesc='P31' documents={documents} adjustmentRequests={adjustmentRequests} selectedDocument={selectedDocument} reviewType={reviewType} handleSelectDocument={handleSelectDocument} handleUpdateDocumentStatus={handleUpdateDocumentStatus} />
                </Tab>
                <Tab eventKey="P32" title="P32">
                  <ReviewDocType documentTypeDesc='P32' documents={documents} adjustmentRequests={adjustmentRequests} selectedDocument={selectedDocument} reviewType={reviewType} handleSelectDocument={handleSelectDocument} handleUpdateDocumentStatus={handleUpdateDocumentStatus} />
                </Tab>
                <Tab eventKey="P35" title="P35">
                  <ReviewDocType documentTypeDesc='P35' documents={documents} adjustmentRequests={adjustmentRequests} selectedDocument={selectedDocument} reviewType={reviewType} handleSelectDocument={handleSelectDocument} handleUpdateDocumentStatus={handleUpdateDocumentStatus} />
                </Tab>
                <Tab eventKey="P36" title="P36">
                  <ReviewDocType documentTypeDesc='P36' documents={documents} adjustmentRequests={adjustmentRequests} selectedDocument={selectedDocument} reviewType={reviewType} handleSelectDocument={handleSelectDocument} handleUpdateDocumentStatus={handleUpdateDocumentStatus} />
                </Tab>

                <Tab eventKey="P3-" title="P3-">
                  <ReviewDocType documentTypeDesc='P3-' documents={documents} adjustmentRequests={adjustmentRequests} selectedDocument={selectedDocument} reviewType={reviewType} handleSelectDocument={handleSelectDocument} handleUpdateDocumentStatus={handleUpdateDocumentStatus} />
                </Tab>
                <Tab eventKey="P3+" title="P3+">
                  <ReviewDocType documentTypeDesc='P3+' documents={documents} adjustmentRequests={adjustmentRequests} selectedDocument={selectedDocument} reviewType={reviewType} handleSelectDocument={handleSelectDocument} handleUpdateDocumentStatus={handleUpdateDocumentStatus} />
                </Tab>

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