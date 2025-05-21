import { useEffect, useState } from "react";
import AccountInfo from "../components/AccountInfo";
import Accounts from "../components/Accounts";
import Services from "../components/Services";
import ServiceSearch from "../components/ServiceSearch";
import { DOCUMENT_TYPE } from "../contexts/Constants";
import { useDocumentContext } from "../contexts/DocumentContext";
import PendingDocument from "../components/PendingDocument";
import MakeAdjustment from "../components/MakeAdjustment";
import AdjustmentTypeNamesFilter from "../components/AdjustmentTypeNamesFilter";
import { get } from "jquery";
import ContentHeader from "../components/ContentHeader";


const AdjustPlus = ({documentType=DOCUMENT_TYPE.ADJUST_PLUS, documentTypeName='Adjust +'}) => {

    const { 
        /** Account */
        accountNum, setAccountNum, accounts, getAccountsByAccountNum, getAccountsByServiceNum, selectedAccount, setSelectedAccount,
        
        /** Service */
        serviceNum, setServiceNum, services, setServices, getServicesByAccountNum, selectedService, setSelectedService,

        /** Adjustment */
        adjustmentTypes, setAdjustmentTypes, getAdjustmentTypes,
        selectedAdjustmentType, setSelectedAdjustmentType,
        adjustmentAmount, setAdjustmentAmount,
        adjustmentNote, setAdjustmentNote,

        /** Validation */
        validateInputsAdjustMinus, validateInputsAdjustPlus,

        /** Create Adjustment Request */
        createAdjustmentRequest,

        /** Document Submit */
        pendingDocument, adjustmentRequests, fetchPendingDocumentAndRequests, deleteAdjustmentRequest, updateDocumentStatus,

    } = useDocumentContext();

    const initialAdjustmentTypeNames = ['RC', 'USG', 'NRC'];
    const [adjustmentTypeNames, setAdjustmentTypeNames] = useState(initialAdjustmentTypeNames);

    const handleSelectAccount = (account) => {
        setSelectedAccount(account);
        getServicesByAccountNum(account.accountNum);

        /** Fetch Adjustment types */
        getAdjustmentTypes(adjustmentTypeNames);
    }

    const handleCreateAdjustmentRequest = async () => {

        const validationError = validateInputsAdjustPlus(documentType);
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

    /** Fetch Adjustment Types */
    useEffect(() => {
        getAdjustmentTypes(adjustmentTypeNames);
    }, [adjustmentTypeNames]);

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
            <div className="card">
                <div className="card-body">
                    <div className="row">
                        <div className="col-sm-4">
                            <ServiceSearch accountNum={accountNum} setAccountNum={setAccountNum} getAccountsByAccountNum={getAccountsByAccountNum} getAccountsByServiceNum={getAccountsByServiceNum} />
                        </div>

                        <div className="col-sm-2">
                            <Accounts accounts={accounts} selectedAccount={selectedAccount} setSelectedAccount={handleSelectAccount} />
                        </div>
                        <div className="col-sm-2">
                            <Services services={services} selectedService={selectedService} setSelectedService={setSelectedService} />
                        </div>
                        <div className="col-sm-4">
                            <AccountInfo selectedAccount={selectedAccount} />
                        </div>

                    </div>
                </div>
            </div>
            
            <AdjustmentTypeNamesFilter initialAdjustmentTypeNames={initialAdjustmentTypeNames} adjustmentTypeNames={adjustmentTypeNames} setAdjustmentTypeNames={setAdjustmentTypeNames} getAdjustmentTypes={getAdjustmentTypes} />

            <div className="card">
                <div className="card-body">
                    <MakeAdjustment adjustmentTypes={adjustmentTypes} selectedAdjustmentType={selectedAdjustmentType} setSelectedAdjustmentType={setSelectedAdjustmentType} adjustmentNote={adjustmentNote} setAdjustmentNote={setAdjustmentNote}  adjustmentAmount={adjustmentAmount} setAdjustmentAmount={setAdjustmentAmount} handleCreateAdjustmentRequest={handleCreateAdjustmentRequest} documentType={documentType} />
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

export default AdjustPlus;
