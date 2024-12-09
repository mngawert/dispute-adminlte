import React, { useState } from 'react';
import api from '../api';


const Review = ({reviewType, prevDocumentStatus}) => {

    console.log(reviewType);
    console.log(prevDocumentStatus);

    const [documentNum, setDocumentNum] = useState('');
    const [documents, setDocuments] = useState([]);
    const [selectedDocument, setSelectedDocument] = useState({});
    const [adjustmentRequests, setAdjustmentRequests] = useState([]);

    const handleInputChange = (e) => {
        setDocumentNum(e.target.value);
    };

    const getAllDocuments = async () => {
        try {
            const response = await api.get(`/api/Document/GetAllDocuments`, {
                params: {
                    documentStatus: prevDocumentStatus,
                    documentNum: documentNum,
                    onlyLocationOfUserId: JSON.parse(localStorage.getItem('userLogin'))?.userId
                }
            });
            setDocuments(response.data);
        } catch (error) {
            console.error('Error fetching data', error);
        }
    };

    const handleSearch = async () => {
        getAllDocuments();
    };   

    const handleSelectDocument = async (doc) => {
        setSelectedDocument(doc);

        try {
            const response = await api.get(`/api/Adjustment/GetAdjustmentRequests`, {
                params: {
                    documentNum: doc.documentNum
                }
            });
            console.log(response.data);
            setAdjustmentRequests(response.data);
        } catch (error) {
            console.error('Error fetching adjustment requests', error);
        }
    }

    const handleUpdateDocumentStatus = async (doc, _documentStatus) => {
        try {
            const response = await api.put(`/api/Document/UpdateDocument${reviewType}Status/${doc.documentNum}`, {
                documentNum: doc.documentNum,
                documentStatus: _documentStatus,
                updatedBy: JSON.parse(localStorage.getItem('userLogin'))?.userId
            });
            console.log(response.data);
            //setDocuments(documents.map(d => d.documentNum === doc.documentNum ? {...d, documentStatus: _documentStatus} : d));
            resetPage();
            getAllDocuments();
        } catch (error) {
            console.error('Error updating document status', error);
        }
    }

    const resetPage = () => {
        setDocumentNum('');
        setDocuments([]);
        setSelectedDocument({});
        setAdjustmentRequests([]);
      };

    return(
        <div className="content-wrapper-x">
        {/* Content Header (Page header) */}
        <div className="content-header">
            <div className="container-fluid">
            <div className="row mb-2">
                <div className="col-sm-6">
                <h1 className="m-0">{reviewType} Adjustments</h1>
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
                <div className="form-inline">
                    <p className="ml-auto flex-column text-right">
                    <input type="text" className="form-control mr-1" placeholder="Document Number" onChange={handleInputChange} value={documentNum} />
                    <button type="button" className="btn btn-primary mr-1" onClick={handleSearch} >Search</button>
                    <button type="button" className="btn btn-default">Get more</button>
                    </p>
                </div>
                <div className="card card-primary card-tabs">
                    <div className="card-header p-0 pt-1">
                    <ul className="nav nav-tabs" id="custom-tabs-one-tab" role="tablist">
                        <li className="nav-item">
                        <a className="nav-link active" id="custom-tabs-one-adjustplus-tab" data-toggle="pill" href="#custom-tabs-one-adjustplus" role="tab" aria-controls="custom-tabs-one-adjustplus" aria-selected="true">Adjust</a>
                        </li>
                        {/* <li className="nav-item">
                        <a className="nav-link" id="custom-tabs-one-adjustminus-tab" data-toggle="pill" href="#custom-tabs-one-adjustminus" role="tab" aria-controls="custom-tabs-one-adjustminus" aria-selected="false">Adjust -</a>
                        </li>
                        <li className="nav-item">
                        <a className="nav-link" id="custom-tabs-one-bplus-tab" data-toggle="pill" href="#custom-tabs-one-bplus" role="tab" aria-controls="custom-tabs-one-bplus" aria-selected="false">B +/-</a>
                        </li>
                        <li className="nav-item">
                        <a className="nav-link" id="custom-tabs-one-p3plus-tab" data-toggle="pill" href="#custom-tabs-one-p3plus" role="tab" aria-controls="custom-tabs-one-p3plus" aria-selected="false">P3 +</a>
                        </li>
                        <li className="nav-item">
                        <a className="nav-link" id="custom-tabs-one-p3minus-tab" data-toggle="pill" href="#custom-tabs-one-p3minus" role="tab" aria-controls="custom-tabs-one-p3minus" aria-selected="false">P3 -</a>
                        </li>
                        <li className="nav-item">
                        <a className="nav-link" id="custom-tabs-one-p31-tab" data-toggle="pill" href="#custom-tabs-one-p31" role="tab" aria-controls="custom-tabs-one-p31" aria-selected="false">P31</a>
                        </li>
                        <li className="nav-item">
                        <a className="nav-link" id="custom-tabs-one-p32-tab" data-toggle="pill" href="#custom-tabs-one-p32" role="tab" aria-controls="custom-tabs-one-p32" aria-selected="false">P32</a>
                        </li>
                        <li className="nav-item">
                        <a className="nav-link" id="custom-tabs-one-ct-tab" data-toggle="pill" href="#custom-tabs-one-ct" role="tab" aria-controls="custom-tabs-one-ct" aria-selected="false">CT</a>
                        </li>
                        <li className="nav-item">
                        <a className="nav-link" id="custom-tabs-one-dt-tab" data-toggle="pill" href="#custom-tabs-one-dt" role="tab" aria-controls="custom-tabs-one-dt" aria-selected="false">DT</a>
                        </li> */}
                    </ul>
                    </div>
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
                                        {documents.map((doc, index) => (
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
                                                <td align='center'>{(adj.disputeMny*0.07).toFixed(2)}</td>
                                                <td align='center'>{(adj.disputeMny*1.07).toFixed(2)}</td>
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
                        {/* <div className="tab-pane fade" id="custom-tabs-one-adjustminus" role="tabpanel" aria-labelledby="custom-tabs-one-adjustminus-tab">
                        Adjust -
                        </div>
                        <div className="tab-pane fade" id="custom-tabs-one-bplus" role="tabpanel" aria-labelledby="custom-tabs-one-bplus-tab">
                        B+
                        </div>
                        <div className="tab-pane fade" id="custom-tabs-one-p3plus" role="tabpanel" aria-labelledby="custom-tabs-one-p3plus-tab">
                        P3+
                        </div>
                        <div className="tab-pane fade" id="custom-tabs-one-p3minus" role="tabpanel" aria-labelledby="custom-tabs-one-p3minus-tab">
                        P3-
                        </div>
                        <div className="tab-pane fade" id="custom-tabs-one-p31" role="tabpanel" aria-labelledby="custom-tabs-one-p31-tab">
                        P31
                        </div>
                        <div className="tab-pane fade" id="custom-tabs-one-p32" role="tabpanel" aria-labelledby="custom-tabs-one-p32-tab">
                        P32
                        </div>
                        <div className="tab-pane fade" id="custom-tabs-one-ct" role="tabpanel" aria-labelledby="custom-tabs-one-ct-tab">
                        CT
                        </div>
                        <div className="tab-pane fade" id="custom-tabs-one-dt" role="tabpanel" aria-labelledby="custom-tabs-one-dt-tab">
                        DT
                        </div> */}
                    </div>
                    </div>
                    {/* /.card */}
                </div>
                {/* END CONTENT */}
                </div>
            </div>
            {/* /.row */}
            </div>
            {/* /.container-fluid */}
        </div>
        {/* /.content */}
        </div>
    );

};

export default Review;