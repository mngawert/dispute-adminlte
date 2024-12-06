

const AdjustPlus = () => {
    return (
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
            <div className="card">
                <div className="card-body">
                <div className="row">
                    <div className="col-sm-4">
                    <div className="form-group">
                        <label>Search for:</label>
                        <input type="text" className="form-control" placeholder />
                    </div>
                    <div className="form-group">
                        <button type="submit" className="btn btn-default">Service Num</button>
                        <button type="submit" className="btn btn-default">Account Num</button>
                    </div>
                    </div>
                    <div className="col-sm-5">
                    <div className="row">
                        <div className="col-sm-6">
                        <div className="form-group">
                            <label>Accounts</label>
                            <div className="table-responsive" style={{height: 200, border: '1px solid #dee2e6'}}>
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
                    </div>
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
            <div className="card">
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
                    <button type="submit" className="btn btn-default">Remove Adjustment</button>
                    <button type="submit" className="btn btn-default">Submit document</button>
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
    )
};

export default AdjustPlus;
