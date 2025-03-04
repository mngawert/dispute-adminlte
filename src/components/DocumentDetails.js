import React, { useState } from 'react';
import { CPS_MAP_HASH } from '../contexts/Constants';
import { formatNumber } from '../utils/utils'; // Import the utility function

const DocumentDetails = ({ selectedDocument, adjustmentRequests }) => {
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });

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

    const totalAmount = sortedAdjustmentRequests.reduce((sum, adj) => sum + adj.disputeMny, 0).toFixed(2);
    const totalVAT = sortedAdjustmentRequests.reduce((sum, adj) => sum + (adj.disputeMny * (CPS_MAP_HASH[adj.cpsId] / 100)), 0).toFixed(2);
    const total = sortedAdjustmentRequests.reduce((sum, adj) => sum + (adj.disputeMny * (1 + CPS_MAP_HASH[adj.cpsId] / 100)), 0).toFixed(2);

    const getNoteContent = () => {
        const notes = [
            selectedDocument?.createNote,
            selectedDocument?.reviewNote,
            selectedDocument?.approveNote,
            selectedDocument?.financeNote
        ];
        return notes.filter(note => note).join('\n');
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

            <label className="mb-3">Approval:</label>
            
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