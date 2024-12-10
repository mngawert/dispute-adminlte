

const AdjustMinus = () => {
    return (
    <div className="content-wrapper-x">
    {/* Content Header (Page header) */}
    <div className="content-header">
        <div className="container-fluid">
        <div className="row mb-2">
            <div className="col-sm-6">
            <h1 className="m-0">Adjust +</h1>
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
                        <div className="form-group">
                            <label>Search for service number:</label>
                            <input type="text" className="form-control" placeholder="" />
                        </div>
                        <div className="form-group">
                            <button type="submit" className="btn btn-default">Service Num</button>
                            <button type="submit" className="btn btn-default">Account Num</button>
                        </div>
                        </div>
                        <div className="col-sm-4">
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
                        <div className="col-sm-4">
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
                    <div className="d-flex">
                        <p className="d-flex flex-column">
                        <button type="button" className="btn btn-default">Get details for Account</button>
                        </p>
                        <p className="ml-auto d-flex flex-column text-right">
                        <button type="button" className="btn btn-default">View invoice's pending adjustments</button>
                        </p>
                    </div>
                    <div className="row mb-5">
                        <div className="col-12">
                        <div className="table-responsive" style={{height: 300}}>
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
                    </div>
                    <hr className="mb-5" />
                    <div className="row mb-5">
                        <div className="col-lg-3">
                        <label>Service Number</label>
                        <div className="table-responsive" style={{height: 500, border: '1px solid #dee2e6'}}>
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
                        <div className="col-lg-9">
                        <div className="form-group">
                            <label>RC</label>
                            <div className="table-responsive" style={{height: 200}}>
                            <table className="table table-head-fixed text-nowrap table-bordered table-hover">
                                <thead>
                                <tr>
                                    <th>Service number</th>
                                    <th>Product name</th>
                                    <th>Price plan</th>
                                    <th>Amount</th>
                                    <th>Costed</th>
                                    <th>Discount</th>
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
                        <div className="form-group">
                            <label>Usage</label>
                            <div className="table-responsive" style={{height: 200}}>
                            <table className="table table-head-fixed text-nowrap table-bordered table-hover">
                                <thead>
                                <tr>
                                    <th>Service number</th>
                                    <th>Product name</th>
                                    <th>Call Type</th>
                                    <th>Amount</th>
                                    <th>Costed</th>
                                    <th>Discount</th>
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
                    </div>
                    <hr className="mb-5" />
                    <div className="row mb-3">
                        <div className="form-group col-sm-2">
                        <label>From date:</label>
                        </div>
                        <div className="form-group col-sm-3">
                        <div className="input-group date" id="adjust-minus-from-date" data-target-input="nearest">
                            <input type="text" className="form-control datetimepicker-input" data-target="#adjust-minus-from-date" />
                            <div className="input-group-append" data-target="#adjust-minus-from-date" data-toggle="datetimepicker">
                            <div className="input-group-text"><i className="fa fa-calendar" /></div>
                            </div>
                        </div>
                        </div>
                        <div className="form-group col-sm-2 text-right">
                        <label>To date:</label>
                        </div>
                        <div className="form-group col-sm-3">
                        <div className="input-group date" id="adjust-minus-to-date" data-target-input="nearest">
                            <input type="text" className="form-control datetimepicker-input" data-target="#adjust-minus-to-date" />
                            <div className="input-group-append" data-target="#adjust-minus-to-date" data-toggle="datetimepicker">
                            <div className="input-group-text"><i className="fa fa-calendar" /></div>
                            </div>
                        </div>
                        </div>
                        <div className="form-group col-sm-2">
                        <button type="submit" className="btn btn-default">Get events</button>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12">
                        <div className="form-group">
                            <div className="form-check">
                            <input className="form-check-input" type="checkbox" />
                            <label className="form-check-label">Select all events</label>
                            </div>
                        </div>
                        <div className="table-responsive" style={{height: 300}}>
                            <table className="table table-head-fixed text-nowrap table-bordered table-hover">
                            <thead>
                                <tr>
                                <th>Adju</th>
                                <th>Adjust amount</th>
                                <th>To number</th>
                                <th>Call type</th>
                                <th>Call date</th>
                                <th>Duration (sec)</th>
                                <th>Amount</th>
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
                        <button type="submit" className="btn btn-default">Submit</button>
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

export default AdjustMinus;
