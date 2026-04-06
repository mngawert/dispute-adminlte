import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import ContentHeader from '../components/ContentHeader';
import DocumentDetails from '../components/DocumentDetails';
import { exportDocumentToPDF, exportDocumentToDOCX } from '../utils/exportUtils';
import { formatNumber, formatDate } from '../utils/utils';

const DocumentDetail = () => {
    const { documentNum } = useParams();
    const navigate = useNavigate();
    const [document, setDocument] = useState(null);
    const [adjustmentRequests, setAdjustmentRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDocumentDetails();
    }, [documentNum]);

    const fetchDocumentDetails = async () => {
        try {
            setLoading(true);

            // Fetch document details
            const docResponse = await api.get(`/api/Document/GetAllDocuments`, {
                params: {
                    documentNum: documentNum,
                    bypassLocation: 'Yes'
                }
            });

            if (docResponse.data && docResponse.data.length > 0) {
                setDocument(docResponse.data[0]);

                // Fetch adjustment requests
                const adjResponse = await api.get(`/api/Adjustment/GetAdjustmentRequests`, {
                    params: {
                        documentNum: documentNum
                    }
                });
                setAdjustmentRequests(adjResponse.data);
            } else {
                alert('Document not found');
                navigate('/MyAdj');
            }

            setLoading(false);
        } catch (error) {
            console.error('Error fetching document details', error);
            alert('Error fetching document details: ' + (error.response?.data || error.message));
            setLoading(false);
        }
    };

    const handleExportPDF = async () => {
        if (!document) {
            alert('No document to export.');
            return;
        }

        try {
            await exportDocumentToPDF(document, adjustmentRequests);
        } catch (error) {
            console.error('Error exporting to PDF', error);
            alert('Error exporting to PDF: ' + error.message);
        }
    };

    const handleExportDOCX = async () => {
        if (!document) {
            alert('No document to export.');
            return;
        }

        try {
            await exportDocumentToDOCX(document, adjustmentRequests);
        } catch (error) {
            console.error('Error exporting to DOCX', error);
            alert('Error exporting to DOCX: ' + error.message);
        }
    };

    if (loading) {
        return (
            <div className="content-wrapper-x">
                <ContentHeader title="Document Details" />
                <div className="content">
                    <div className="container-fluid">
                        <div className="row">
                            <div className="col-12">
                                <div className="card">
                                    <div className="card-body">
                                        <p>Loading document details...</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!document) {
        return (
            <div className="content-wrapper-x">
                <ContentHeader title="Document Details" />
                <div className="content">
                    <div className="container-fluid">
                        <div className="row">
                            <div className="col-12">
                                <div className="card">
                                    <div className="card-body">
                                        <p>Document not found.</p>
                                        <button className="btn btn-primary" onClick={() => navigate('/MyAdj')}>
                                            Back to My Adjustments
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="content-wrapper-x">
            <ContentHeader title={`Document Details - ${document.documentNum}`} />
            <div className="content">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-12">
                            <div className="card">
                                <div className="card-header">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <h3 className="card-title">Document Information</h3>
                                        <div>
                                            <button className="btn btn-danger mr-2" onClick={handleExportPDF}>
                                                <i className="fas fa-file-pdf mr-1"></i> Export PDF
                                            </button>
                                            <button className="btn btn-primary mr-2" onClick={handleExportDOCX}>
                                                <i className="fas fa-file-word mr-1"></i> Export DOCX
                                            </button>
                                            <button className="btn btn-secondary" onClick={() => navigate(-1)}>
                                                <i className="fas fa-arrow-left mr-1"></i> Back
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div className="card-body">
                                    {/* Document Header Information */}
                                    <div className="row mb-4">
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label><strong>Document Sequence:</strong></label>
                                                <p>{document.documentNum}</p>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label><strong>Document Type:</strong></label>
                                                <p>{document.documentTypeDesc}</p>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label><strong>Total Amount:</strong></label>
                                                <p>
                                                    {document.documentTypeDesc === 'B1+/-'
                                                        ? formatNumber(Math.abs(document.totalMny) / 2)
                                                        : formatNumber(Math.abs(document.totalMny))}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label><strong>Location:</strong></label>
                                                <p>{document.homeLocationCode}</p>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label><strong>Created by:</strong></label>
                                                <p>{document.createdByName}</p>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label><strong>Created date:</strong></label>
                                                <p>{formatDate(document.createdDtm)}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Notes Section */}
                                    {(document.reviewNote || document.approveNote || document.financeNote || document.cancelNote) && (
                                        <div className="row mb-4">
                                            <div className="col-12">
                                                <h5>Notes:</h5>
                                                {document.reviewNote && (
                                                    <div className="mb-2">
                                                        <strong>[Reviewer]:</strong> {document.reviewNote}
                                                    </div>
                                                )}
                                                {document.approveNote && (
                                                    <div className="mb-2">
                                                        <strong>[Approver]:</strong> {document.approveNote}
                                                    </div>
                                                )}
                                                {document.financeNote && (
                                                    <div className="mb-2">
                                                        <strong>[Financial Reviewer]:</strong> {document.financeNote}
                                                    </div>
                                                )}
                                                {document.cancelNote && (
                                                    <div className="mb-2">
                                                        <strong>[Canceller]:</strong> {document.cancelNote}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {/* Adjustment Requests Table */}
                                    <hr />
                                    <DocumentDetails 
                                        selectedDocument={document} 
                                        adjustmentRequests={adjustmentRequests} 
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DocumentDetail;
