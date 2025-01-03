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
    const [selectedAccount, setSelectedAccount] = useState(null);
  
    const getAccountsByAccountNum = async (accountNum) => {
        try {
            const response = await api.get('/api/Account/GetAccountsByAccountNum', {
                params: {
                    accountNum: accountNum
                }
            });
            setAccounts(response.data);

            if (response.data.length === 0) {
                alert('No accounts found');
            }

            /** Clear states */
            setSelectedAccount(null);
            setServices([]); setSelectedService({}); 
            setInvoices([]); setSelectedInvoice({}); 
            setInvoiceDataServices([]); setInvoiceDataRC([]); setInvoiceDataUsage([]); setSelectedInvoiceDataService({}); setSelectedInvoiceDataRC({}); setSelectedInvoiceDataUsage({}); 
            setCostedEvents([]); setSelectedCostedEvent({});
            setAdjustmentTypes([]); setSelectedAdjustmentType({}); 
            setAdjustmentAmount(0); 

        } catch (error) {
            console.error('Error fetching accounts:', error);
        }
    }
    
    const getAccountsByServiceNum = async (serviceNum) => {
        try {
            const response = await api.get('/api/Account/GetAccountsByServiceNum', {
                params: {
                    serviceNum: serviceNum
                }
            });
            setAccounts(response.data);

            if (response.data.length === 0) {
                alert('No accounts found');
            }

            /** Clear states */
            setSelectedAccount(null);
            setServices([]); setSelectedService({}); 
            setInvoices([]); setSelectedInvoice({}); 
            setInvoiceDataServices([]); setInvoiceDataRC([]); setInvoiceDataUsage([]); setSelectedInvoiceDataService({}); setSelectedInvoiceDataRC({}); setSelectedInvoiceDataUsage({}); 
            setCostedEvents([]); setSelectedCostedEvent({});
            setAdjustmentTypes([]); setSelectedAdjustmentType({}); 
            setAdjustmentAmount(0);

        } catch (error) {
            console.error('Error fetching accounts:', error);
        }
    }

    /** Services */

    const [serviceNum, setServiceNum] = useState("");
    const [services, setServices] = useState([]);
    const [selectedService, setSelectedService] = useState({});

    const getServicesByAccountNum = async (accountNum) => {
        try {
            const response = await api.get('/api/Account/GetServicesByAccountNum', {
                params: {
                    accountNum: accountNum
                }
            });
            setServices(response.data);
        } catch (error) {
            console.error('Error fetching services:', error);
        }
    }

    /** Invoices */
    const [invoices, setInvoices] = useState([]);
    const [selectedInvoice, setSelectedInvoice] = useState({});

    const getInvoicesByAccountNum = async (accountNum) => {
        try {
            const response = await api.get('/api/BillSummary/GetBillSummaryByAccountNum', {
                params: {
                    accountNum: accountNum
                }
            });
            setInvoices(response.data);
        } catch (error) {
            console.error('Error fetching invoices:', error);
        }
    }

    const [invoiceDataServices, setInvoiceDataServices] = useState([]);
    const [invoiceDataRC, setInvoiceDataRC] = useState([]);
    const [invoiceDataUsage, setInvoiceDataUsage] = useState([]);
    const [selectedInvoiceDataService, setSelectedInvoiceDataService] = useState({});
    const [selectedInvoiceDataRC, setSelectedInvoiceDataRC] = useState({});
    const [selectedInvoiceDataUsage, setSelectedInvoiceDataUsage] = useState({});

    const getInvoiceDataServices = async (invoice) => {
        try {
            const response = await api.get(`/api/SAPInvoiceFeedData/GetSAPInvoiceFeedDataServiceNumbers`, {
                params: {
                    accountNum: invoice.accountNum,
                    billSeq: invoice.billSeq
                }
            });
            setInvoiceDataServices(response.data);
        } catch (error) {
            console.error('Error fetching invoice feed data services:', error);
        }
    }

    const getInvoiceDataRC = async (invoiceData) => {
        try {
            const response = await api.get(`/api/SAPInvoiceFeedData/GetSAPInvoiceFeedDataRC`, {
                params: {
                    accountNum: invoiceData.accountNum,
                    billSeq: invoiceData.billSeq,
                    serviceNumber: invoiceData.serviceNumber
                }
            });
            setInvoiceDataRC(response.data);
        } catch (error) {
            console.error('Error fetching invoice feed data RC:', error);
        }
    }

    const getInvoiceDataUsage = async (invoiceData) => {
        try {
            const response = await api.get(`/api/SAPInvoiceFeedData/GetSAPInvoiceFeedDataUsage`, {
                params: {
                    accountNum: invoiceData.accountNum,
                    billSeq: invoiceData.billSeq,
                    serviceNumber: invoiceData.serviceNumber
                }
            });
            setInvoiceDataUsage(response.data);
        } catch (error) {
            console.error('Error fetching invoice feed data Usage:', error);
        }
    }

    /** Costed Event */
    const [costedEvents, setCostedEvents] = useState([]);
    const [selectedCostedEvent, setSelectedCostedEvent] = useState({});

    const getCostedEvents = async (invoiceData) => {
        try {
            const response = await api.get(`/api/CostedEvent/GetCostedEvents`, {
                params: {
                  accountNum: invoiceData.accountNum,
                  billSeq: invoiceData.billSeq,
                  eventSource: invoiceData.serviceNumber,
                  eventTypeId: invoiceData.eventTypeId,
                  callType: invoiceData.callType
                }
              });
              setCostedEvents(response.data);
        } catch (error) {
            console.error('Error fetching costed event:', error);
        }
    }


    /** AdjustmentTypes */

    const [adjustmentTypes, setAdjustmentTypes] = useState([]);
    const [selectedAdjustmentType, setSelectedAdjustmentType] = useState({});
    const [adjustmentAmount, setAdjustmentAmount] = useState(0);

    const getAdjustmentTypesByProductCodeAndRevenueCode = async (invoiceData) => {
        try {
            const response = await api.get(`/api/AdjustmentType/GetAdjustmentTypesByProductCodeAndRevenueCode`, {
                params: {
                  productCode: invoiceData.productCode,
                  revenueCodeId: invoiceData.revenueCodeId
                }
            });
            setAdjustmentTypes(response.data);
            if (response.data.length > 0) {
                setSelectedAdjustmentType(response.data[0]);
            }
        } catch (error) {
            console.error('Error fetching adjustment types:', error);
        }
    }

    const getAdjustmentTypes = async (adjustmentTypeNames) => {
        try {

            const params = new URLSearchParams();
            adjustmentTypeNames.forEach(name => params.append('adjustmentTypeNames', name));
      
            const response = await api.get(`/api/AdjustmentType/GetAdjustmentTypes`, {
                params: params
            });
            setAdjustmentTypes(response.data);
            if (response.data.length > 0) {
                setSelectedAdjustmentType(response.data[0]);
            }
        } catch (error) {
            console.error('Error fetching adjustment types:', error);
        }
    }



    /** Validation */

    const validateInputsAdjustMinus = () => {
        if (!accountNum) {
            return 'Please enter an account number';
        } else if (!selectedAccount || Object.keys(selectedAccount).length === 0) {
            return 'Please select an account';
        } else if (!selectedInvoice || Object.keys(selectedInvoice).length === 0) {
            return 'Please select an invoice';
        } else if (!selectedInvoiceDataService || Object.keys(selectedInvoiceDataService).length === 0) {
            return 'Please select a service number';
        } else if ((!selectedInvoiceDataRC || Object.keys(selectedInvoiceDataRC).length === 0) && (!selectedInvoiceDataUsage || Object.keys(selectedInvoiceDataUsage).length === 0) ) {
            return 'Please select a RC or Usage';
        } else if (!selectedAdjustmentType || Object.keys(selectedAdjustmentType).length === 0) {
            return 'Please select an adjustment type';
        } else if (!adjustmentAmount) {
            return 'Please enter an adjustment amount';
        } else if (isNaN(adjustmentAmount)) {
            return 'Adjustment amount must be a number';
        } else if (parseFloat(adjustmentAmount) <= 0) {
            return 'Adjustment amount must be greater than 0';
        } else if (parseFloat(adjustmentAmount) > parseFloat(selectedInvoiceDataRC?.aggAmount ?? selectedInvoiceDataUsage?.aggAmount)) {
            return 'Adjustment amount must be less than or equal to the charge amount';
        } else if (parseFloat(adjustmentAmount) > parseFloat(selectedInvoice?.invoiceNetMny)) {
            return 'Adjustment amount must be less than or equal to the invoice amount';
        }
        
        else {
            return '';
        }
    }

    const validateInputsAdjustPlus = () => {
        if (!accountNum) {
            return 'Please enter an account number';
        } else if (!selectedAccount || Object.keys(selectedAccount).length === 0) {
            return 'Please select an account';
        } else if (!selectedService || Object.keys(selectedService).length === 0) {
            return 'Please select a service';
        } else if (!selectedAdjustmentType || Object.keys(selectedAdjustmentType).length === 0) {
            return 'Please select an adjustment type';
        } else if (!adjustmentAmount) {
            return 'Please enter an adjustment amount';
        } else if (isNaN(adjustmentAmount)) {
            return 'Adjustment amount must be a number';
        } else if (parseFloat(adjustmentAmount) <= 0) {
            return 'Adjustment amount must be greater than 0';
        }
        
        else {
            return '';
        }
    }

    /** Create Adjustment Request */

    const createAdjustmentRequest = async (documentType) => {
        
        const isSelectedInvoiceValid = selectedInvoice && Object.keys(selectedInvoice).length > 0;
        const disputeAmount = isSelectedInvoiceValid ? parseFloat(adjustmentAmount) : parseFloat(adjustmentAmount) * -1; 

        try {
            const response = await api.post('/api/Adjustment/CreateAdjustmentRequest', {
                documentType: documentType,
                createdBy: JSON.parse(localStorage.getItem('userLogin'))?.userId,
                accountNum: selectedAccount.accountNum,
                disputeDtm: new Date().toISOString(),
                billSeq: selectedInvoice?.billSeq,
                disputeMny: disputeAmount,
                productId: selectedInvoiceDataRC?.productId ?? selectedInvoiceDataUsage?.productId,
                cpsId: selectedAccount.cpsId,
                productSeq: selectedInvoiceDataRC?.productSeq ?? selectedInvoiceDataUsage?.productSeq,
                eventRef: selectedCostedEvent?.eventRef,
                eventTypeId: selectedCostedEvent?.eventTypeId,
                adjustmentTypeId: selectedAdjustmentType.adjustmentTypeId,
                serviceNum: selectedInvoiceDataService?.serviceNumber || selectedService?.serviceNum,
                invoiceNum: selectedInvoice?.invoiceNum,
                disputeSeq: null,
                adjustmentSeq: null,
                requestStatus: "Create-Pending"
            });
            console.log('Adjustment Request Created:', response.data);
            alert('Adjustment Request Created');

            /** Clear states */
            setAccountNum(""); setAccounts([]); setSelectedAccount(null);
            setSelectedAccount(null);
            setServices([]); setSelectedService({}); 
            setInvoices([]); setSelectedInvoice({}); 
            setInvoiceDataServices([]); setInvoiceDataRC([]); setInvoiceDataUsage([]); setSelectedInvoiceDataService({}); setSelectedInvoiceDataRC({}); setSelectedInvoiceDataUsage({}); 
            setCostedEvents([]); setSelectedCostedEvent({});
            setAdjustmentTypes([]); setSelectedAdjustmentType({}); 
            setAdjustmentAmount(0);            
        } catch (error) {
            console.error('Error creating adjustment request', error);
            alert('Error creating adjustment request');
        }
      };

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
                accountNum, setAccountNum, accounts, getAccountsByAccountNum, getAccountsByServiceNum, selectedAccount, setSelectedAccount,
                serviceNum, setServiceNum, services, setServices, getServicesByAccountNum, selectedService, setSelectedService,
                invoices, setInvoices, getInvoicesByAccountNum, selectedInvoice, setSelectedInvoice,
                invoiceDataServices, setInvoiceDataServices, getInvoiceDataServices,
                invoiceDataRC, setInvoiceDataRC, getInvoiceDataRC,
                invoiceDataUsage, setInvoiceDataUsage, getInvoiceDataUsage,
                selectedInvoiceDataService, setSelectedInvoiceDataService,
                selectedInvoiceDataRC, setSelectedInvoiceDataRC,
                selectedInvoiceDataUsage, setSelectedInvoiceDataUsage,
                adjustmentTypes, setAdjustmentTypes, getAdjustmentTypesByProductCodeAndRevenueCode, getAdjustmentTypes,
                selectedAdjustmentType, setSelectedAdjustmentType,
                adjustmentAmount, setAdjustmentAmount,
                validateInputsAdjustMinus, validateInputsAdjustPlus,
                createAdjustmentRequest,
                costedEvents, setCostedEvents, getCostedEvents, selectedCostedEvent, setSelectedCostedEvent
            }}>
            {children}
        </DocumentContext.Provider>
    );
}
