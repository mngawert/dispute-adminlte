import React, { useState } from 'react';
import api from '../api';
import { CPS_MAP_HASH } from '../contexts/Constants';
import { Tab, Tabs } from 'react-bootstrap';
import ReviewDocType from './ReviewDocType';
import ContentHeader from '../components/ContentHeader';

const Review = ({ reviewType, prevDocumentStatus }) => {

  console.log(reviewType);
  console.log(prevDocumentStatus);

  const [documentNum, setDocumentNum] = useState('');
  const [documents, setDocuments] = useState([]);
  const [selectedDocument, setSelectedDocument] = useState({});
  const [adjustmentRequests, setAdjustmentRequests] = useState([]);

  const [activeTab, setActiveTab] = useState('P36');

  const filterDocumentsByType = (type) => {
    return documents.filter(doc => doc.documentTypeDesc === type);
  };

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
      setDocuments(response.data);
    } catch (error) {
      console.error('Error fetching data', error);
    }
  };

  const handleSearch = async () => {
    getAllDocuments();
  };

  const handleSelectDocument = async (doc) => {
    setSelectedDocument(doc);

    try {
      const response = await api.get(`/api/Adjustment/GetAdjustmentRequests`, {
        params: {
          documentNum: doc.documentNum
        }
      });
      console.log(response.data);
      setAdjustmentRequests(response.data);
    } catch (error) {
      console.error('Error fetching adjustment requests', error);
    }
  }

  const handleUpdateDocumentStatus = async (doc, _documentStatus) => {
    try {
      const response = await api.put(`/api/Document/UpdateDocument${reviewType}Status/${doc.documentNum}`, {
        documentNum: doc.documentNum,
        documentStatus: _documentStatus,
        updatedBy: JSON.parse(localStorage.getItem('userLogin'))?.userId
      });
      console.log(response.data);
      resetPage();
      getAllDocuments();
    } catch (error) {
      console.error('Error updating document status', error);
    }
  }

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
                  <input type="text" className="form-control mr-1" placeholder="Document Number" onChange={handleInputChange} value={documentNum} />
                  <button type="button" className="btn btn-primary mr-1" onClick={handleSearch} >Search</button>
                  {/* <button type="button" className="btn btn-default">Get more</button> */}
                </p>
              </div>

              <Tabs activeKey={activeTab} onSelect={handleTabSelect}>
                <Tab eventKey="P35" title="P35">
                  <ReviewDocType documentTypeDesc='P35' documents={documents} adjustmentRequests={adjustmentRequests} selectedDocument={selectedDocument} reviewType={reviewType} handleSelectDocument={handleSelectDocument} handleUpdateDocumentStatus={handleUpdateDocumentStatus} />
                </Tab>
                <Tab eventKey="P36" title="P36">
                  <ReviewDocType documentTypeDesc='P36' documents={documents} adjustmentRequests={adjustmentRequests} selectedDocument={selectedDocument} reviewType={reviewType} handleSelectDocument={handleSelectDocument} handleUpdateDocumentStatus={handleUpdateDocumentStatus} />
                </Tab>
                {/* <Tab eventKey="Adjust-" title="Adjust-">
                  <ReviewDocType documentTypeDesc='Adjust-' documents={documents} adjustmentRequests={adjustmentRequests} selectedDocument={selectedDocument} reviewType={reviewType} handleSelectDocument={handleSelectDocument} handleUpdateDocumentStatus={handleUpdateDocumentStatus} />
                </Tab>
                <Tab eventKey="Adjust+" title="Adjust+">
                  <ReviewDocType documentTypeDesc='Adjust+' documents={documents} adjustmentRequests={adjustmentRequests} selectedDocument={selectedDocument} reviewType={reviewType} handleSelectDocument={handleSelectDocument} handleUpdateDocumentStatus={handleUpdateDocumentStatus} />
                </Tab> */}
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