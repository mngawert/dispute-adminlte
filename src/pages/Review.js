import React, { useState } from 'react';
import api from '../api';


const Review = () => {

    const [accountNum, setAccountNum] = useState('');
    const [data, setData] = useState([]);
  
    const handleInputChange = (e) => {
        setAccountNum(e.target.value);
      };
    

      const handleSearch = async () => {
        try {
          const response = await api.get(`/api/Adjustment/GetAdjustmentRequestesByAccountNum`, {
            params: {
              accountNum: accountNum
            }
          });
          setData(response.data);
        } catch (error) {
          console.error('Error fetching data', error);
        }
      };


    return(
        <div className="content-wrapper-x">
        {/* Content Header (Page header) */}
        <div className="content-header">
            <div className="container-fluid">
            <div className="row mb-2">
                <div className="col-sm-6">
                <h1 className="m-0">Page Title</h1>
                </div>{/* /.col */}
                <div className="col-sm-6">
                <ol className="breadcrumb float-sm-right">
                    <li className="breadcrumb-item"><a href="#">Home</a></li>
                    <li className="breadcrumb-item active">Page Title</li>
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
                    <input type="text" className="form-control" placeholder="Account Number" onChange={handleInputChange} value={accountNum} />
                    <button type="button" className="btn btn-primary" onClick={handleSearch} >Search</button>
                    <button type="button" className="btn btn-default">Get more</button>
                    </p>
                </div>
                <div className="card card-primary card-tabs">
                    <div className="card-header p-0 pt-1">
                    <ul className="nav nav-tabs" id="custom-tabs-one-tab" role="tablist">
                        <li className="nav-item">
                        <a className="nav-link active" id="custom-tabs-one-adjustplus-tab" data-toggle="pill" href="#custom-tabs-one-adjustplus" role="tab" aria-controls="custom-tabs-one-adjustplus" aria-selected="true">Adjust +</a>
                        </li>
                        <li className="nav-item">
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
                        </li>
                    </ul>
                    </div>
                    <div className="card-body">
                    <div className="tab-content" id="custom-tabs-one-tabContent">
                        <div className="tab-pane fade show active" id="custom-tabs-one-adjustplus" role="tabpanel" aria-labelledby="custom-tabs-one-adjustplus-tab">
                        <p className="mb-4">Select Positive adjustments you wish to Accept action o or Reject:</p>
                        <div className="row">
                            <div className="col-sm-4 col-lg-3">
                            <label>Document Number</label>
                            <div className="table-responsive" style={{height: 400, border: '1px solid #dee2e6'}}>
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
                            <div className="col-sm-8 col-lg-9">
                            <div className="row">
                                <div className="col-sm-6">
                                <div className="form-group">
                                    <label>Document Number</label>
                                    <input type="text" className="form-control" defaultValue readOnly />
                                </div>
                                <div className="form-group">
                                    <label>Adjustment Location Code</label>
                                    <input type="text" className="form-control" defaultValue readOnly />
                                </div>
                                </div>
                                <div className="col-sm-6">
                                <div className="form-group">
                                    <label>Created By</label>
                                    <input type="text" className="form-control" defaultValue readOnly />
                                </div>
                                <div className="form-group">
                                    <label>Created On</label>
                                    <input type="text" className="form-control" defaultValue readOnly />
                                </div>
                                </div>
                            </div>
                            <div className="table-responsive" style={{height: 300}}>
                                <table className="table table-head-fixed text-nowrap table-bordered table-hover">
                                <thead>
                                    <tr>
                                    <th>Account Number</th>
                                    <th>Service Number</th>
                                    <th>Adjustment Name</th>
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
                                    </tr>
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
                                <button type="button" className="btn btn-primary">Accept Selected</button>
                                <button type="button" className="btn btn-default">Reject Selected</button>
                                </p>
                            </div>
                            </div>
                        </div>
                        </div>
                        <div className="tab-pane fade" id="custom-tabs-one-adjustminus" role="tabpanel" aria-labelledby="custom-tabs-one-adjustminus-tab">
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
                        </div>
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