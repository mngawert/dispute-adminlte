import { CPS_MAP_HASH } from '../contexts/Constants';
import React, { useState } from 'react';

const ReviewDocType = ({ documentTypeDesc, documents, adjustmentRequests, selectedDocument, reviewType, handleSelectDocument, handleUpdateDocumentStatus }) => {
    const [myNote, setMyNote] = useState('');

    const filterDocumentsByType = (type) => {
        return documents.filter(doc => doc.documentTypeDesc === type);
    };

    const formatDateTime = (dateTime) => {
        return new Date(dateTime).toLocaleString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    };

    const getNoteContent = () => {
        const notes = [
            selectedDocument?.createNote,
            selectedDocument?.reviewNote,
            selectedDocument?.approveNote,
            selectedDocument?.financeNote
        ];
        return notes.filter(note => note).join('\n');
    };

    const resetMyNote = () => {
        setMyNote('');
    };

    const formatNumber = (value) => {
        return Number(value).toLocaleString();
    };

    const totalAmount = adjustmentRequests.reduce((sum, adj) => sum + adj.disputeMny, 0).toFixed(2);
    const totalVAT = adjustmentRequests.reduce((sum, adj) => sum + (adj.disputeMny * (CPS_MAP_HASH[adj.cpsId] / 100)), 0).toFixed(2);
    const total = adjustmentRequests.reduce((sum, adj) => sum + (adj.disputeMny * (1 + CPS_MAP_HASH[adj.cpsId] / 100)), 0).toFixed(2);

    return (
        <div className="card">
            <div className="card-body">
                <div className="tab-content" id="custom-tabs-one-tabContent">
                    <div className="tab-pane fade show active" id="custom-tabs-one-adjustplus" role="tabpanel" aria-labelledby="custom-tabs-one-adjustplus-tab">
                        <p className="mb-4">Select adjustments you wish to Accept action or Reject:</p>
                        <div className="row">
                            <div className="col-sm-4 col-lg-3">
                                <label>Document Number</label>
                                <div className="table-responsive" style={{ height: 400, border: '1px solid #dee2e6' }}>
                                    <table className="table table-as-list text-nowrap table-hover">
                                        <tbody>
                                            {filterDocumentsByType(documentTypeDesc).map((doc, index) => (
                                                <tr key={index} onClick={() => { handleSelectDocument(doc) }} className={selectedDocument?.documentNum === doc.documentNum ? 'selected' : ''}>
                                                    <td>{doc.documentNum}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div className="col-sm-8 col-lg-9">
                                <div className="row">
                                    <div className="col-sm-6">
                                        <div className="form-group">
                                            <label>Document Number</label>
                                            <input type="text" className="form-control" readOnly value={selectedDocument?.documentNum ?? ''} />
                                        </div>
                                        <div className="form-group">
                                            <label>Adjustment Location Code</label>
                                            <input type="text" className="form-control" readOnly value={selectedDocument?.homeLocationCode ?? ''} />
                                        </div>
                                    </div>
                                    <div className="col-sm-6">
                                        <div className="form-group">
                                            <label>Created By</label>
                                            <input type="text" className="form-control" readOnly value={selectedDocument?.createdByName ?? ''} />
                                        </div>
                                        <div className="form-group">
                                            <label>Created On</label>
                                            <input type="text" className="form-control" readOnly value={selectedDocument?.createdDtm ? formatDateTime(selectedDocument.createdDtm) : ''} />
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
                                                    <td align='center'>{formatNumber(adj.disputeMny.toFixed(2))}</td>
                                                    <td align='center'>{formatNumber((adj.disputeMny * (CPS_MAP_HASH[adj.cpsId] / 100)).toFixed(2))}</td>
                                                    <td align='center'>{formatNumber((adj.disputeMny * (1 + CPS_MAP_HASH[adj.cpsId] / 100)).toFixed(2))}</td>
                                                </tr>
                                            ))}
                                            <tr>
                                                <td colSpan="4" align='right'><strong>Total</strong></td>
                                                <td align='center'><strong>{formatNumber(totalAmount)}</strong></td>
                                                <td align='center'><strong>{formatNumber(totalVAT)}</strong></td>
                                                <td align='center'><strong>{formatNumber(total)}</strong></td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-sm-6">
                                <div className="form-group">
                                    <label>Note</label>
                                    <textarea className="form-control" rows={5} readOnly value={getNoteContent()} />
                                </div>
                            </div>
                            <div className="col-sm-6">
                                <div className="form-group">
                                    <label>My Note</label>
                                    <textarea className="form-control" rows={5} value={myNote} onChange={(e) => setMyNote(e.target.value)} />
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-12">
                                <div className="form-inline mt-4">
                                    <p className="ml-auto mr-auto flex-column">
                                        <button type="button" className="btn btn-primary mr-1" onClick={() => handleUpdateDocumentStatus(selectedDocument, `${reviewType}-Accept`, myNote, resetMyNote)} >Accept Selected</button>
                                        <button type="button" className="btn btn-default" onClick={() => handleUpdateDocumentStatus(selectedDocument, `${reviewType}-Reject`, myNote, resetMyNote)} >Reject Selected</button>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReviewDocType;
