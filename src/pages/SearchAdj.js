import React, { useState, useEffect, useCallback } from 'react';
import api from '../api';
import { DOCUMENT_STATUS_LIST, SEARCH_BY_LIST } from '../contexts/Constants';
import ContentHeader from '../components/ContentHeader';
import DocumentTable from '../components/DocumentTable';
import DocumentDetails from '../components/DocumentDetails';
import SearchBox from '../components/SearchBox';
import { exportAdjustmentRequestsToExcel } from '../utils/exportUtils';

const SearchAdj = ({ myAdjust, title, fetchDataAtStart }) => {
    // Initialize date fields with current date when myAdjust is 'Yes'
    const today = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD
    
    const [documentNum, setDocumentNum] = useState('');
    const [documents, setDocuments] = useState([]);
    const [selectedDocument, setSelectedDocument] = useState(null);
    const [adjustmentRequests, setAdjustmentRequests] = useState([]);
    const [searchBy, setSearchBy] = useState(SEARCH_BY_LIST);
    const [selectedSearchBy, setSelectedSearchBy] = useState(null);
    const [filterBy, setFilterBy] = useState('createdBy');
    const [fromDate, setFromDate] = useState(myAdjust === 'Yes' ? today : '');
    const [toDate, setToDate] = useState(myAdjust === 'Yes' ? today : '');
    const [loading, setLoading] = useState(false);

    const getAllDocuments = useCallback(async () => {
        try {
            setLoading(true);
            const userId = JSON.parse(localStorage.getItem('userLogin'))?.userId;

            const params = {
                documentNum: documentNum,
                searchBy: selectedSearchBy?.value,
                fromDate: fromDate,
                toDate: toDate,
                bypassLocation: 'Yes',
            };
            if (myAdjust === 'Yes' && userId) {
                params[filterBy] = userId;
            }
            const response = await api.get(`/api/Document/GetAllDocuments`, { params });
            setDocuments(response.data);
            /* Clear selected document and adjustment requests */
            setSelectedDocument(null);
            setAdjustmentRequests([]);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching data', error);
            setLoading(false);
        }
    }, [documentNum, selectedSearchBy, myAdjust, filterBy, fromDate, toDate]);

    useEffect(() => {
        if (fetchDataAtStart === 'Yes') {
            getAllDocuments();
        }
    }, [fetchDataAtStart, getAllDocuments]);

    const handleSearchByChange = (e) => {
        const selectedOption = searchBy.find(search => search.value === e.target.value);
        setSelectedSearchBy(selectedOption);
        
        // Clear the documentNum when "All" is selected
        if (e.target.value === '') {
            setDocumentNum('');
        }
    }

    const handleInputChange = (e) => {
        setDocumentNum(e.target.value);
    };

    const handleFilterByChange = (e) => {
        setFilterBy(e.target.value);
    };

    const handleFromDateChange = (e) => {
        setFromDate(e.target.value);
    };

    const handleToDateChange = (e) => {
        setToDate(e.target.value);
    };

    const handleSearch = async () => {
        getAllDocuments();
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

    const exportToExcel = async () => {
        if (!selectedDocument) {
            alert('Please select a document to export.');
            return;
        }

        await exportAdjustmentRequestsToExcel([selectedDocument.documentNum], 'ExportedData.xlsx');
    };

    const exportAllToExcel = async () => {
        if (documents.length === 0) {
            alert('No documents to export.');
            return;
        }

        const documentNums = documents.map(doc => doc.documentNum);
        await exportAdjustmentRequestsToExcel(documentNums, 'AllExportedData.xlsx');
    };

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
                            <SearchBox
                                searchBy={searchBy}
                                selectedSearchBy={selectedSearchBy}
                                handleSearchByChange={handleSearchByChange}
                                documentNum={documentNum}
                                handleInputChange={handleInputChange}
                                handleSearch={handleSearch}
                                filterBy={filterBy}
                                handleFilterByChange={handleFilterByChange}
                                fromDate={fromDate}
                                toDate={toDate}
                                handleFromDateChange={handleFromDateChange}
                                handleToDateChange={handleToDateChange}
                                showSearchBy={myAdjust !== 'Yes'}
                            />
                            <div className="card">
                                <div className="card-body">
                                    <div className="d-flex justify-content-end mb-3">
                                        <div>
                                            <button className="btn btn-default mr-2" onClick={exportToExcel} disabled={!selectedDocument}>
                                                Export Current
                                            </button>
                                            <button className="btn btn-default" onClick={exportAllToExcel} disabled={documents.length === 0}>
                                                Export All Documents
                                            </button>
                                        </div>
                                    </div>
                                    
                                    {/* Document table */}
                                    <DocumentTable documents={documents} selectedDocument={selectedDocument} handleSelectDocument={handleSelectDocument} />
                                    
                                    {/* Total Records display moved below the document table */}
                                    <div className="mt-2 mb-3">
                                        {loading ? (
                                            <span>Loading documents...</span>
                                        ) : (
                                            <span>Total Records: {documents.length}</span>
                                        )}
                                    </div>
                                    
                                    {/* Document details */}
                                    <DocumentDetails selectedDocument={selectedDocument} adjustmentRequests={adjustmentRequests} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SearchAdj;
