import React, { useEffect, useState } from 'react';
import api from '../api';

const DocumentContext = React.createContext();

export const useDocumentContext = () => {
  return React.useContext(DocumentContext);
};

export const DocumentProvider = ({ children }) => {

    const [pendingDocumentNum, setPendingDocumentNum] = useState(null);
    const [adjustmentRequests, setAdjustmentRequests] = useState([]);

    const fetchPendingDocumentNumAndRequests = async () => {
        try {
            const response = await api.get('/api/Document/GetPendingDocumentNum', {
                params: {
                    documentType: '01',
                    createdBy: JSON.parse(localStorage.getItem('userLogin'))?.userId
                }
            });
            setPendingDocumentNum(response.data);

            const adjustmentResponse = await api.get('/api/Adjustment/GetAdjustmentRequests', {
                params: {
                    documentNum: response.data
                }
            });
            setAdjustmentRequests(adjustmentResponse.data);

        } catch (error) {
            console.error('Error fetching pending document number:', error);
        }
    };

    return (
        <DocumentContext.Provider value={{ pendingDocumentNum, adjustmentRequests, fetchPendingDocumentNumAndRequests }}>
            {children}
        </DocumentContext.Provider>
    );
}
