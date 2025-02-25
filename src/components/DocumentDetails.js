import React from 'react';

const DocumentDetails = ({ selectedDocument, adjustmentRequests }) => {
    const totalAmount = adjustmentRequests.reduce((sum, adj) => sum + adj.disputeMny, 0).toFixed(2);
    const totalVAT = adjustmentRequests.reduce((sum, adj) => sum + (adj.disputeMny * 0.07), 0).toFixed(2);
    const total = adjustmentRequests.reduce((sum, adj) => sum + (adj.disputeMny * 1.07), 0).toFixed(2);

    return (
        <>

            <label className="mb-3">Adjustments:</label>

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
                        <tr>
                            <td colSpan="4" align='right'><strong>Total</strong></td>
                            <td align='center'><strong>{totalAmount}</strong></td>
                            <td align='center'><strong>{totalVAT}</strong></td>
                            <td align='center'><strong>{total}</strong></td>
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
            </div>                        
        </>
    );
};

export default DocumentDetails;