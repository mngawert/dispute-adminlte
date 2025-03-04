import React, { useState, useEffect, useCallback } from 'react';
import api from '../api';
import { DOCUMENT_STATUS_LIST, SEARCH_BY_LIST } from '../contexts/Constants';
import ContentHeader from '../components/ContentHeader'; // Adjust the import path as necessary
import DocumentTable from '../components/DocumentTable';
import DocumentDetails from '../components/DocumentDetails';
import SearchBox from '../components/SearchBox';
import * as XLSX from 'xlsx';

const SearchAdj = ({ myAdjust, title, fetchDataAtStart }) => {
    const [documentNum, setDocumentNum] = useState('');
    const [documents, setDocuments] = useState([]);
    const [selectedDocument, setSelectedDocument] = useState(null);
    const [adjustmentRequests, setAdjustmentRequests] = useState([]);
    const [searchBy, setSearchBy] = useState(SEARCH_BY_LIST);
    const [selectedSearchBy, setSelectedSearchBy] = useState(null);
    const [filterBy, setFilterBy] = useState('createdBy');
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');

    const getAllDocuments = useCallback(async () => {
        try {
            const userId = JSON.parse(localStorage.getItem('userLogin'))?.userId;

            const params = {
                documentNum: documentNum,
                searchBy: selectedSearchBy?.value,
                fromDate: fromDate,
                toDate: toDate
            };
            if (myAdjust === 'Yes' && userId) {
                params[filterBy] = userId;
            }
            const response = await api.get(`/api/Document/GetAllDocuments`, { params });
            setDocuments(response.data);
            /* Clear selected document and adjustment requests */
            setSelectedDocument(null);
            setAdjustmentRequests([]);
        } catch (error) {
            console.error('Error fetching data', error);
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

    const exportToExcel = () => {
        if (!selectedDocument || adjustmentRequests.length === 0) {
            alert('Please select a document and ensure there are adjustment requests to export.');
            return;
        }

        const workbook = XLSX.utils.book_new();

        // Add selectedDocument sheet
        const documentSheet = XLSX.utils.json_to_sheet([selectedDocument]);
        XLSX.utils.book_append_sheet(workbook, documentSheet, 'Document');

        // Add adjustmentRequests sheet
        const totalDisputeMny = adjustmentRequests.reduce((sum, adj) => sum + adj.disputeMny, 0);
        const adjustmentRequestsWithTotal = [...adjustmentRequests, { disputeMny: totalDisputeMny }];
        const adjustmentRequestsSheet = XLSX.utils.json_to_sheet(adjustmentRequestsWithTotal);
        XLSX.utils.book_append_sheet(workbook, adjustmentRequestsSheet, 'Adjustments');

        // Add "Total" text in column C
        const totalRowIndex = adjustmentRequestsWithTotal.length + 1;
        adjustmentRequestsSheet[`C${totalRowIndex}`] = { t: 's', v: 'Total' };
        //adjustmentRequestsSheet[`D${totalRowIndex}`] = { t: 'n', v: totalDisputeMny };

        // Export to Excel
        XLSX.writeFile(workbook, 'ExportedData.xlsx');
    };

    const exportAllToExcel = async () => {
        if (documents.length === 0) {
            alert('No documents to export.');
            return;
        }

        const workbook = XLSX.utils.book_new();

        // Add documents sheet
        const documentsSheet = XLSX.utils.json_to_sheet(documents);
        XLSX.utils.book_append_sheet(workbook, documentsSheet, 'Documents');

        // Fetch adjustment requests for each document
        const allAdjustmentRequests = [];
        for (const doc of documents) {
            try {
                const response = await api.get(`/api/Adjustment/GetAdjustmentRequests`, {
                    params: {
                        documentNum: doc.documentNum
                    }
                });
                allAdjustmentRequests.push(...response.data);
            } catch (error) {
                console.error(`Error fetching adjustment requests for document ${doc.documentNum}`, error);
            }
        }

        // Add adjustmentRequests sheet
        const totalDisputeMny = allAdjustmentRequests.reduce((sum, adj) => sum + adj.disputeMny, 0);
        const allAdjustmentRequestsWithTotal = [...allAdjustmentRequests, { disputeMny: totalDisputeMny }];
        const allAdjustmentRequestsSheet = XLSX.utils.json_to_sheet(allAdjustmentRequestsWithTotal);
        XLSX.utils.book_append_sheet(workbook, allAdjustmentRequestsSheet, 'Adjustments');

        // Add "Total" text in column C
        const totalRowIndex = allAdjustmentRequestsWithTotal.length + 1;
        allAdjustmentRequestsSheet[`C${totalRowIndex}`] = { t: 's', v: 'Total' };
        //allAdjustmentRequestsSheet[`D${totalRowIndex}`] = { t: 'n', v: totalDisputeMny };

        // Export to Excel
        XLSX.writeFile(workbook, 'AllExportedData.xlsx');
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
                                        <button className="btn btn-default mr-2" onClick={exportToExcel}>Export Current</button>
                                        <button className="btn btn-default" onClick={exportAllToExcel}>Export All Documents</button>
                                    </div>
                                    <DocumentTable documents={documents} selectedDocument={selectedDocument} handleSelectDocument={handleSelectDocument} />
                                    <DocumentDetails selectedDocument={selectedDocument} adjustmentRequests={adjustmentRequests} />
                                </div>
                            </div>
                            {/* END CONTENT */}
                        </div>
                    </div>
                    {/* /.row */}
                </div>
                {/* /.container-fluid */}
            </div>
            {/* /.content */}
        </div>
    );
}

export default SearchAdj;
