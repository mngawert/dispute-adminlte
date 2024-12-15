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

/** ADJUST- */
const documentType =  DOCUMENT_TYPE.ADJUST_MINUS

const AdjustMinus = () => {

    /** Document Submit */
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
        adjustmentTypes, setAdjustmentTypes, getAdjustmentTypes,
        selectedAdjustmentType, setSelectedAdjustmentType,
        adjustmentAmount, setAdjustmentAmount,
        createAdjustmentRequest

    } = useDocumentContext();


    const handleSelectInvoice = (invoice) => { 
        setSelectedInvoice(invoice);
        getInvoiceDataServices(invoice);
    }

    const handleSelectInvoiceServices = (data) => {
        setSelectedInvoiceDataService(data);
        getInvoiceDataRC(data);
        getInvoiceDataUsage(data);
    }

    const handleSelectInvoiceRC = (data) => {
        setSelectedInvoiceDataUsage({});
        setSelectedInvoiceDataRC(data);
        getAdjustmentTypes(data);
        setAdjustmentAmount(data?.aggAmount);
    }

    const handleSelectInvoiceUsage = (data) => {
        setSelectedInvoiceDataRC({});
        setSelectedInvoiceDataUsage(data);
        getAdjustmentTypes(data);
        setAdjustmentAmount(data?.aggAmount);
    }

    const handleCreateAdjustmentRequest = async () => {
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
    <div className="content-header">
        <div className="container-fluid">
        <div className="row mb-2">
            <div className="col-sm-6">
            <h1 className="m-0">Adjust -</h1>
            </div>{/* /.col */}
            <div className="col-sm-6">
            <ol className="breadcrumb float-sm-right">
                <li className="breadcrumb-item active"> [ { JSON.parse(localStorage.getItem('userLogin'))?.username } ] </li>
            </ol>
            </div>{/* /.col */}
        </div>{/* /.row */}
        </div>{/* /.container-fluid */}
    </div>
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

                        <InvoiceSearch accountNum={selectedAccount.accountNum} invoices={invoices} getInvoicesByAccountNum={getInvoicesByAccountNum} selectedInvoice={selectedInvoice} handleSelectInvoice={handleSelectInvoice}  />
                                            
                        <hr className="mb-5" />

                        <div className="row mb-5">
                            <div className="col-lg-3">
                                <InvoiceDataServices invoiceDataServices={invoiceDataServices} selectedInvoiceDataService={selectedInvoiceDataService} handleSelectInvoiceServices={handleSelectInvoiceServices} />
                            </div>
                            <div className="col-lg-9">                                
                                <InvoiceDataRC invoiceDataRC={invoiceDataRC} selectedInvoiceDataRC={selectedInvoiceDataRC} handleSelectInvoiceRC={handleSelectInvoiceRC} />
                                <InvoiceDataUsage invoiceDataUsage={invoiceDataUsage} selectedInvoiceDataUsage={selectedInvoiceDataUsage} handleSelectInvoiceUsage={handleSelectInvoiceUsage} />
                            </div>
                        </div>

                        <hr className="mb-5" />
                        
                        {/* <DisputeEvent /> */}
                    
                    </div>
                </div>

                <MakeAdjustment adjustmentTypes={adjustmentTypes} selectedAdjustmentType={selectedAdjustmentType} setSelectedAdjustmentType={setSelectedAdjustmentType}  adjustmentAmount={adjustmentAmount} setAdjustmentAmount={setAdjustmentAmount} handleCreateAdjustmentRequest={handleCreateAdjustmentRequest} documentType={documentType} />

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

export default AdjustMinus;
