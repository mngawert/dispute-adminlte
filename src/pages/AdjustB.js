import React from 'react';
import { DOCUMENT_TYPE } from '../contexts/Constants';


const AdjustB = ({documentType=DOCUMENT_TYPE.B, documentTypeName='B +/-'}) => {


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
                  <li className="breadcrumb-item active"> {`[ ${JSON.parse(localStorage.getItem('userLogin'))?.username} ] [ ${JSON.parse(localStorage.getItem('userLogin'))?.homeLocationCode} ]`} </li>
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
                      <div className="row mb-4">
                        <div className="col-sm-3">
                          <div className="mb-3">
                            <label>Search for service number for B-:</label>
                            <input type="text" className="form-control" placeholder />
                          </div>
                          <div className>
                            <div className="form-inline">
                              <p className="d-flex flex-row" style={{gap: 5}}>
                                <button type="submit" className="btn btn-default">Service Num</button>
                                <button type="submit" className="btn btn-default">Account Num</button>
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="col-sm-3">
                          <div className="mb-3">
                            <label>Customer name</label>
                            <input type="text" className="form-control" defaultValue readOnly />
                          </div>
                          <div>
                            <label>Account type</label>
                            <input type="text" className="form-control" defaultValue readOnly />
                          </div>
                        </div>
                        <div className="col-sm-3">
                          <label>Accounts</label>
                          <div className="table-responsive" style={{height: 125, border: '1px solid #dee2e6'}}>
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
                        <div className="col-sm-3 d-flex align-items-end">
                          <button type="button" className="btn btn-default">Get details for Account</button>
                        </div>
                      </div>
                      <div className="row mb-4">
                        <div className="col-md-9">
                          <div className="table-responsive" style={{height: 200}}>
                            <table className="table table-head-fixed text-nowrap table-bordered table-hover">
                              <thead>
                                <tr>
                                  <th>Bill</th>
                                  <th>Invoice Number</th>
                                  <th>Bill Month</th>
                                  <th>Actual Bill</th>
                                  <th>Convergent Amount</th>
                                  <th>Invoice Amount</th>
                                  <th>VAT Amount</th>
                                  <th>Adjusted</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr>
                                  <td />
                                  <td />
                                  <td />
                                  <td />
                                  <td />
                                  <td />
                                  <td />
                                  <td />
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                        <div className="col-md-3">
                          <label>Service Numbers</label>
                          <input type="text" className="form-control mb-2" />
                          <div className="table-responsive" style={{height: 135, border: '1px solid #dee2e6'}}>
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
                      <div className="text-center">
                        <button type="button" className="btn btn-default">View invoice's pending adjustments</button>
                      </div>
                    </div>
                  </div>
                  <div className="card">
                    <div className="card-body">
                      <div className="row mb-4">
                        <div className="col-sm-3">
                          <div className="mb-3">
                            <label>Search for service number for B+:</label>
                            <input type="text" className="form-control" placeholder />
                          </div>
                          <div className>
                            <div className="form-inline">
                              <p className="d-flex flex-row" style={{gap: 5}}>
                                <button type="submit" className="btn btn-default">Service Num</button>
                                <button type="submit" className="btn btn-default">Account Num</button>
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="col-sm-3">
                          <div className="mb-3">
                            <label>Customer name</label>
                            <input type="text" className="form-control" defaultValue readOnly />
                          </div>
                          <div>
                            <label>Account type</label>
                            <input type="text" className="form-control" defaultValue readOnly />
                          </div>
                        </div>
                        <div className="col-sm-3">
                          <label>Accounts</label>
                          <div className="table-responsive" style={{height: 125, border: '1px solid #dee2e6'}}>
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
                        <div className="col-sm-3">
                          <label>Service Numbers</label>
                          <div className="table-responsive" style={{height: 125, border: '1px solid #dee2e6'}}>
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
                  </div>
                  <div className="card">
                    <div className="card-body">
                      <p>Make B+/- adjustment</p>
                      <div className="row">
                        <div className="col-sm-6">
                          <div className="row">
                            <div className="col-sm-4">
                              <label>Amount</label>
                              <input type="text" className="form-control" readOnly />
                              <small>Thai Baht (excl VAT.)</small>
                            </div>
                            <div className="col-sm-4">
                              <label>7% VAT</label>
                              <input type="text" className="form-control" readOnly />
                            </div>
                            <div className="col-sm-4">
                              <label>Total</label>
                              <input type="text" className="form-control" readOnly />
                            </div>
                          </div>
                        </div>
                        <div className="col-sm-6">
                          <div className="row">
                            <div className="col-sm-6">
                              <label>Note</label>
                              <textarea className="form-control" rows={3} defaultValue={""} />
                            </div>
                            <div className="col-sm-6 d-flex align-items-end">
                              <button type="submit" className="btn btn-primary">Submit</button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="card">
                    <div className="card-header border-0">
                      <h3 className="card-title">Document Sequence</h3>
                    </div>
                    <div className="card-body">
                      <div className="row">
                        <div className="form-group col-sm-4">
                          <strong>Adjustment type:</strong> Adjustment -
                        </div>
                        <div className="form-group col-sm-4">
                          <strong>Current sequence:</strong> 2024860204042
                        </div>
                        <div className="form-group col-sm-4">
                          <div className="form-inline">
                            <p className="ml-auto d-flex flex-row text-right" style={{gap: 5}}>
                              <button type="submit" className="btn btn-default">Remove Adjustment</button>
                              <button type="submit" className="btn btn-default">Submit document</button>
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="table-responsive" style={{height: 300}}>
                        <table className="table table-head-fixed text-nowrap table-bordered table-hover">
                          <thead>
                            <tr>
                              <th>Adjustment Type</th>
                              <th>Account Number</th>
                              <th>Invoice Number</th>
                              <th>Service Number</th>
                              <th>Amount</th>
                              <th>VAT</th>
                              <th>Total</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td />
                              <td />
                              <td />
                              <td />
                              <td />
                              <td />
                              <td />
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
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
export default AdjustB;