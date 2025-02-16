
import { CPS_MAP_HASH } from '../contexts/Constants';

const ReviewDocType = ({documentTypeDesc, documents, adjustmentRequests, selectedDocument, reviewType, handleSelectDocument, handleUpdateDocumentStatus }) => {

    const filterDocumentsByType = (type) => {
        return documents.filter(doc => doc.documentTypeDesc === type);
    };
    
  return (

    <div className="card">
        <div className="card-body">
            <div className="tab-content" id="custom-tabs-one-tabContent">
                <div className="tab-pane fade show active" id="custom-tabs-one-adjustplus" role="tabpanel" aria-labelledby="custom-tabs-one-adjustplus-tab">
                    <p className="mb-4">Select adjustments you wish to Accept action o or Reject:</p>
                    
                    
                    <div className="row">
                        <div className="col-sm-4 col-lg-3">
                        <label>Document Number</label>
                        <div className="table-responsive" style={{height: 400, border: '1px solid #dee2e6'}}>
                            <table className="table table-as-list text-nowrap table-hover">
                            <tbody>
                                {filterDocumentsByType(documentTypeDesc).map((doc, index) => (
                                    <tr key={index} onClick={ () => {handleSelectDocument(doc)} } className={ selectedDocument?.documentNum === doc.documentNum ? 'selected': '' } >
                                        <td>{doc.documentNum}</td>
                                    </tr>
                                ))}
                            </tbody>
                            </table>
                        </div>
                        </div>
                        <div className="col-sm-8 col-lg-9">
                        <div className="row">
                            <div className="col-sm-6">
                            <div className="form-group">
                                <label>Document Number</label>
                                <input type="text" className="form-control" readOnly value={selectedDocument?.documentNum ?? ''} />
                            </div>
                            <div className="form-group">
                                <label>Adjustment Location Code</label>
                                <input type="text" className="form-control" readOnly value={selectedDocument?.homeLocationCode ?? ''} />
                            </div>
                            </div>
                            <div className="col-sm-6">
                            <div className="form-group">
                                <label>Created By</label>
                                <input type="text" className="form-control" readOnly value={selectedDocument?.createdByName ?? ''} />
                            </div>
                            <div className="form-group">
                                <label>Created On</label>
                                <input type="text" className="form-control" readOnly value={selectedDocument?.createdDtm ?? ''} />
                            </div>
                            </div>
                        </div>
                        <div className="table-responsive" style={{height: 300}}>
                            <table className="table table-head-fixed text-nowrap table-bordered table-hover">
                            <thead>
                                <tr>
                                <th>Account Number</th>
                                <th>Service Number</th>
                                <th>Adjustment Type</th>
                                <th>Amount</th>
                                <th>VAT</th>
                                <th>Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {adjustmentRequests.map((adj, index) => (
                                    <tr key={index}>
                                        <td>{adj.accountNum}</td>
                                        <td>{adj.serviceNum}</td>
                                        <td>{adj.adjustmentTypeName}</td>
                                        <td align='center'>{adj.disputeMny.toFixed(2)}</td>
                                        <td align='center'>{(adj.disputeMny * (  CPS_MAP_HASH[adj.cpsId]/100)).toFixed(2)}</td>
                                        <td align='center'>{(adj.disputeMny * (1+CPS_MAP_HASH[adj.cpsId]/100)).toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                            </table>
                        </div>
                        </div>
                    </div>
                                                
                    <div className="row">
                        <div className="col-sm-6">
                        <div className="form-group">
                            <label>Note</label>
                            <textarea className="form-control" rows={5} readOnly defaultValue={""} />
                        </div>
                        </div>
                        <div className="col-sm-6">
                        <div className="form-group">
                            <label>My Note</label>
                            <textarea className="form-control" rows={5} defaultValue={""} />
                        </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12">
                        <div className="form-inline mt-4">
                            <p className="ml-auto mr-auto flex-column">
                            <button type="button" className="btn btn-primary mr-1" onClick={() => { handleUpdateDocumentStatus(selectedDocument, `${reviewType}-Accept`) }} >Accept Selected</button>
                            <button type="button" className="btn btn-default" onClick={() => { handleUpdateDocumentStatus(selectedDocument, `${reviewType}-Reject`) }} >Reject Selected</button>
                            </p>
                        </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

  );
};

export default ReviewDocType;
