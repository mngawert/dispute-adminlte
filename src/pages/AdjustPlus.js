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
import ContentHeader from "../components/ContentHeader";

const AdjustPlus = ({
    documentType = DOCUMENT_TYPE.ADJUST_PLUS,
    documentTypeName = 'Adjust +',
    initialAdjustmentTypeNames = ['RC', 'USG', 'NRC'],
    showAdjustmentTypeNamesFilter = true
}) => {
    // Get required state and functions from DocumentContext
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

    // State for adjustment type names and filtering
    const [adjustmentTypeNames, setAdjustmentTypeNames] = useState(initialAdjustmentTypeNames);
    const [adjustmentTypeFilter, setAdjustmentTypeFilter] = useState('');
    const [filteredAdjustmentTypes, setFilteredAdjustmentTypes] = useState([]);

    // Filter adjustment types based on search text
    useEffect(() => {
        if (!adjustmentTypes) {
            setFilteredAdjustmentTypes([]);
            return;
        }
        
        if (adjustmentTypeFilter.trim() === '') {
            setFilteredAdjustmentTypes(adjustmentTypes);
        } else {
            const filtered = adjustmentTypes.filter(type => 
                type.adjustmentTypeName.toLowerCase().includes(adjustmentTypeFilter.toLowerCase())
            );
            setFilteredAdjustmentTypes(filtered);
        }
    }, [adjustmentTypeFilter, adjustmentTypes]);

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
        <ContentHeader title={documentTypeName} />
        
        <div className="content">
            <div className="container-fluid">
                <div className="row">
                    <div className="col-12">
                        {/* Account and Service Selection Card */}
                        <div className="card">
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-sm-4">
                                        <ServiceSearch 
                                            accountNum={accountNum} 
                                            setAccountNum={setAccountNum} 
                                            getAccountsByAccountNum={getAccountsByAccountNum} 
                                            getAccountsByServiceNum={getAccountsByServiceNum} 
                                        />
                                    </div>
                                    <div className="col-sm-2">
                                        <Accounts 
                                            accounts={accounts} 
                                            selectedAccount={selectedAccount} 
                                            setSelectedAccount={handleSelectAccount} 
                                        />
                                    </div>
                                    <div className="col-sm-2">
                                        <Services 
                                            services={services} 
                                            selectedService={selectedService} 
                                            setSelectedService={setSelectedService} 
                                        />
                                    </div>
                                    <div className="col-sm-4">
                                        <AccountInfo selectedAccount={selectedAccount} />
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        {/* Adjustment Type Names Filter and Text Filter in same row */}
                        {showAdjustmentTypeNamesFilter && (
                            <div className="card">
                                <div className="card-body">
                                    <div className="row">
                                        <div className="col-md-6">
                                            {/* Keep the existing AdjustmentTypeNamesFilter component */}
                                            <AdjustmentTypeNamesFilter 
                                                initialAdjustmentTypeNames={initialAdjustmentTypeNames} 
                                                adjustmentTypeNames={adjustmentTypeNames} 
                                                setAdjustmentTypeNames={setAdjustmentTypeNames} 
                                                getAdjustmentTypes={getAdjustmentTypes} 
                                            />
                                        </div>
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label>Filter Adjustment Types</label>
                                                <div className="input-group">
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        placeholder="Type to filter adjustment types..."
                                                        value={adjustmentTypeFilter}
                                                        onChange={(e) => setAdjustmentTypeFilter(e.target.value)}
                                                    />
                                                    {adjustmentTypeFilter && (
                                                        <div className="input-group-append">
                                                            <button 
                                                                className="btn btn-outline-secondary" 
                                                                type="button"
                                                                onClick={() => setAdjustmentTypeFilter('')}
                                                                title="Clear filter"
                                                            >
                                                                <i className="fa fa-times"></i>
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                                {/* <small className="form-text text-muted">
                                                    {filteredAdjustmentTypes.length} of {adjustmentTypes?.length || 0} adjustment types shown
                                                </small> */}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Make Adjustment Card */}
                        <div className="card">
                            <div className="card-body">
                                <MakeAdjustment 
                                    adjustmentTypes={filteredAdjustmentTypes} 
                                    selectedAdjustmentType={selectedAdjustmentType} 
                                    setSelectedAdjustmentType={setSelectedAdjustmentType} 
                                    adjustmentNote={adjustmentNote} 
                                    setAdjustmentNote={setAdjustmentNote}  
                                    adjustmentAmount={adjustmentAmount} 
                                    setAdjustmentAmount={setAdjustmentAmount} 
                                    handleCreateAdjustmentRequest={handleCreateAdjustmentRequest} 
                                    documentType={documentType} 
                                    selectedAccount={selectedAccount}  
                                />
                            </div>
                        </div>

                        {/* Pending Document Section */}
                        <PendingDocument 
                            pendingDocument={pendingDocument} 
                            adjustmentRequests={adjustmentRequests} 
                            fetchPendingDocumentAndRequests={fetchPendingDocumentAndRequests} 
                            deleteAdjustmentRequest={deleteAdjustmentRequest} 
                            updateDocumentStatus={updateDocumentStatus} 
                        />
                    </div>
                </div>
            </div>
        </div>
    </div>
    );
};

export default AdjustPlus;
