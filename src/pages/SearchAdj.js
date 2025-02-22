import React, { useState, useEffect, useCallback } from 'react';
import api from '../api';
import { DOCUMENT_STATUS_LIST, SEARCH_BY_LIST } from '../contexts/Constants';
import ContentHeader from '../components/ContentHeader'; // Adjust the import path as necessary
import DocumentTable from '../components/DocumentTable';
import DocumentDetails from '../components/DocumentDetails';
import SearchBox from '../components/SearchBox';

const SearchAdj = ({ myAdjust, title, fetchDataAtStart }) => {
    const [documentNum, setDocumentNum] = useState('');
    const [documents, setDocuments] = useState([]);
    const [selectedDocument, setSelectedDocument] = useState(null);
    const [adjustmentRequests, setAdjustmentRequests] = useState([]);
    const [searchBy, setSearchBy] = useState(SEARCH_BY_LIST);
    const [selectedSearchBy, setSelectedSearchBy] = useState(null);
    const [filterBy, setFilterBy] = useState('createdBy');

    const getAllDocuments = useCallback(async () => {
        try {
            const userId = JSON.parse(localStorage.getItem('userLogin'))?.userId;

            const params = {
                documentNum: documentNum,
                searchBy: selectedSearchBy?.value
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
    }, [documentNum, selectedSearchBy, myAdjust, filterBy]);

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
                            />
                            <div className="card">
                                <div className="card-body">
                                    <p className="mb-3">Documents</p>
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
