import React, { useState } from 'react';
import api from '../api';

const DocumentContext = React.createContext();

export const useDocumentContext = () => {
  return React.useContext(DocumentContext);
};

export const DocumentProvider = ({ children }) => {

    /** Account */
    const [accountNum, setAccountNum] = useState("");
    const [accounts, setAccounts] = useState([]);
    const [selectedAccount, setSelectedAccount] = useState({});
  
    const getAccountsByAccountNum = async (accountNum) => {
        try {
            const response = await api.get('/api/Account/GetAccountsByAccountNum', {
            params: {
                accountNum: accountNum
            }
            });
            setAccounts(response.data);
        } catch (error) {
            console.error('Error fetching accounts:', error);
        }
    }

    /** Document */
    const [pendingDocument, setPendingDocument] = useState({});
    const [adjustmentRequests, setAdjustmentRequests] = useState([]);

    const fetchPendingDocumentAndRequests = async (documentType) => {
        try {
            const response = await api.get('/api/Document/GetPendingDocument', {
                params: {
                    documentType: documentType,
                    createdBy: JSON.parse(localStorage.getItem('userLogin'))?.userId
                }
            });
            setPendingDocument(response.data);

            const adjustmentResponse = await api.get('/api/Adjustment/GetAdjustmentRequests', {
                params: {
                    documentNum: response.data?.documentNum
                }
            });
            setAdjustmentRequests(adjustmentResponse.data);

        } catch (error) {
            console.error('Error fetching pending document number:', error);
        }
    };

    const deleteAdjustmentRequest = async (documentSeq) => {
        try {
            const response = await api.delete('/api/Adjustment/DeleteAdjustmentRequestByDocumentSeq', {
                params: {
                    documentSeq: documentSeq
                }
            });
            setAdjustmentRequests(adjustmentRequests.filter(request => request.documentSeq !== documentSeq));
        } catch (error) {
            console.error('Error deleting adjustment request:', error);
        }
    };
    
    const updateDocumentStatus = async (documentNum, reviewType, documentStatus) => {
        try {
            const response = await api.put(`/api/Document/UpdateDocument${reviewType}Status/${documentNum}`, {
                documentNum: documentNum,
                documentStatus: documentStatus,
                updatedBy: JSON.parse(localStorage.getItem('userLogin'))?.userId
            });
        } catch (error) {
            console.error('Error updating document status', error);
        }
    }

    return (
        <DocumentContext.Provider value={{ 
                pendingDocument, adjustmentRequests, fetchPendingDocumentAndRequests, deleteAdjustmentRequest, updateDocumentStatus,
                accountNum, setAccountNum, accounts, getAccountsByAccountNum, selectedAccount, setSelectedAccount
            }}>
            {children}
        </DocumentContext.Provider>
    );
}
