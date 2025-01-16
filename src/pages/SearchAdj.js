import React, { useState } from 'react';
import api from '../api';
import { DOCUMENT_STATUS_LIST } from '../contexts/Constants';

const SearchAdj = () => {

    const [documentNum, setDocumentNum] = useState('');
    const [documents, setDocuments] = useState([]);
    const [selectedDocument, setSelectedDocument] = useState(null);
    const [adjustmentRequests, setAdjustmentRequests] = useState([]);

    const [documentStatus, setDocumentStatus] = useState(DOCUMENT_STATUS_LIST);
    const [selectedDocumentStatus, setSelectedDocumentStatus] = useState('');

    const handleInputChange = (e) => {
      setDocumentNum(e.target.value);
    };

    const getAllDocuments = async () => {
      try {        
          const response = await api.get(`/api/Document/GetAllDocuments`, {
              params: {
                  documentStatus: selectedDocumentStatus,
                  documentNum: documentNum,
                  //onlyLocationOfUserId: JSON.parse(localStorage.getItem('userLogin'))?.userId
              }
          });
          console.log('response.data', response.data);
          setDocuments(response.data);
      } catch (error) {
          console.error('Error fetching data', error);
      }
    };

    const handleSearch = async () => {
        getAllDocuments();

        /* Clear selected document and adjustment requests */
        setSelectedDocument(null);
        setAdjustmentRequests([]);
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

    return (
      <div className="content-wrapper-x">
        {/* Content Header (Page header) */}
        <div className="content-header">
          <div className="container-fluid">
            <div className="row mb-2">
              <div className="col-sm-6">
                <h1 className="m-0">Page Title</h1>
              </div>{/* /.col */}
              <div className="col-sm-6">
                <ol className="breadcrumb float-sm-right">
                  <li className="breadcrumb-item"><a href="#">Home</a></li>
                  <li className="breadcrumb-item active">Page Title</li>
                </ol>
              </div>{/* /.col */}
            </div>{/* /.row */}
          </div>{/* /.container-fluid */}
        </div>
        {/* /.content-header */}
        {/* Main content */}
        <div className="content">
          <div className="container-fluid">
            <div className="row">
              <div className="col-12">
                {/* START CONTENT */}
                <div className="card">
                  <div className="card-body">
                    <div className="row">
                      <div className="col-sm-4">
                        <div className="form-group d-flex align-items-center">
                          <label style={{width: 160}}>Search for:</label>
                          {/* <select className="form-control">
                            <option>option 1</option>
                            <option>option 2</option>
                            <option>option 3</option>
                            <option>option 4</option>
                            <option>option 5</option>
                          </select> */}

                          <select className="form-control" onChange={(e) => setSelectedDocumentStatus(e.target.value)} value={selectedDocumentStatus}>
                              <option value="">All</option>
                              {documentStatus.map((status, index) => (
                                <option key={index} value={status}>{status}</option>
                              ))}
                          </select>

                        </div>
                      </div>
                      <div className="col-sm-3">
                        <div className="form-group">
                          <input type="text" className="form-control" onChange={handleInputChange} value={documentNum} />
                        </div>
                      </div>
                      <div className="col-sm-5">
                        <div className="form-group">
                          <button type="button" className="btn btn-primary" onClick={handleSearch} >Search</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="card">
                  <div className="card-body">
                    <p className="mb-3">Documents</p>
                    <div className="row mb-3">
                      <div className="col-12">
                        <div className="table-responsive" style={{height: 200}}>
                          <table className="table table-head-fixed text-nowrap table-bordered table-hover">
                            <thead>
                              <tr>
                                <th>Document Number</th>
                                <th>Type</th>
                                <th>Total Amount</th>
                                <th>Created by</th>
                                <th>Created date</th>
                                <th>Location</th>
                                <th>Status</th>
                              </tr>
                            </thead>
                            <tbody>
                              {documents.map((document, index) => (
                                <tr key={index} onClick={() => handleSelectDocument(document)} className={document.documentNum === selectedDocument?.documentNum ? 'selected' : ''}>
                                  <td>{document.documentNum}</td>
                                  <td>{document.documentTypeDesc}</td>
                                  <td>{document.totalMny}</td>
                                  <td>{document.createdByName}</td>
                                  <td>{new Date(document.createdDtm).toLocaleString()}</td>
                                  <td>{document.homeLocationCode}</td>
                                  <td>{document.documentStatus}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-sm-6 col-md-4 col-lg-2">
                        <div className="form-group mb-2">
                          <label>Reviewed by</label>
                          <input type="text" className="form-control" readOnly value={selectedDocument?.reviewedByName || ''} />
                        </div>
                        {/* <div className="form-group">
                          <input type="text" className="form-control" readOnly />
                        </div> */}
                      </div>
                      <div className="col-sm-6 col-md-4 col-lg-2">
                        <div className="form-group mb-2">
                          <label>Approved by</label>
                          <input type="text" className="form-control" readOnly value={selectedDocument?.approvedByName || ''} />
                        </div>
                        {/* <div className="form-group">
                          <input type="text" className="form-control" readOnly />
                        </div> */}
                      </div>
                      <div className="col-sm-6 col-md-4 col-lg-2">
                        <div className="form-group mb-2">
                          <label>Finance by</label>
                          <input type="text" className="form-control" readOnly value={selectedDocument?.financeReviewedByName || ''} />
                        </div>
                        {/* <div className="form-group">
                          <input type="text" className="form-control" readOnly />
                        </div> */}
                      </div>
                      <div className="col-sm-6 col-md-4 col-lg-2">
                        <div className="form-group mb-2">
                          <label>Rejected by</label>
                          <input type="text" className="form-control" readOnly />
                        </div>
                        {/* <div className="form-group">
                          <input type="text" className="form-control" readOnly />
                        </div> */}
                      </div>
                      <div className="col-sm-6 col-md-4 col-lg-2">
                        <div className="form-group mb-2">
                          <label>Cancelled by</label>
                          <input type="text" className="form-control" readOnly />
                        </div>
                        {/* <div className="form-group">
                          <input type="text" className="form-control" readOnly />
                        </div> */}
                      </div>
                      <div className="col-sm-6 col-md-4 col-lg-2">
                        <div className="form-group mb-2">
                          <label>SAP Doc</label>
                          <input type="text" className="form-control" readOnly />
                        </div>
                        {/* <div className="form-group">
                          <input type="text" className="form-control" readOnly />
                        </div> */}
                      </div>
                    </div>
                    <div className="row mb-3 d-flex">
                      <div className="col-sm-4">
                        <div className="form-group">
                          <label>Status</label>
                          <input type="text" className="form-control" readOnly value={selectedDocument?.documentStatus || ''} />
                        </div>
                      </div>
                    </div>
                    <div className="table-responsive" style={{height: 300}}>
                        <table className="table table-head-fixed text-nowrap table-bordered table-hover">
                        <thead>
                            <tr>
                            <th>Account Number</th>
                            <th>Invoice Number</th>
                            <th>Service Number</th>
                            <th>Adjustment Type</th>
                            <th>Amount</th>
                            <th>VAT</th>
                            <th>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {adjustmentRequests.map((adj, index) => (
                                <tr key={index}>
                                    <td>{adj.accountNum}</td>
                                    <td>{adj.invoiceNum}</td>
                                    <td>{adj.serviceNum}</td>
                                    <td>{adj.adjustmentTypeName}</td>
                                    <td align='center'>{adj.disputeMny.toFixed(2)}</td>
                                    <td align='center'>{(adj.disputeMny*0.07).toFixed(2)}</td>
                                    <td align='center'>{(adj.disputeMny*1.07).toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                        </table>
                    </div>

                  </div>
                </div>
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
}

export default SearchAdj;
