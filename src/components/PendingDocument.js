import React, { useState } from "react";
import { CPS_MAP_HASH } from '../contexts/Constants';
import { formatNumber } from '../utils/utils'; // Import the utility function

const PendingDocument = ({ pendingDocument, adjustmentRequests, fetchPendingDocumentAndRequests, deleteAdjustmentRequest, updateDocumentStatus }) => {
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });

    const sortedAdjustmentRequests = React.useMemo(() => {
        let sortableItems = [...adjustmentRequests];
        if (sortConfig.key !== null) {
            sortableItems.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? -1 : 1;
                }
                if (a[sortConfig.key] > b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? 1 : -1;
                }
                return 0;
            });
        }
        return sortableItems;
    }, [adjustmentRequests, sortConfig]);

    const requestSort = key => {
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

    const totalAmount = adjustmentRequests.reduce((sum, adj) => sum + adj.disputeMny, 0).toFixed(2);
    const totalVAT = adjustmentRequests.reduce((sum, adj) => sum + (adj.disputeMny * (CPS_MAP_HASH[adj.cpsId] / 100)), 0).toFixed(2);
    const total = adjustmentRequests.reduce((sum, adj) => sum + (adj.disputeMny * (1 + CPS_MAP_HASH[adj.cpsId] / 100)), 0).toFixed(2);

    return (
        <div className="card">
            <div className="card-header border-0">
                <h3 className="card-title">Document Sequence</h3>
            </div>
            <div className="card-body">
                <div className="row">
                    <div className="form-group col-sm-4">
                        <strong>Adjustment type:</strong> {pendingDocument?.documentTypeDesc}
                    </div>
                    <div className="form-group col-sm-4">
                        <strong>Current sequence:</strong> {pendingDocument?.documentNum}
                    </div>
                    <div className="form-group col-sm-4" align="right">
                        <button 
                            type="button" 
                            className="btn btn-default" 
                            onClick={async () => {
                                await updateDocumentStatus(pendingDocument.documentNum, 'Create', 'Create-Accept');
                                await fetchPendingDocumentAndRequests(pendingDocument.documentType);
                            }} 
                            disabled={adjustmentRequests.length === 0}
                        >
                            Submit document
                        </button>
                    </div>
                </div>
                <div className="table-responsive" style={{ height: 300 }}>
                    <table className="table table-head-fixed text-nowrap table-bordered table-hover">
                        <thead>
                            <tr>
                                <th className="sortable" onClick={() => requestSort('adjustmentTypeName')}>Adjustment Type {getSortIndicator('adjustmentTypeName')}</th>
                                <th className="sortable" onClick={() => requestSort('accountNum')}>Account Number {getSortIndicator('accountNum')}</th>
                                <th className="sortable" onClick={() => requestSort('invoiceNum')}>Invoice Number {getSortIndicator('invoiceNum')}</th>
                                <th className="sortable" onClick={() => requestSort('serviceNum')}>Service Number {getSortIndicator('serviceNum')}</th>
                                <th className="sortable" onClick={() => requestSort('disputeMny')}>Amount {getSortIndicator('disputeMny')}</th>
                                <th className="sortable" onClick={() => requestSort('vat')}>VAT {getSortIndicator('vat')}</th>
                                <th className="sortable" onClick={() => requestSort('total')}>Total {getSortIndicator('total')}</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedAdjustmentRequests.map((adj) => (
                                <tr key={adj.documentSeq}>
                                    <td>{adj.adjustmentTypeName}</td>
                                    <td>{adj.accountNum}</td>
                                    <td>{adj.invoiceNum}</td>
                                    <td>{adj.serviceNum}</td>
                                    <td align='center'>{formatNumber(adj.disputeMny.toFixed(2))}</td>
                                    <td align='center'>{formatNumber((adj.disputeMny * (CPS_MAP_HASH[adj.cpsId] / 100)).toFixed(2))}</td>
                                    <td align='center'>{formatNumber((adj.disputeMny * (1 + CPS_MAP_HASH[adj.cpsId] / 100)).toFixed(2))}</td>
                                    <td>
                                        <button className="btn btn-sm" onClick={() => deleteAdjustmentRequest(adj.documentSeq)}>
                                            <i className="fas fa-trash-alt"></i>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            <tr>
                                <td colSpan="4" align='right'><strong>Total</strong></td>
                                <td align='center'><strong>{formatNumber(totalAmount)}</strong></td>
                                <td align='center'><strong>{formatNumber(totalVAT)}</strong></td>
                                <td align='center'><strong>{formatNumber(total)}</strong></td>
                                <td></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default PendingDocument;