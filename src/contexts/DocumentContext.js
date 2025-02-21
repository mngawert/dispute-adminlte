import React, { useState, useEffect } from 'react';
import api from '../api';
import { DOCUMENT_TYPE } from './Constants';
import { jwtDecode } from 'jwt-decode';
import getTranslation from '../utils/getTranslation';
import { get } from 'jquery';

const DocumentContext = React.createContext();

export const useDocumentContext = () => {
  return React.useContext(DocumentContext);
};

export const DocumentProvider = ({ children }) => {

    const [language, setLanguage] = useState('th'); // Default language

    /** User and Roles */
    // const [user, setUser] = useState(null);
    // const [roles, setRoles] = useState([]);

    // useEffect(() => {
    //     const token = localStorage.getItem('authToken');
    //     if (token) {
    //         const decodedToken = jwtDecode(token);
    //         const roles = decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || [];
    //         setUser(user);
    //         setRoles(roles);
    //     }
    // }, []);

    // const userHasRole = (role) => {
    //     return roles.includes(role);
    // };

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
                alert(getTranslation('noAccountsFound', language));
            }

            /** Clear states */
            setSelectedAccount(null);
            setServices([]); setSelectedService({}); 
            setInvoices([]); setSelectedInvoice({}); 
            setInvoiceDataServices([]); setInvoiceDataRC([]); setInvoiceDataUsage([]); setSelectedInvoiceDataService({}); setSelectedInvoiceDataRC({}); setSelectedInvoiceDataUsage({}); 
            setCostedEvents([]); setSelectedCostedEvent({});
            setAdjustmentTypes([]); setSelectedAdjustmentType({}); 
            setAdjustmentNote('');
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
                alert(getTranslation('noAccountsFound', language));
            }

            /** Clear states */
            setSelectedAccount(null);
            setServices([]); setSelectedService({}); 
            setInvoices([]); setSelectedInvoice({}); 
            setInvoiceDataServices([]); setInvoiceDataRC([]); setInvoiceDataUsage([]); setSelectedInvoiceDataService({}); setSelectedInvoiceDataRC({}); setSelectedInvoiceDataUsage({}); 
            setCostedEvents([]); setSelectedCostedEvent({});
            setAdjustmentTypes([]); setSelectedAdjustmentType({}); 
            setAdjustmentNote('');
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

            if (response.data.length === 0) {
                alert(getTranslation('noCostedEventsFound', language));
            }
        } catch (error) {
            console.error('Error fetching costed event:', error);
        }
    }


    /** AdjustmentTypes */

    const [adjustmentTypes, setAdjustmentTypes] = useState([]);
    const [selectedAdjustmentType, setSelectedAdjustmentType] = useState({});
    const [adjustmentAmount, setAdjustmentAmount] = useState(0);
    const [adjustmentNote, setAdjustmentNote] = useState('');

    const getAdjustmentTypesByProductCodeAndRevenueCode = async (invoiceData) => {
        try {
            const response = await api.get(`/api/AdjustmentType/GetAdjustmentTypesByProductCodeAndRevenueCode`, {
                params: {
                  productCode: invoiceData.productCode,
                  revenueCodeIds: invoiceData.revenueCodeIds
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

    const validateInputsAdjustMinus = (documentType) => {

        console.log('documentType:', documentType);
        console.log('selectedInvoice:', selectedInvoice);

        if (!accountNum) {
            return getTranslation('enterAccountNumber', language);
        }
        if (!selectedAccount || Object.keys(selectedAccount).length === 0) {
            return getTranslation('selectAccount', language);
        }
        if (!selectedInvoice || Object.keys(selectedInvoice).length === 0) {
            return getTranslation('selectInvoice', language);
        }
        if (!selectedInvoiceDataService || Object.keys(selectedInvoiceDataService).length === 0) {
            return getTranslation('selectServiceNumber', language);
        }
        if ((!selectedInvoiceDataRC || Object.keys(selectedInvoiceDataRC).length === 0) && (!selectedInvoiceDataUsage || Object.keys(selectedInvoiceDataUsage).length === 0)) {
            return getTranslation('selectRCOrUsage', language);
        }
        if (!selectedAdjustmentType || Object.keys(selectedAdjustmentType).length === 0) {
            return getTranslation('selectAdjustmentType', language);
        }
        if (!adjustmentAmount) {
            return getTranslation('enterAdjustmentAmount', language);
        }
        if (isNaN(adjustmentAmount)) {
            return getTranslation('adjustmentAmountNumber', language);
        }
        if (parseFloat(adjustmentAmount) <= 0) {
            return getTranslation('adjustmentAmountGreaterThanZero', language);
        }
        if (parseFloat(adjustmentAmount) > parseFloat(selectedInvoiceDataRC?.aggAmount ?? selectedInvoiceDataUsage?.aggAmount)) {
            return getTranslation('adjustmentAmountLessThanCharge', language);
        }
        if (parseFloat(adjustmentAmount) > parseFloat(selectedInvoice?.invoiceNetMny)) {
            return getTranslation('adjustmentAmountLessThanInvoice', language);
        }
        if (parseFloat(selectedInvoice?.writeOffMny) > 0) {
            return getTranslation('invoiceWrittenOff', language);
        }
        if (documentType === DOCUMENT_TYPE.P35) {

            console.log('process.env.REACT_APP_OVERRIDE_CURRENT_DATE_FLAG:', process.env.REACT_APP_OVERRIDE_CURRENT_DATE_FLAG);
            console.log('process.env.REACT_APP_OVERRIDE_CURRENT_DATE_VALUE:', process.env.REACT_APP_OVERRIDE_CURRENT_DATE_VALUE);
            
            const currentDate = process.env.REACT_APP_OVERRIDE_CURRENT_DATE_FLAG === 'Y' ? new Date(process.env.REACT_APP_OVERRIDE_CURRENT_DATE_VALUE) : new Date();

            console.log('currentDate:', currentDate);

            const actualBillDtm = new Date(selectedInvoice.actualBillDtm);
            const lastYear = currentDate.getFullYear() - 1;
            const startDate = new Date(lastYear, 10, 1); // November 1st of last year
            const endDate = new Date(lastYear, 11, 31); // December 31st of last year

            const billDtm = new Date(selectedInvoice.billDtm);
            if (billDtm.getMonth() === 11) { // December
                endDate.setMonth(0); // January
                endDate.setFullYear(currentDate.getFullYear()); // Current year
            }

            console.log('actualBillDtm:', actualBillDtm);
            console.log('billDtm:', billDtm);
            console.log('startDate:', startDate);
            console.log('endDate:', endDate);

            if (actualBillDtm < startDate || actualBillDtm > endDate) {
                return getTranslation('p35InvoiceDate', language, { lastYear });
            }

            const startYear = currentDate.getFullYear();
            const startJan = new Date(startYear, 0, 1); // January 1st of current year
            const endMar = new Date(startYear, 2, 31); // March 31st of current year

            if (currentDate < startJan || currentDate > endMar) {
                return getTranslation('p35AdjustmentDate', language, { startYear });
            }

        }
        if (documentType === DOCUMENT_TYPE.P36) {

            const currentDate = process.env.REACT_APP_OVERRIDE_CURRENT_DATE_FLAG === 'Y' ? new Date(process.env.REACT_APP_OVERRIDE_CURRENT_DATE_VALUE) : new Date();

            const actualBillDtm = new Date(selectedInvoice.actualBillDtm);
            const lastYear = currentDate.getFullYear() - 1;
            const endOfOctoberLastYear = new Date(lastYear, 9, 31); // October 31st of last year

            if (actualBillDtm > endOfOctoberLastYear) {
                return getTranslation('p36InvoiceDate', language, { lastYear });
            }

        }
        if (documentType === DOCUMENT_TYPE.ADJUST_MINUS) {

            const currentDate = process.env.REACT_APP_OVERRIDE_CURRENT_DATE_FLAG === 'Y' ? new Date(process.env.REACT_APP_OVERRIDE_CURRENT_DATE_VALUE) : new Date();
            const currentYear = currentDate.getFullYear();
            const actualBillDtmYear = new Date(selectedInvoice.actualBillDtm).getFullYear();

            if (actualBillDtmYear !== currentYear) {
                return getTranslation('adjustMinusInvoiceDate', language);
            }

        }

        return '';
    }

    const validateInputsAdjustPlus = (documentType) => {
        if (!accountNum) {
            return getTranslation('enterAccountNumber', language);
        }
        if (!selectedAccount || Object.keys(selectedAccount).length === 0) {
            return getTranslation('selectAccount', language);
        }
        if (!selectedService || Object.keys(selectedService).length === 0) {
            return getTranslation('selectServiceNumber', language);
        }
        if (!selectedAdjustmentType || Object.keys(selectedAdjustmentType).length === 0) {
            return getTranslation('selectAdjustmentType', language);
        }
        if (!adjustmentAmount) {
            return getTranslation('enterAdjustmentAmount', language);
        }
        if (isNaN(adjustmentAmount)) {
            return getTranslation('adjustmentAmountNumber', language);
        }
        if (parseFloat(adjustmentAmount) <= 0) {
            return getTranslation('adjustmentAmountGreaterThanZero', language);
        }
        
        return '';
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
            alert(getTranslation('adjustmentRequestCreated', language));

            /** Clear states */
            setAccountNum(""); setAccounts([]); setSelectedAccount(null);
            setSelectedAccount(null);
            setServices([]); setSelectedService({}); 
            setInvoices([]); setSelectedInvoice({}); 
            setInvoiceDataServices([]); setInvoiceDataRC([]); setInvoiceDataUsage([]); setSelectedInvoiceDataService({}); setSelectedInvoiceDataRC({}); setSelectedInvoiceDataUsage({}); 
            setCostedEvents([]); setSelectedCostedEvent({});
            setAdjustmentTypes([]); setSelectedAdjustmentType({}); 
            setAdjustmentNote('');
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
                language, setLanguage,
                //user, setUser, roles, setRoles, userHasRole,
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
                adjustmentNote, setAdjustmentNote,
                validateInputsAdjustMinus, validateInputsAdjustPlus,
                createAdjustmentRequest,
                costedEvents, setCostedEvents, getCostedEvents, selectedCostedEvent, setSelectedCostedEvent
            }}>
            {children}
        </DocumentContext.Provider>
    );
}
