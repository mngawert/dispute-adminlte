import CustomDualListBox from "../components/CustomDualListBox";


const User = () => {
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
            <div className="card-header border-0">
              <h3 className="card-title">User Details</h3>
            </div>
            <div className="card-body">
              <div className="row mb-4">
                <div className="col-sm-8">
                  <div className="row">
                    <div className="col-6">
                      <div className="form-group">
                        <label>TOT User ID</label>
                        <input type="text" className="form-control" defaultValue />
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-sm-6">
                      <div className="form-group">
                        <label>Name</label>
                        <input type="text" className="form-control" defaultValue />
                      </div>
                    </div>
                    <div className="col-sm-6">
                      <div className="form-group">
                        <label>Email</label>
                        <input type="Email" className="form-control" defaultValue />
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-sm-6">
                      <div className="form-group">
                        <label>Contact Number</label>
                        <input type="text" className="form-control" defaultValue />
                      </div>
                    </div>
                    <div className="col-sm-6">
                      <div className="form-group">
                        <label>Credit Limit</label>
                        <input type="text" className="form-control" defaultValue />
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-sm-6">
                      <div className="form-group">
                        <label>Password</label>
                        <input type="password" className="form-control" defaultValue />
                      </div>
                    </div>
                    <div className="col-sm-6">
                      <div className="form-group">
                        <label>Confirm Password</label>
                        <input type="password" className="form-control" defaultValue />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-sm-4">
                  <div className="form-group">
                    <label>Service Location Code</label>
                    <input type="text" className="form-control" defaultValue />
                  </div>
                  <div className="table-responsive" style={{height: 265, border: '1px solid #dee2e6'}}>
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
            <div className="card-header border-0">
              <h3 className="card-title">Roles</h3>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-sm-3">
                  <div className="form-check mb-2">
                    <input className="form-check-input" type="checkbox" />
                    <label className="form-check-label">Create Adjustment</label>
                  </div>
                  <div className="form-check mb-2">
                    <input className="form-check-input" type="checkbox" />
                    <label className="form-check-label">Review Adjustment</label>
                  </div>
                  <div className="form-check mb-2">
                    <input className="form-check-input" type="checkbox" />
                    <label className="form-check-label">Approve Adjustment</label>
                  </div>
                  <div className="form-check mb-2">
                    <input className="form-check-input" type="checkbox" />
                    <label className="form-check-label">Finance Review Adjustment</label>
                  </div>
                </div>
                <div className="col-sm-3">
                  <div className="form-check mb-2">
                    <input className="form-check-input" type="checkbox" />
                    <label className="form-check-label">Create MVNO Adjustment</label>
                  </div>
                  <div className="form-check mb-2">
                    <input className="form-check-input" type="checkbox" />
                    <label className="form-check-label">Review MVNO Adjustment</label>
                  </div>
                  <div className="form-check mb-2">
                    <input className="form-check-input" type="checkbox" />
                    <label className="form-check-label">Approve MVNO Adjustment</label>
                  </div>
                </div>
                <div className="col-sm-3">
                  <div className="form-check mb-2">
                    <input className="form-check-input" type="checkbox" />
                    <label className="form-check-label">CIUC Reader</label>
                  </div>
                  <div className="form-check mb-2">
                    <input className="form-check-input" type="checkbox" />
                    <label className="form-check-label">Meter Reader</label>
                  </div>
                  <div className="form-check mb-2">
                    <input className="form-check-input" type="checkbox" />
                    <label className="form-check-label">Generate Credit Note</label>
                  </div>
                  <div className="form-check mb-2">
                    <input className="form-check-input" type="checkbox" />
                    <label className="form-check-label">Search Credit Note</label>
                  </div>
                </div>
                <div className="col-sm-3">
                  <div className="form-check">
                    <input className="form-check-input" type="checkbox" />
                    <label className="form-check-label">Administrator</label>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="card">
            <div className="card-header border-0">
              <h3 className="card-title">Service Location Codes supported by User</h3>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-sm-6">
                  <div className="form-group">
                    <label>Service Location Codes this user</label>
                    <input type="text" className="form-control" defaultValue />
                  </div>
                </div>
              </div>
              <div className="form-group">
                <select className="duallistbox" multiple="multiple">
                  <option selected>Alabama</option>
                  <option>Alaska</option>
                  <option>California</option>
                  <option>Delaware</option>
                  <option>Tennessee</option>
                  <option>Texas</option>
                  <option>Washington</option>
                </select>
              </div>
            </div>
          </div>
          <div className="card">
            <div className="card-header border-0">
              <h3 className="card-title">Account Types supported by User</h3>
            </div>
            <div className="card-body">
              <div className="form-group mb-5">

                <CustomDualListBox />

                <select className="duallistbox" multiple="multiple">
                  <option selected>Alabama</option>
                  <option>Alaska</option>
                  <option>California</option>
                  <option>Delaware</option>
                  <option>Tennessee</option>
                  <option>Texas</option>
                  <option>Washington</option>
                </select>
              </div>
              <div className="text-center">
                <button type="submit" className="btn btn-primary">Create User</button>
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
          {/* /.card */}
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

export default User;
