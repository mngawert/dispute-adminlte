import React, { useState, useEffect } from 'react';
import api from '../api';
import { DOCUMENT_STATUS_LIST, SEARCH_BY_LIST } from '../contexts/Constants';
import ContentHeader from '../components/ContentHeader'; // Adjust the import path as necessary

const SearchAdj = ({ myAdjust, title }) => {
    const [documentNum, setDocumentNum] = useState('');
    const [documents, setDocuments] = useState([]);
    const [selectedDocument, setSelectedDocument] = useState(null);
    const [adjustmentRequests, setAdjustmentRequests] = useState([]);
    const [searchBy, setSearchBy] = useState(SEARCH_BY_LIST);
    const [selectedSearchBy, setSelectedSearchBy] = useState(null);
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        const userLogin = JSON.parse(localStorage.getItem('userLogin'));
        setUserId(userLogin?.userId);
    }, []);

    const handleSearchByChange = (e) => {
        const selectedOption = searchBy.find(search => search.value === e.target.value);
        setSelectedSearchBy(selectedOption);
    }

    const handleInputChange = (e) => {
        setDocumentNum(e.target.value);
    };

    const getAllDocuments = async () => {
        try {
            const params = {
                documentNum: documentNum,
                searchBy: selectedSearchBy?.value
            };
            if (myAdjust === 'Yes' && userId) {
                params.createdBy = userId;
            }
            const response = await api.get(`/api/Document/GetAllDocuments`, { params });
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
            setAdjustmentRequests(response.data);
        } catch (error) {
            console.error('Error fetching adjustment requests', error);
        }
    }

    return (
        <div className="content-wrapper-x">
            {/* Content Header (Page header) */}
            <ContentHeader title={title} />
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
                                                <label style={{ width: 160 }}>Search for:</label>
                                                <select className="form-control" onChange={(e) => handleSearchByChange(e)} value={selectedSearchBy?.value}>
                                                    <option value="">All</option>
                                                    {searchBy.map((search, index) => (
                                                        <option key={index} value={search.value}>{search.name}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                        <div className="col-sm-3">
                                            <div className="form-group">
                                                <input type="text" className="form-control" onChange={handleInputChange} value={documentNum} disabled={!selectedSearchBy?.value} />
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
                                            <div className="table-responsive" style={{ height: 200 }}>
                                                <table className="table table-head-fixed text-nowrap table-bordered table-hover">
                                                    <thead>
                                                        <tr>
                                                            <th>Document Number</th>
                                                            <th>Type</th>
                                                            <th>Total Amount</th>
                                                            <th>Created by</th>
                                                            <th>Created date</th>
                                                            <th>Location</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {documents.map((document, index) => (
                                                            <tr key={index} onClick={() => handleSelectDocument(document)} className={document.documentNum === selectedDocument?.documentNum ? 'selected' : ''}>
                                                                <td>{document.documentNum}</td>
                                                                <td>{document.documentTypeDesc}</td>
                                                                <td>{document.totalMny}</td>
                                                                <td>{document.createdByName}</td>
                                                                <td>{new Date(document.createdDtm).toLocaleString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' })}</td>
                                                                <td>{document.homeLocationCode}</td>
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
                                            <div className="form-group">
                                                <input type="text" className="form-control" readOnly value={selectedDocument?.reviewedDtm ? new Date(selectedDocument.reviewedDtm).toLocaleString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' }) : ''} />
                                            </div>
                                        </div>
                                        <div className="col-sm-6 col-md-4 col-lg-2">
                                            <div className="form-group mb-2">
                                                <label>Approved by</label>
                                                <input type="text" className="form-control" readOnly value={selectedDocument?.approvedByName || ''} />
                                            </div>
                                            <div className="form-group">
                                                <input type="text" className="form-control" readOnly value={selectedDocument?.approvedDtm ? new Date(selectedDocument.approvedDtm).toLocaleString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' }) : ''} />
                                            </div>
                                        </div>
                                        <div className="col-sm-6 col-md-4 col-lg-2">
                                            <div className="form-group mb-2">
                                                <label>Finance by</label>
                                                <input type="text" className="form-control" readOnly value={selectedDocument?.financeReviewedByName || ''} />
                                            </div>
                                            <div className="form-group">
                                                <input type="text" className="form-control" readOnly value={selectedDocument?.financeReviewedDtm ? new Date(selectedDocument.financeReviewedDtm).toLocaleString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' }) : ''} />
                                            </div>
                                        </div>
                                        <div className="col-sm-6 col-md-4 col-lg-2">
                                            <div className="form-group mb-2">
                                                <label>Rejected by</label>
                                                <input type="text" className="form-control" readOnly />
                                            </div>
                                            <div className="form-group">
                                                <input type="text" className="form-control" readOnly />
                                            </div>
                                        </div>
                                        <div className="col-sm-6 col-md-4 col-lg-2">
                                            <div className="form-group mb-2">
                                                <label>Cancelled by</label>
                                                <input type="text" className="form-control" readOnly />
                                            </div>
                                            <div className="form-group">
                                                <input type="text" className="form-control" readOnly />
                                            </div>
                                        </div>
                                        <div className="col-sm-6 col-md-4 col-lg-2">
                                            <div className="form-group mb-2">
                                                <label>SAP Doc</label>
                                                <input type="text" className="form-control" readOnly />
                                            </div>
                                            <div className="form-group">
                                                <input type="text" className="form-control" readOnly />
                                            </div>
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
                                    <div className="table-responsive" style={{ height: 300 }}>
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
                                                        <td align='center'>{(adj.disputeMny * 0.07).toFixed(2)}</td>
                                                        <td align='center'>{(adj.disputeMny * 1.07).toFixed(2)}</td>
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
