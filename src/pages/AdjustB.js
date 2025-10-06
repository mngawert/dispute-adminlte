import { useEffect } from 'react';
import { useDocumentContext } from '../contexts/DocumentContext';
import PendingDocument from '../components/PendingDocument';
import { DOCUMENT_TYPE } from '../contexts/Constants';
import AccountSearch from '../components/AccountSearch';
import InvoiceSearch from '../components/InvoiceSearch';
import InvoiceDataServices from '../components/InvoiceDataServices';
import InvoiceDataRC from '../components/InvoiceDataRC';
import InvoiceDataUsage from '../components/InvoiceDataUsage';
import MakeAdjustment from '../components/MakeAdjustment';
import DisputeEvent from '../components/DisputeEvent';
import ContentHeader from '../components/ContentHeader';
import Accounts from '../components/Accounts';
import Services from '../components/Services';
import ServiceSearch from '../components/ServiceSearch';
import AccountInfo from '../components/AccountInfo';
import { useState } from 'react';
import api from '../api';
import getTranslation from '../utils/getTranslation';
import { v4 as uuidv4 } from 'uuid'; // npm install uuid

const AdjustB = ({documentType=DOCUMENT_TYPE.B, documentTypeName='B1+/-', adjustmentTypeNames=['B1']}) => {

    const [language, setLanguage] = useState('th'); // Default language

    const { 
        /** Account */
        accountNum, setAccountNum, accounts, getAccountsByAccountNum, getAccountsByServiceNum, selectedAccount, setSelectedAccount,
        
        /** Service */
        serviceNum, setServiceNum, services, setServices, getServicesByAccountNum, selectedService, setSelectedService,

        /** Document Submit */
        pendingDocument, adjustmentRequests, fetchPendingDocumentAndRequests, deleteAdjustmentRequest, updateDocumentStatus,

        /** Invoice */
        invoices, getInvoicesByAccountNum, selectedInvoice, setSelectedInvoice,

        /** Invoice Data Services */
        invoiceDataServices, setInvoiceDataServices, getInvoiceDataServices,
        invoiceDataRC, setInvoiceDataRC, getInvoiceDataRC,
        invoiceDataUsage, setInvoiceDataUsage, getInvoiceDataUsage,
        selectedInvoiceDataService, setSelectedInvoiceDataService,
        selectedInvoiceDataRC, setSelectedInvoiceDataRC,
        selectedInvoiceDataUsage, setSelectedInvoiceDataUsage,

        /** Adjustment */
        getAdjustmentTypesByProductCodeAndRevenueCode,getAdjustmentTypes,
        selectedAdjustmentType, setSelectedAdjustmentType,
        adjustmentAmount, setAdjustmentAmount,
        adjustmentNote, setAdjustmentNote,

        /** Validation */
        validateInputsAdjustMinus, validateInputsAdjustPlus,

        /** Create Adjustment Request */
        createAdjustmentRequest,

        /** Dispute Event */
        costedEvents, setCostedEvents, getCostedEvents, selectedCostedEvent, setSelectedCostedEvent

    } = useDocumentContext();


    const [adjustmentTypes, setAdjustmentTypes] = useState([]);
    
    // For B-
    const [accountNumBMinus, setAccountNumBMinus] = useState('');
    const [accountsBMinus, setAccountsBMinus] = useState([]);
    const [selectedAccountBMinus, setSelectedAccountBMinus] = useState(null);
    const [servicesBMinus, setServicesBMinus] = useState([]);
    const [selectedServiceBMinus, setSelectedServiceBMinus] = useState(null);
    const [invoicesBMinus, setInvoicesBMinus] = useState([]);
    const [selectedInvoiceBMinus, setSelectedInvoiceBMinus] = useState(null);
    const [invoiceDataServicesBMinus, setInvoiceDataServicesBMinus] = useState([]);
    const [selectedInvoiceDataServiceBMinus, setSelectedInvoiceDataServiceBMinus] = useState({});

    // For B+
    const [accountNumBPlus, setAccountNumBPlus] = useState('');
    const [accountsBPlus, setAccountsBPlus] = useState([]);
    const [selectedAccountBPlus, setSelectedAccountBPlus] = useState(null);
    const [servicesBPlus, setServicesBPlus] = useState([]);
    const [selectedServiceBPlus, setSelectedServiceBPlus] = useState(null);

    const getAccountsByAccountNumLocalBMinus = async (accountNum) => {        
        const accounts = await getAccountsByAccountNum(accountNum);
        setAccountsBMinus(accounts);
    }

    const getAccountsByAccountNumLocalBPlus = async (accountNum) => {
        //const accounts = await getAccountsByAccountNum(accountNum);
        //setAccountsBPlus(accounts);

        try {
            const response = await api.get('/api/Account/GetAccountsByAccountNum', {
                params: {
                    accountNum: accountNum,
                    bypassLocation: 'Y'
                }
            });
            setAccountsBPlus(response.data);

            if (response.data.length === 0) {
                alert(getTranslation('noAccountsFound', language));
            }

        } catch (error) {
            console.error('Error fetching accounts:', error);
        }
    }

    const getAccountsByServiceNumLocalBMinus = async (serviceNum) => {
        const accounts = await getAccountsByServiceNum(serviceNum);
        setAccountsBMinus(accounts);
    }

    const getAccountsByServiceNumLocalBPlus = async (serviceNum) => {
        //const accounts = await getAccountsByServiceNum(serviceNum);
        //setAccountsBPlus(accounts);

        try {
            const response = await api.get('/api/Account/GetAccountsByServiceNum', {
                params: {
                    serviceNum: serviceNum,
                    bypassLocation: 'Y'
                }
            });
            setAccountsBPlus(response.data);

            if (response.data.length === 0) {
                alert(getTranslation('noAccountsFound', language));
            }

        } catch (error) {
            console.error('Error fetching accounts:', error);
        }
    }

    const handleSelectAccountBMinus = async (account) => {
        setSelectedAccountBMinus(account);
        
        // Clear previous selections when account changes
        setSelectedServiceBMinus(null);
        setSelectedInvoiceBMinus(null);
        setInvoicesBMinus([]);
        
        // Load basic services (these won't have productSeq/productId until invoice is selected)
        const services = await getServicesByAccountNum(account.accountNum);
        const sortedServices = services.sort((a, b) => a.serviceNum.localeCompare(b.serviceNum));
        setServicesBMinus(sortedServices);
    }

    const handleSelectAccountBPlus = async (account) => {
        setSelectedAccountBPlus(account);
        const services = await getServicesByAccountNum(account.accountNum);
        const sortedServices = services.sort((a, b) => a.serviceNum.localeCompare(b.serviceNum));
        setServicesBPlus(sortedServices);
    }

    const handleSelectInvoiceBMinus = async (invoice) => {
        setSelectedInvoiceBMinus(invoice);

        const invoiceDataServices = await getInvoiceDataServices(invoice);
        
        // Validate API response
        if (!invoiceDataServices || invoiceDataServices.length === 0) {
            console.error('No invoice data services returned for invoice:', invoice);
            alert('No services found for this invoice.');
            setServicesBMinus([]);
            setSelectedServiceBMinus(null);
            return;
        }
        
        // Validate required fields
        const invalidServices = invoiceDataServices.filter(inv => 
            !inv.productSeq || !inv.productId || !inv.serviceNumber
        );
        
        if (invalidServices.length > 0) {
            console.error('Some services missing required fields:', invalidServices);
            console.warn(`${invalidServices.length} out of ${invoiceDataServices.length} services are missing required product information.`);
        }

        // convert invoiceDataServices to servicesBMinus - only include services with complete data
        const servicesBMinus = invoiceDataServices
            .filter(inv => inv.productSeq && inv.productId && inv.serviceNumber) // Only include valid services
            .map(inv => ({
                accountNum: inv.accountNum,
                billSeq: inv.billSeq,
                serviceNum: inv.serviceNumber,
                productId: inv.productId,
                productSeq: inv.productSeq,
                serviceLocationCode: inv.serviceLocationCode
            }));
        
        const sortedServicesBMinus = servicesBMinus.sort((a, b) => a.serviceNum.localeCompare(b.serviceNum));
        setServicesBMinus(sortedServicesBMinus);

        // Auto-select first service if available and no service was previously selected
        if (sortedServicesBMinus.length > 0) {
            if (!selectedServiceBMinus) {
                setSelectedServiceBMinus(sortedServicesBMinus[0]);
            } else {
                // Update existing selection with complete data
                const selected = sortedServicesBMinus.find(service => 
                    service.serviceNum === selectedServiceBMinus.serviceNum
                );
                if (selected) {
                    setSelectedServiceBMinus(selected);
                } else {
                    // Previously selected service not in invoice data, select first
                    setSelectedServiceBMinus(sortedServicesBMinus[0]);
                }
            }
        } else {
            setSelectedServiceBMinus(null);
            alert('No valid services with complete product information found for this invoice.');
        }

        // console.log('invoiceDataServices:', invoiceDataServices);
        // console.log('selectedServiceBMinus:', selectedServiceBMinus);

        // setInvoiceDataServicesBMinus(invoiceDataServices);

        // const selectedInvoiceDataServiceBMinus = invoiceDataServices.filter(service => service.serviceNumber === selectedServiceBMinus?.serviceNum)[0] || invoiceDataServices[0] || {};
        // console.log('selectedInvoiceDataServiceBMinus:', selectedInvoiceDataServiceBMinus);
        // setSelectedInvoiceDataServiceBMinus(selectedInvoiceDataServiceBMinus);


        setAdjustmentAmount(0);
    }

    const handleSelectServiceBMinus = (service) => {
        // Check if invoice is selected first for B- services
        if (!selectedInvoiceBMinus) {
            alert('Please select an invoice first before selecting a service for B- adjustments.');
            return;
        }
        
        // Ensure the selected service has productSeq and productId from invoice data
        if (servicesBMinus.length > 0) {
            const serviceWithDetails = servicesBMinus.find(s => s.serviceNum === service.serviceNum);
            if (serviceWithDetails && serviceWithDetails.productSeq && serviceWithDetails.productId) {
                setSelectedServiceBMinus(serviceWithDetails);
            } else {
                alert('Selected service is missing required product information. Please select an invoice first.');
                console.error('Service missing productSeq/productId:', service);
                return;
            }
        } else {
            alert('No services available. Please select an invoice first.');
            return;
        }
    };

    const getInvoicesByAccountNumLocalBMinus = async (accountNum) => {
        const invoices = await getInvoicesByAccountNum(accountNum);
        setInvoicesBMinus(invoices);
        setSelectedInvoiceBMinus(null); // Reset selected invoice
    }

    const getAdjustmentTypesLocal = async (adjustmentTypeNames) => {
      const adjustmentTypes = await getAdjustmentTypes(adjustmentTypeNames);
      setAdjustmentTypes(adjustmentTypes);
    }

    const handleCreateAdjustmentRequest = async (documentType, selectedReason) => {
        const validationError = validateInputsAdjustB(documentType);
        if(validationError) {
            alert(validationError);
            return;
        }

        const pairKey = uuidv4(); // Generate a unique key for this pair

        await createAdjustmentRequestLocal(documentType, selectedInvoiceBMinus, adjustmentAmount, selectedAccountBMinus, selectedServiceBMinus?.productId, null, null, selectedServiceBMinus?.productSeq, null, null, 6, selectedServiceBMinus?.serviceNum, adjustmentNote, pairKey, selectedServiceBMinus?.serviceLocationCode, selectedReason);
        await createAdjustmentRequestLocal(documentType, null, adjustmentAmount, selectedAccountBPlus, null, null, null, null, null, null, 5, selectedServiceBPlus?.serviceNum, adjustmentNote, pairKey, selectedServiceBPlus?.serviceLocationCode, selectedReason);

        alert(getTranslation('adjustmentRequestCreated', 'th'));
        await fetchPendingDocumentAndRequests(documentType);
    }

    const createAdjustmentRequestLocal = async (
        documentType, selectedInvoice, adjustmentAmount, selectedAccount, productId, tariffId, callType, productSeq, eventRef, eventTypeId, adjustmentTypeId, serviceNum, adjustmentNote, pairKey, serviceLocationCode, selectedReason
    ) => {
        
      const isSelectedInvoiceValid = selectedInvoice && Object.keys(selectedInvoice).length > 0;
      const disputeAmount = isSelectedInvoiceValid ? parseFloat(adjustmentAmount) : parseFloat(adjustmentAmount) * -1; 

      // Validation: Check for critical missing data for B- adjustments
      if (isSelectedInvoiceValid && adjustmentTypeId === 6) { // 6 is for B- adjustments
        if (!productId || !productSeq) {
          const errorMsg = `Critical error: productId (${productId}) or productSeq (${productSeq}) is null for B- adjustment`;
          console.error(errorMsg, {
            productId,
            productSeq,
            serviceNum,
            selectedAccount: selectedAccount?.accountNum,
            adjustmentTypeId,
            isSelectedInvoiceValid
          });
          alert('Product information is missing for B- adjustment. Please:\n1. Select an account\n2. Select an invoice\n3. Select a service from the invoice');
          throw new Error(errorMsg);
        }
      }

      try 
      {
        const response = await api.post('/api/Adjustment/CreateAdjustmentRequest', {
            documentType: documentType,
            createdBy: JSON.parse(localStorage.getItem('userLogin'))?.userId,
            accountNum: selectedAccount.accountNum,
            disputeDtm: new Date().toISOString(),
            billSeq: selectedInvoice?.billSeq,
            disputeMny: disputeAmount,
            productId: productId,
            tariffId: tariffId,
            callType: callType,
            cpsId: selectedAccount.cpsId,
            productSeq: productSeq,
            eventRef: eventRef,
            eventTypeId: eventTypeId,
            adjustmentTypeId: adjustmentTypeId,
            serviceNum: serviceNum,
            invoiceNum: selectedInvoice?.invoiceNum,
            disputeSeq: null,
            adjustmentSeq: null,
            requestStatus: "Create-Pending",
            note: adjustmentNote,
            pairKey: pairKey,
            serviceLocationCode: serviceLocationCode,
            reasonId: selectedReason
        });

        clearStates(); // Clear states after creating adjustment request
        
        console.log('Adjustment Request Created:', response.data);

      } catch (error) {
          console.error('Error creating adjustment request', error);
          alert('Error creating adjustment request');
      }
    };

    const clearStates = () => {
        setSelectedInvoiceBMinus(null);
        setSelectedInvoiceDataServiceBMinus({});
        setSelectedAccountBMinus(null);
        setSelectedServiceBPlus(null);
        setSelectedAccountBPlus(null);
        setInvoiceDataServicesBMinus([]);
        setAdjustmentNote('');
        setAdjustmentAmount(0);
        setAccountNumBMinus('');
        setAccountNumBPlus('');
        setAccountsBMinus([]);
        setAccountsBPlus([]);
        setServicesBMinus([]);
        setServicesBPlus([]);
        setInvoicesBMinus([]);
    }

    /** Validation */

    const validateInputsAdjustB = (documentType) => {
        console.log('documentType:', documentType);
        console.log('adjustmentAmount:', adjustmentAmount);
        console.log('selectedInvoice:', selectedInvoice);
        console.log('selectedCostedEvent:', selectedCostedEvent);
        
        // let remainingAmount = (parseFloat(selectedInvoice?.invoiceNetMny) - parseFloat(selectedInvoice?.adjustedMny) - parseFloat(selectedInvoice?.pendingAdjustmentMny));
        // console.log('remainingAmount:', remainingAmount);

        const userLogin = JSON.parse(localStorage.getItem('userLogin'));
        const creditLimit = userLogin?.creditLimit || 9999; // Default to 9999 if creditLimit is not available

        if (!accountNumBMinus || !accountNumBPlus) {
            return getTranslation('enterAccountNumber', language);
        }
        if (!selectedAccountBMinus || Object.keys(selectedAccountBMinus).length === 0 || !selectedAccountBPlus || Object.keys(selectedAccountBPlus).length === 0) {
            return getTranslation('selectAccount', language);
        }
        // New validation: terminationDat must be null for both accounts
        if (selectedAccountBMinus.terminationDat !== null || selectedAccountBPlus.terminationDat !== null) {
            return getTranslation('accountMustNotBeTerminated', language);
        }
        if (selectedAccountBMinus.invoicingCoName !== selectedAccountBPlus.invoicingCoName) {
            return getTranslation('invoicingCoNameMustMatch', language);
        }
        // New validation: cpsId must match between the two accounts
        if (selectedAccountBMinus.cpsId !== selectedAccountBPlus.cpsId) {
            return getTranslation('cpsIdMustMatch', language) || 'Both accounts must belong to the same VAT Rate (CPS ID)';
        }
        if (!selectedInvoiceBMinus || Object.keys(selectedInvoiceBMinus).length === 0) {
            return getTranslation('selectInvoice', language);
        }
        if (!selectedServiceBMinus || Object.keys(selectedServiceBMinus).length === 0 || !selectedServiceBPlus || Object.keys(selectedServiceBPlus).length === 0) {
            return getTranslation('selectServiceNumber', language);
        }
        // Additional validation: Check if B- service has required product information
        if (!selectedServiceBMinus.productSeq || !selectedServiceBMinus.productId) {
            return 'B- service is missing required product information. Please select an invoice first, then select the service.';
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
        if (parseFloat(adjustmentAmount) > creditLimit) {
            return getTranslation('adjustmentAmountLessThanOrEqualToCreditLimit', language, { creditLimit });
        }
        if (parseFloat(adjustmentAmount) > (parseFloat(selectedInvoiceBMinus?.invoiceNetMny) - parseFloat(selectedInvoiceBMinus?.adjustedMny) - parseFloat(selectedInvoiceBMinus?.pendingAdjustmentMny))) {
            return getTranslation('adjustmentAmountLessThanInvoice', language);
        }
        if (parseFloat(selectedInvoiceBMinus?.writeOffMny) > 0) {
            return getTranslation('invoiceWrittenOff', language);
        }

        return '';
    };


    const handleSelectInvoice = (invoice) => { 
        setSelectedInvoice(invoice);
        getInvoiceDataServices(invoice);

        /** Clear states */
        setInvoiceDataServices([]); setSelectedInvoiceDataService({}); 
        setInvoiceDataRC([]); setSelectedInvoiceDataRC({}); setInvoiceDataUsage([]); setSelectedInvoiceDataUsage({});
        setCostedEvents([]); setSelectedCostedEvent({});
        // setAdjustmentTypes([]); setSelectedAdjustmentType({}); 
        setAdjustmentAmount(0); 

        getAdjustmentTypes(adjustmentTypeNames)
    }

    const handleSelectInvoiceServices = (data) => {
        setSelectedInvoiceDataService(data);
        //getInvoiceDataRC(data);
        //getInvoiceDataUsage(data);

        /** Clear states */
        setInvoiceDataRC([]); setSelectedInvoiceDataRC({}); setInvoiceDataUsage([]); setSelectedInvoiceDataUsage({});
        setCostedEvents([]); setSelectedCostedEvent({});
        // setAdjustmentTypes([]); setSelectedAdjustmentType({}); 
        setAdjustmentAmount(0); 
    }

    const handleSelectInvoiceRC = (data) => {
        setSelectedInvoiceDataUsage({});
        setCostedEvents([]); setSelectedCostedEvent({});
        setSelectedInvoiceDataRC(data);
        getAdjustmentTypesByProductCodeAndRevenueCode(data);        

        /** Dont need to set amount */
        //setAdjustmentAmount(data?.aggAmount);
    }

    const handleSelectInvoiceUsage = (data) => {
        setSelectedInvoiceDataRC({});
        setSelectedInvoiceDataUsage(data);
        setCostedEvents([]); setSelectedCostedEvent({});
        getAdjustmentTypesByProductCodeAndRevenueCode(data);

        /** Dont need to set amount */
        //setAdjustmentAmount(data?.aggAmount);
    }

    const handleSelectCostedEvent = (data) => {
        setSelectedCostedEvent(data);

        /** Dont need to set amount */
        //setAdjustmentAmount(data?.eventCostMny);
    }

    const handleSelectAccount = (account) => {
        setSelectedAccount(account);
        getServicesByAccountNum(account.accountNum);

        /** Fetch Adjustment types */
        getAdjustmentTypes(adjustmentTypeNames);
    }

    /** Fetch Pending Document */
    useEffect(() => {
        fetchPendingDocumentAndRequests(documentType);

        /** Fetch Adjustment types */
        getAdjustmentTypesLocal(adjustmentTypeNames);

    }, []);


    return (
    <div className="content-wrapper-x">
      <ContentHeader title={documentTypeName} />

      <div className="content">
          <div className="container-fluid">
            <div className="row">
                <div className="col-12">

                  <div className="card">
                      <div className="card-body">
                          <div className="row">
                              <div className="col-sm-4">
                                  <ServiceSearch
                                      title="Search for service number for B-:"
                                      accountNum={accountNumBMinus}
                                      setAccountNum={setAccountNumBMinus}
                                      getAccountsByAccountNum={getAccountsByAccountNumLocalBMinus}
                                      getAccountsByServiceNum={getAccountsByServiceNumLocalBMinus}
                                  />
                              </div>
                              <div className="col-sm-2">
                                  <Accounts
                                      accounts={accountsBMinus || []}
                                      selectedAccount={selectedAccountBMinus}
                                      setSelectedAccount={handleSelectAccountBMinus}
                                  />
                              </div>
                              <div className="col-sm-2">
                                  <Services
                                      services={servicesBMinus}
                                      selectedService={selectedServiceBMinus}
                                      setSelectedService={handleSelectServiceBMinus}
                                  />
                              </div>
                              <div className="col-sm-4">
                                  <AccountInfo selectedAccount={selectedAccountBMinus} />
                              </div>
                          </div>
                      </div>
                  </div>

                  <div className="card">
                      <div className="card-body">
                          <InvoiceSearch
                            accountNum={selectedAccountBMinus?.accountNum}
                            invoices={invoicesBMinus || []}
                            getInvoicesByAccountNum={getInvoicesByAccountNumLocalBMinus}
                            selectedInvoice={selectedInvoiceBMinus}
                            handleSelectInvoice={handleSelectInvoiceBMinus}
                          />
                      </div>
                  </div>

                  <div className="card">
                      <div className="card-body">
                          <div className="row">
                              <div className="col-sm-4">
                                  <ServiceSearch
                                      title="Search for service number for B+:"
                                      accountNum={accountNumBPlus}
                                      setAccountNum={setAccountNumBPlus}
                                      getAccountsByAccountNum={getAccountsByAccountNumLocalBPlus}
                                      getAccountsByServiceNum={getAccountsByServiceNumLocalBPlus}
                                  />
                              </div>

                              <div className="col-sm-2">
                                  <Accounts
                                      accounts={accountsBPlus || []}
                                      selectedAccount={selectedAccountBPlus}
                                      setSelectedAccount={handleSelectAccountBPlus}
                                  />
                              </div>
                              <div className="col-sm-2">
                                  <Services
                                      services={servicesBPlus}
                                      selectedService={selectedServiceBPlus}
                                      setSelectedService={setSelectedServiceBPlus}
                                  />
                              </div>
                              <div className="col-sm-4">
                                  <AccountInfo selectedAccount={selectedAccountBPlus} />
                              </div>
                          </div>
                      </div>
                  </div>

                  <div className="card">
                      <div className="card-body">
                        <MakeAdjustment adjustmentTypes={adjustmentTypes} selectedAdjustmentType={selectedAdjustmentType} setSelectedAdjustmentType={setSelectedAdjustmentType} selectedCostedEvent={selectedCostedEvent} adjustmentNote={adjustmentNote} setAdjustmentNote={setAdjustmentNote} adjustmentAmount={adjustmentAmount} setAdjustmentAmount={setAdjustmentAmount} handleCreateAdjustmentRequest={handleCreateAdjustmentRequest} documentType={documentType} selectedAccount={selectedAccountBMinus} />
                      </div>
                  </div>

                  <PendingDocument pendingDocument={pendingDocument} adjustmentRequests={adjustmentRequests} fetchPendingDocumentAndRequests={fetchPendingDocumentAndRequests} deleteAdjustmentRequest={deleteAdjustmentRequest} updateDocumentStatus={updateDocumentStatus} />
                  
                </div>
            </div>
          </div>
      </div>
    </div>
    );

};
export default AdjustB;