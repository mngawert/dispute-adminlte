import React, { useState, useMemo } from 'react';
import { CPS_MAP_HASH } from '../contexts/Constants';
import { formatNumber, formatDate } from '../utils/utils'; // Import the utility functions

const DocumentDetails = ({ selectedDocument, adjustmentRequests }) => {
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });

    const sortedAdjustmentRequests = useMemo(() => {
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

    let totalAmount = sortedAdjustmentRequests.reduce((sum, adj) => sum + Math.abs(adj.disputeMny), 0);
    let totalVAT = sortedAdjustmentRequests.reduce((sum, adj) => sum + Math.abs(adj.disputeMny * (CPS_MAP_HASH[adj.cpsId] / 100)), 0);
    let total = sortedAdjustmentRequests.reduce((sum, adj) => sum + Math.abs(adj.disputeMny * (1 + CPS_MAP_HASH[adj.cpsId] / 100)), 0);

    // If documentTypeDesc is 'B1+/-', divide totals by 2
    if (selectedDocument?.documentTypeDesc === 'B1+/-') {
        totalAmount = totalAmount / 2;
        totalVAT = totalVAT / 2;
        total = total / 2;
    }

    totalAmount = totalAmount.toFixed(2);
    totalVAT = totalVAT.toFixed(2);
    total = total.toFixed(2);

    const getNoteContent = () => {
        const notes = [
            ...adjustmentRequests.map(adj => adj.note ? `[Creator]: ${adj.note}` : null),
            selectedDocument?.reviewNote ? `[Reviewer]: ${selectedDocument.reviewNote}` : null,
            selectedDocument?.approveNote ? `[Approver]: ${selectedDocument.approveNote}` : null,
            selectedDocument?.financeNote ? `[Financial Reviewer]: ${selectedDocument.financeNote}` : null,
            selectedDocument?.retriedNote ? `[Retrier]: ${selectedDocument.retriedNote}` : null,
            selectedDocument?.cancelNote ? `[Canceller]: ${selectedDocument.cancelNote}` : null
        ];
        // Remove duplicate notes and join with newline
        return Array.from(new Set(notes.filter(note => note))).join('\n');
    };

    return (
        <>
            <label className="mb-3">Adjustments:</label>

            <div className="table-responsive" style={{ height: 300 }}>
                <table className="table table-head-fixed text-nowrap table-bordered table-hover">
                    <thead>
                        <tr>
                            <th className="sortable" onClick={() => requestSort('accountNum')}>Account Number {getSortIndicator('accountNum')}</th>
                            <th className="sortable" onClick={() => requestSort('invoiceNum')}>Invoice Number {getSortIndicator('invoiceNum')}</th>
                            <th className="sortable" onClick={() => requestSort('serviceNum')}>Service Number {getSortIndicator('serviceNum')}</th>
                            <th className="sortable" onClick={() => requestSort('adjustmentTypeName')}>Adjustment Type {getSortIndicator('adjustmentTypeName')}</th>
                            <th className="sortable" onClick={() => requestSort('requestStatus')}>Status {getSortIndicator('requestStatus')}</th>
                            <th className="sortable" onClick={() => requestSort('errorMessages')}>Error Messages</th>
                            <th className="sortable" onClick={() => requestSort('disputeMny')}>Amount {getSortIndicator('disputeMny')}</th>
                            <th className="sortable" onClick={() => requestSort('vat')}>VAT {getSortIndicator('vat')}</th>
                            <th className="sortable" onClick={() => requestSort('total')}>Total {getSortIndicator('total')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedAdjustmentRequests.map((adj, index) => (
                            <tr key={index}>
                                <td>{adj.accountNum}</td>
                                <td>{adj.invoiceNum}</td>
                                <td>{adj.serviceNum}</td>
                                <td>{adj.adjustmentTypeName}</td>
                                <td>{adj.requestStatus}</td>
                                <td>{adj.errorMessages || '-'}</td>
                                <td align='center'>{formatNumber(Math.abs(adj.disputeMny).toFixed(2))}</td>
                                <td align='center'>{formatNumber(Math.abs(adj.disputeMny * (CPS_MAP_HASH[adj.cpsId] / 100)).toFixed(2))}</td>
                                <td align='center'>{formatNumber(Math.abs(adj.disputeMny * (1 + CPS_MAP_HASH[adj.cpsId] / 100)).toFixed(2))}</td>
                            </tr>
                        ))}
                        <tr>
                            <td colSpan="6" align='right'><strong>Total</strong></td>
                            <td align='center'><strong>{formatNumber(Math.abs(totalAmount))}</strong></td>
                            <td align='center'><strong>{formatNumber(Math.abs(totalVAT))}</strong></td>
                            <td align='center'><strong>{formatNumber(Math.abs(total))}</strong></td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <label className="mb-3">Approval:</label>
            
            <div className="row">
                <div className="col-sm-6 col-md-4 col-lg-2">
                    <div className="form-group mb-2">
                        <label>Reviewed by</label>
                        <input type="text" className="form-control" readOnly value={selectedDocument?.reviewedByName || ''} />
                    </div>
                    <div className="form-group">
                        <input type="text" className="form-control" readOnly value={selectedDocument?.reviewedDtm ? formatDate(selectedDocument.reviewedDtm) : ''} />
                    </div>
                </div>
                <div className="col-sm-6 col-md-4 col-lg-2">
                    <div className="form-group mb-2">
                        <label>Approved by</label>
                        <input type="text" className="form-control" readOnly value={selectedDocument?.approvedByName || ''} />
                    </div>
                    <div className="form-group">
                        <input type="text" className="form-control" readOnly value={selectedDocument?.approvedDtm ? formatDate(selectedDocument.approvedDtm) : ''} />
                    </div>
                </div>
                <div className="col-sm-6 col-md-4 col-lg-2">
                    <div className="form-group mb-2">
                        <label>Finance by</label>
                        <input type="text" className="form-control" readOnly value={selectedDocument?.financeReviewedByName || ''} />
                    </div>
                    <div className="form-group">
                        <input type="text" className="form-control" readOnly value={selectedDocument?.financeReviewedDtm ? formatDate(selectedDocument.financeReviewedDtm) : ''} />
                    </div>
                </div>
                <div className="col-sm-6 col-md-4 col-lg-2">
                    <div className="form-group mb-2">
                        <label>Rejected by</label>
                        <input type="text" className="form-control" readOnly value={selectedDocument?.rejectedByName || ''} />
                    </div>
                    <div className="form-group">
                        <input type="text" className="form-control" readOnly value={selectedDocument?.rejectedDtm ? formatDate(selectedDocument.rejectedDtm) : ''} />
                    </div>
                </div>
                <div className="col-sm-6 col-md-4 col-lg-2">
                    <div className="form-group mb-2">
                        <label>Retried by</label>
                        <input type="text" className="form-control" readOnly value={selectedDocument?.retriedByName || ''} />
                    </div>
                    <div className="form-group">
                        <input type="text" className="form-control" readOnly value={selectedDocument?.retriedDtm ? formatDate(selectedDocument.retriedDtm) : ''} />
                    </div>
                </div>
                <div className="col-sm-6 col-md-4 col-lg-2">
                    <div className="form-group mb-2">
                        <label>Cancelled by</label>
                        <input type="text" className="form-control" readOnly value={selectedDocument?.canceledByName || ''} />
                    </div>
                    <div className="form-group">
                        <input type="text" className="form-control" readOnly value={selectedDocument?.canceledDtm ? formatDate(selectedDocument.canceledDtm) : ''} />
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col-sm-6 col-md-4 col-lg-2">
                    <div className="form-group mb-2">
                        <label>SAP Doc</label>
                        <input type="text" className="form-control" readOnly value={selectedDocument?.sapDocNo || ''} />
                    </div>
                    <div className="form-group">
                        <input type="text" className="form-control" readOnly value={selectedDocument?.sapDocDate ? formatDate(selectedDocument.sapDocDate) : ''} />
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
                <div className="col-sm-8">
                    <div className="form-group">
                        <label>Notes</label>
                        <textarea className="form-control" rows={5} readOnly value={getNoteContent()} />
                    </div>
                </div>
            </div>                        
        </>
    );
};

export default DocumentDetails;