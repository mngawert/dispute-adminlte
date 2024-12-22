import { useEffect } from "react";
import AccountInfo from "../components/AccountInfo";
import Accounts from "../components/Accounts";
import Services from "../components/Services";
import ServiceSearch from "../components/ServiceSearch";
import { DOCUMENT_TYPE } from "../contexts/Constants";
import { useDocumentContext } from "../contexts/DocumentContext";
import PendingDocument from "../components/PendingDocument";
import MakeAdjustment from "../components/MakeAdjustment";


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
        createAdjustmentRequest,

        /** Document Submit */
        pendingDocument, adjustmentRequests, fetchPendingDocumentAndRequests, deleteAdjustmentRequest, updateDocumentStatus,

    } = useDocumentContext();

    const handleSelectAccount = (account) => {
        setSelectedAccount(account);
        getServicesByAccountNum(account.accountNum);
    }

    const handleCreateAdjustmentRequest = async () => {
        await createAdjustmentRequest(documentType);
        await fetchPendingDocumentAndRequests(documentType);
    }

    /** Fetch Pending Document */
    useEffect(() => {
        fetchPendingDocumentAndRequests(documentType);
    }, []);

    /** Fetch Adjustment Types */
    useEffect(() => {
        getAdjustmentTypes(documentType);
        
        console.log('Adjustment Types:', adjustmentTypes);
    }, []);
    

    return (
    <div className="content-wrapper-x">
    {/* Content Header (Page header) */}
    <div className="content-header">
        <div className="container-fluid">
        <div className="row mb-2">
            <div className="col-sm-6">
            <h1 className="m-0">{documentTypeName}</h1>
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


                        {/* <div className="col-sm-5">
                            <div className="row">
                                <div className="col-sm-6">

                                    <Accounts accounts={accounts} selectedAccount={selectedAccount} setSelectedAccount={setSelectedAccount} />

                                </div>
                                <div className="col-sm-6">
                                <div className="mb-2">
                                    <label>Service Numbers</label>
                                    <input type="text" className="form-control" defaultValue />
                                </div>
                                <div className="table-responsive" style={{height: 153, border: '1px solid #dee2e6'}}>
                                    <table className="table table-as-list text-nowrap table-hover">
                                    <tbody>
                                        <tr>
                                        <td>1232313123</td>
                                        </tr>
                                        <tr>
                                        <td>1232313123</td>
                                        </tr>
                                    </tbody>
                                    </table>
                                </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-sm-3">
                            <div className="form-group">
                                <label>Customer name</label>
                                <input type="text" className="form-control" defaultValue readOnly />
                            </div>
                            <div className="form-group">
                                <label>Account type</label>
                                <input type="text" className="form-control" defaultValue readOnly />
                            </div>
                        </div> */}


                    </div>
                </div>
            </div>
            <div className="card">
                <div className="card-body">
                <p className="mb-4"><b>Choose your desired adjustment properties</b></p>
                <div className="form-group d-flex " style={{columnGap: 40}}>
                    <div className="form-check">
                    <input className="form-check-input" type="checkbox" />
                    <label className="form-check-label">RC</label>
                    </div>
                    <div className="form-check">
                    <input className="form-check-input" type="checkbox" />
                    <label className="form-check-label">Usage</label>
                    </div>
                    <div className="form-check">
                    <input className="form-check-input" type="checkbox" />
                    <label className="form-check-label">NRC</label>
                    </div>
                    <div className="form-check">
                    <input className="form-check-input" type="checkbox" />
                    <label className="form-check-label">Recommended</label>
                    </div>
                    <div className="form-check">
                    <input className="form-check-input" type="checkbox" />
                    <label className="form-check-label">My Favorites</label>
                    </div>
                </div>
                </div>
            </div>
            
            <MakeAdjustment adjustmentTypes={adjustmentTypes} selectedAdjustmentType={selectedAdjustmentType} setSelectedAdjustmentType={setSelectedAdjustmentType}  adjustmentAmount={adjustmentAmount} setAdjustmentAmount={setAdjustmentAmount} handleCreateAdjustmentRequest={handleCreateAdjustmentRequest} documentType={documentType} />

            {/* <div className="card">
                <div className="card-body">
                <div className="row">
                    <div className="col-sm-3 form-group">
                    <label>Make adjustment type</label>
                    <select className="form-control">
                        <option>option 1</option>
                        <option>option 2</option>
                        <option>option 3</option>
                        <option>option 4</option>
                        <option>option 5</option>
                    </select>
                    </div>
                    <div className="col-sm-3 form-group">
                    <label>Amount</label>
                    <input type="text" className="form-control" />
                    <small>Thai Baht (excl VAT).</small>
                    </div>
                    <div className="col-sm-3 form-group">
                    <label>7% VAT</label>
                    <input type="text" className="form-control" readOnly />
                    </div>
                    <div className="col-sm-3 form-group">
                    <label>Total</label>
                    <input type="text" className="form-control" readOnly />
                    </div>
                </div>
                <div className="row">
                    <div className="col-sm-6 form-group">
                    <label>Note</label>
                    <textarea className="form-control" rows={3} defaultValue={""} />
                    </div>
                    <div className="col-sm-6 form-group d-flex" style={{alignItems: 'flex-end'}}>
                    <button type="submit" className="btn btn-primary">Submit</button>
                    </div>
                </div>
                </div>
            </div> */}

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
