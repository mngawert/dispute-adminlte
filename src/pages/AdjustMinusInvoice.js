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

const AdjustMinusInvoice = ({documentType=DOCUMENT_TYPE.ADJUST_MINUS, documentTypeName='Adjust -', adjustmentTypeNames=['P31','P32','P3 -']}) => {

    const { 
        /** Account */
        accountNum, setAccountNum, accounts, getAccountsByAccountNum, getAccountsByServiceNum, selectedAccount, setSelectedAccount,
        
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
        adjustmentTypes, setAdjustmentTypes, getAdjustmentTypesByProductCodeAndRevenueCode,getAdjustmentTypes,
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

    const handleCreateAdjustmentRequest = async () => {

        const validationError = validateInputsAdjustMinus(documentType);
        if(validationError) {
            alert(validationError);
            return;
        }

        await createAdjustmentRequest(documentType);
        await fetchPendingDocumentAndRequests(documentType);
    }

    /** Fetch Pending Document */
    useEffect(() => {
        fetchPendingDocumentAndRequests(documentType);
    }, []);


    return (
    <div className="content-wrapper-x">
    {/* Content Header (Page header) */}

    <ContentHeader title={documentTypeName} />

    {/* /.content-header */}
    {/* Main content */}
    <div className="content">
        <div className="container-fluid">
        <div className="row">
            <div className="col-12">
            {/* START CONTENT */}

                <AccountSearch accountNum={accountNum} setAccountNum={setAccountNum} accounts={accounts} getAccountsByAccountNum={getAccountsByAccountNum} getAccountsByServiceNum={getAccountsByServiceNum} selectedAccount={selectedAccount} setSelectedAccount={setSelectedAccount} />

                <div className="card">
                    <div className="card-body">
                        <InvoiceSearch accountNum={selectedAccount?.accountNum} invoices={invoices} getInvoicesByAccountNum={getInvoicesByAccountNum} selectedInvoice={selectedInvoice} handleSelectInvoice={handleSelectInvoice}  />                                            
                    </div>
                </div>

                <div className="row">
                    <div className="col-lg-3 d-flex flex-column">
                        <div className="card flex-grow-1">
                            <div className="card-body">
                                <InvoiceDataServices invoiceDataServices={invoiceDataServices} selectedInvoiceDataService={selectedInvoiceDataService} handleSelectInvoiceServices={handleSelectInvoiceServices} tableHeight={200} />
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-9 d-flex flex-column">
                        <div className="card flex-grow-1">
                            <div className="card-body">
                                <MakeAdjustment adjustmentTypes={adjustmentTypes} selectedAdjustmentType={selectedAdjustmentType} setSelectedAdjustmentType={setSelectedAdjustmentType} selectedCostedEvent={selectedCostedEvent} adjustmentNote={adjustmentNote} setAdjustmentNote={setAdjustmentNote} adjustmentAmount={adjustmentAmount} setAdjustmentAmount={setAdjustmentAmount} handleCreateAdjustmentRequest={handleCreateAdjustmentRequest} documentType={documentType} selectedAccount={selectedAccount} />
                            </div>
                        </div>
                    </div>
                </div>

                <PendingDocument pendingDocument={pendingDocument} adjustmentRequests={adjustmentRequests} fetchPendingDocumentAndRequests={fetchPendingDocumentAndRequests} deleteAdjustmentRequest={deleteAdjustmentRequest} updateDocumentStatus={updateDocumentStatus} />

            {/* END CONTENT */}
            </div>
        </div>
        {/* /.row */}
        </div>
        {/* /.container-fluid */}
    </div>
    {/* /.content */}
    </div>
    )
};

export default AdjustMinusInvoice;
