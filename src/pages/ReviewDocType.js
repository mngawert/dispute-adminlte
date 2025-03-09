import { CPS_MAP_HASH } from '../contexts/Constants';
import React, { useState, useEffect } from 'react';
import { formatNumber } from '../utils/utils'; // Import the utility function

const ReviewDocType = ({ documentTypeDesc, documents, adjustmentRequests, selectedDocument, reviewType, handleSelectDocument, handleUpdateDocumentStatus }) => {
    const [myNote, setMyNote] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
    const [selectedAdjustmentRequest, setSelectedAdjustmentRequest] = useState(null);
    const [noteContent, setNoteContent] = useState('');

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
            selectedAdjustmentRequest?.note ? `[Creator]: ${selectedAdjustmentRequest.note}` : null,
            selectedDocument?.reviewNote ? `[Reviewer]: ${selectedDocument.reviewNote}` : null,
            selectedDocument?.approveNote ? `[Approver]: ${selectedDocument.approveNote}` : null,
            selectedDocument?.financeNote ? `[Financial Reviewer]: ${selectedDocument.financeNote}` : null,
        ];

        return notes.filter(note => note).join('\n');
    };

    useEffect(() => {
        setNoteContent(getNoteContent());
    }, [selectedAdjustmentRequest, selectedDocument]);

    useEffect(() => {
        setSelectedAdjustmentRequest(null);
    }, [selectedDocument]);

    const resetMyNote = () => {
        setMyNote('');
    };

    const sortedAdjustmentRequests = React.useMemo(() => {
        let sortableAdjustmentRequests = [...adjustmentRequests];
        if (sortConfig.key !== null) {
            sortableAdjustmentRequests.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? -1 : 1;
                }
                if (a[sortConfig.key] > b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? 1 : -1;
                }
                return 0;
            });
        }
        return sortableAdjustmentRequests;
    }, [adjustmentRequests, sortConfig]);

    const requestSort = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const getSortIndicator = (key) => {
        if (sortConfig.key === key) {
            return sortConfig.direction === 'ascending' ? '▲' : '▼';
        }
        return null;
    };

    const handleSelectAdjustmentRequest = (adj) => {
        setSelectedAdjustmentRequest(adj);
    };

    const totalAmount = sortedAdjustmentRequests.reduce((sum, adj) => sum + adj.disputeMny, 0).toFixed(2);
    const totalVAT = sortedAdjustmentRequests.reduce((sum, adj) => sum + (adj.disputeMny * (CPS_MAP_HASH[adj.cpsId] / 100)), 0).toFixed(2);
    const total = sortedAdjustmentRequests.reduce((sum, adj) => sum + (adj.disputeMny * (1 + CPS_MAP_HASH[adj.cpsId] / 100)), 0).toFixed(2);

    const handleReject = () => {
        if (!myNote.trim()) {
            alert('My Note is required to reject the document.');
            return;
        }
        handleUpdateDocumentStatus(selectedDocument, `${reviewType}-Reject`, myNote, resetMyNote);
    };

    return (
        <div className="card">
            <div className="card-body">
                <div className="tab-content" id="custom-tabs-one-tabContent">
                    <div className="tab-pane fade show active" id="custom-tabs-one-adjustplus" role="tabpanel" aria-labelledby="custom-tabs-one-adjustplus-tab">
                        <p className="mb-4">Select adjustments you wish to Accept action or Reject:</p>
                        <div className="row">
                            <div className="col-sm-4 col-lg-3">
                                <label>Document Sequence</label>
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
                                            <label>Document Sequence</label>
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
                                                <th className="sortable" onClick={() => requestSort('accountNum')}>Account Number {getSortIndicator('accountNum')}</th>
                                                <th className="sortable" onClick={() => requestSort('invoiceNum')}>Invoice Number {getSortIndicator('invoiceNum')}</th>
                                                <th className="sortable" onClick={() => requestSort('serviceNum')}>Service Number {getSortIndicator('serviceNum')}</th>
                                                <th className="sortable" onClick={() => requestSort('adjustmentTypeName')}>Adjustment Type {getSortIndicator('adjustmentTypeName')}</th>
                                                <th className="sortable" onClick={() => requestSort('disputeMny')}>Amount {getSortIndicator('disputeMny')}</th>
                                                <th className="sortable" onClick={() => requestSort('vat')}>VAT {getSortIndicator('vat')}</th>
                                                <th className="sortable" onClick={() => requestSort('total')}>Total {getSortIndicator('total')}</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {sortedAdjustmentRequests.map((adj, index) => (
                                                <tr key={index} onClick={() => handleSelectAdjustmentRequest(adj)} className={selectedAdjustmentRequest === adj ? 'selected' : ''}>
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
                                    <textarea className="form-control" rows={5} readOnly value={noteContent} />
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
                                        <button type="button" className="btn btn-default" onClick={handleReject} >Reject Selected</button>
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
