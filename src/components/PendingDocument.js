import React from "react";

const PendingDocument = ({ pendingDocumentNum, adjustmentRequests, fetchPendingDocumentNumAndRequests }) => {
    return (
        <div className="card">
            <div className="card-header border-0">
                <h3 className="card-title">Document Sequence</h3>
            </div>
            <div className="card-body">
                <div className="row">
                    <div className="form-group col-sm-4">
                        <strong>Adjustment type:</strong> Adjustment -
                    </div>
                    <div className="form-group col-sm-4">
                        <strong>Current sequence:</strong> {pendingDocumentNum}
                    </div>
                    <div className="form-group col-sm-4">
                        <button type="submit" className="btn btn-default">Remove Adjustment</button>
                        <button type="submit" className="btn btn-default" onClick={() => fetchPendingDocumentNumAndRequests()} >Submit document</button>
                    </div>
                </div>
                <div className="table-responsive" style={{ height: 300 }}>
                    <table className="table table-head-fixed text-nowrap table-bordered table-hover">
                        <thead>
                            <tr>
                                <th>Adjustment Type</th>
                                <th>Account Number</th>
                                <th>Invoice Number</th>
                                <th>Service Number</th>
                                <th>Amount</th>
                                <th>VAT</th>
                                <th>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {adjustmentRequests.map((request, index) => (
                                <tr key={index}>
                                    <td>{request.adjustmentTypeName}</td>
                                    <td>{request.accountNum}</td>
                                    <td>{request.invoiceNum}</td>
                                    <td>{request.serviceNum}</td>
                                    <td align='center'>{request.disputeMny.toFixed(2)}</td>
                                    <td align='center'>{(request.disputeMny * 0.07).toFixed(2)}</td>
                                    <td align='center'>{(request.disputeMny * 1.07).toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default PendingDocument;