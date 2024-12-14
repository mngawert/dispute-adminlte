import React from "react";

const PendingDocument = ({ pendingDocument, adjustmentRequests, fetchPendingDocumentAndRequests, deleteAdjustmentRequest, updateDocumentStatus }) => {
    return (
        <div className="card">
            <div className="card-header border-0">
                <h3 className="card-title">Document Sequence</h3>
            </div>
            <div className="card-body">
                <div className="row">
                    <div className="form-group col-sm-4">
                        <strong>Adjustment type:</strong> {pendingDocument.documentTypeDesc}
                    </div>
                    <div className="form-group col-sm-4">
                        <strong>Current sequence:</strong> {pendingDocument.documentNum}
                    </div>
                    <div className="form-group col-sm-4" align="right">
                        <button type="button" className="btn btn-default" onClick={async () => {
                            await updateDocumentStatus(pendingDocument.documentNum, 'Create', 'Create-Accept');
                            await fetchPendingDocumentAndRequests(pendingDocument.documentType);
                        }} 
                        >Submit document</button>
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
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {adjustmentRequests.map((request) => (
                                <tr key={request.documentSeq}>
                                    <td>{request.adjustmentTypeName}</td>
                                    <td>{request.accountNum}</td>
                                    <td>{request.invoiceNum}</td>
                                    <td>{request.serviceNum}</td>
                                    <td align='center'>{request.disputeMny.toFixed(2)}</td>
                                    <td align='center'>{(request.disputeMny * 0.07).toFixed(2)}</td>
                                    <td align='center'>{(request.disputeMny * 1.07).toFixed(2)}</td>
                                    <td>
                                        <button className="btn btn-sm" onClick={() => deleteAdjustmentRequest(request.documentSeq)}>
                                            <i className="fas fa-trash-alt"></i>
                                        </button>
                                    </td>
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