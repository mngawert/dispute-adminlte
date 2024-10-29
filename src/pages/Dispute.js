import React, { useState, useEffect } from "react";
import api from "../api";

// import $ from 'jquery';
// import 'datatables.net-dt/css/dataTables.dataTables.css';
// import 'datatables.net';


export default function Dispute() {
  const [accountNum, setAccountNum] = useState("");
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [billsummary, setBillsummary] = useState([]);
  const [invoiceFeedData, setInvoiceFeedData] = useState([]);
  const [adjustmentTypes, setAdjustmentTypes] = useState([]);
  const [selectedAdjustmentType, setSelectedAdjustmentType] = useState('');
  const [amount, setAmount] = useState('');


  useEffect(() => {
    const fetchAdjustmentTypes = async () => {
      try {
        const response = await api.get('/api/AdjustmentType/GetAdjustmentTypes');
        setAdjustmentTypes(response.data);
      } catch (error) {
        console.error('Error fetching adjustment types', error);
      }
    };

    fetchAdjustmentTypes();
  }, []);


  // useEffect(() => {
  //   if (billsummary.length > 0) {
  //     $('#billSummaryTable').DataTable({
  //       destroy: true,
  //       lengthChange: false,
  //       searching: false
  //     });
  //   }
  // }, [billsummary]);

  const handleSearch = async () => {
    console.log("accountNum: ", accountNum);
    try {
      const response = await api.get(`/api/Account/GetAccountsByAccountNum?accountNum=${accountNum}`);
      setAccounts(response.data);

      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSelectAccount = async (account) => {
    setSelectedAccount(account);
    console.log("selectedAccount:", selectedAccount);
    try {
      const response = await api.get(`/api/BillSummary/GetBillSummaryByAccountNum?accountNum=${account.accountNum}`);
      setBillsummary(response.data);

    } catch (error) {
      console.error(error);      
    }
  };

  const handleSelectBill = async (bill) => {
    try {
      const response = await api.get(`/api/SAPInvoiceFeedData/GetSAPInvoiceFeedData`, {
        params: {
          accountNum: bill.accountNum,
          billSeq: bill.billSeq
        }
      });
      setInvoiceFeedData(response.data);
    } catch (error) {
      console.error(error);      
    }
  };

  const handleCreateDispute = async () => {
    try {
      const response = await api.post('/api/CreateDispute', {
        // accountNum: selectedTransaction.accountNum,
        // billSeq: selectedTransaction.billSeq,
        // amount: amount,
        // adjustmentType: selectedAdjustmentType,
      });
      console.log('Dispute created:', response.data);
      alert('Dispute created successfully!');
    } catch (error) {
      console.error('Error creating dispute', error);
      alert('Failed to create dispute.');
    }
  };

  return (

    <>
    <section className="content-header">
      <div className="container-fluid">
        <div className="row mb-2">
          <div className="col-sm-6">
            <h1>Dispute</h1>
          </div>
          <div className="col-sm-6">
            <ol className="breadcrumb float-sm-right">
              <li className="breadcrumb-item"><a href="#">Home</a></li>
              <li className="breadcrumb-item active">Dispute</li>
            </ol>
          </div>
        </div>
      </div>
    </section>
    <section class="content">
      <div class="container-fluid">
        <div class="row">
          <div class="col-12">
            <div className="invoice p-3 mb-3">
              <div className="row">
                <div className="col-12">
                  <p>1) Search Account Num</p>
                  <div className="xxx">
                    <div>
                      <input
                        type="text"
                        value={accountNum}
                        onChange={(e) => setAccountNum(e.target.value)}
                        placeholder="Enter account number"
                      />
                      <button onClick={handleSearch}>Search</button>
                    </div>
                  
                    <br />

                    <div>
                      <table className="table table-bordered table-striped">
                        <thead>
                          <tr>
                            <th>Account Num</th>
                            <th>Customer Ref</th>
                            <th>Bill Cycle</th>
                          </tr>
                        </thead>
                        <tbody>
                          {accounts.map((account, index) => (
                            <tr
                              key={index}
                              onClick={() => {
                                handleSelectAccount(account);
                              }}
                            >
                              <td>{account.accountNum}</td>
                              <td>{account.customerRef}</td>
                              <td>{account.billCycle}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      
                    </div>

                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>



        <div class="row">
          <div class="col-12">
            <div className="invoice p-3 mb-3">
              <div className="row">
                <div className="col-12">
                  <p>2) Select Invoice Num</p>
                  <div className="xxx">

                    { billsummary.length > 0 && (
                      <div style={{ maxHeight: '400px', overflowY: 'scroll' }}>
                      <table id="billSummaryTable" className="table table-bordered table-striped">
                      <thead>
                        <tr>
                          <th>AccountNum</th>
                          <th>BillSeq</th>
                          <th>BillAmount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {billsummary.map((bill, index) => (
                          <tr
                            key={index}
                            onClick={() => {
                              handleSelectBill(bill);
                            }}
                          >
                            <td>{bill.accountNum}</td>
                            <td>{bill.billSeq}</td>
                            <td>{bill.invoiceNetMny}</td>
                          </tr>
                        ))}
                      </tbody>
                      </table>
                      </div>
                    )}

                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>


        <div class="row">
          <div class="col-12">
            <div className="invoice p-3 mb-3">
              <div className="row">
                <div className="col-12">
                  <p>3) Select Charge (Invoice Feed Data)</p>
                  <div className="xxx">

                    {invoiceFeedData.length > 0 && (
                      <div>
                        <table className="table table-bordered table-striped">
                          <thead>
                            <tr>
                              <th>Charge Flag</th>
                              <th>Product Seq</th>
                              <th>AGG Amount</th>
                            </tr>
                          </thead>
                          <tbody>
                            {invoiceFeedData.map((invoice, idx) => (
                              <tr key={idx}>
                                <td>{invoice.chargeFlag}</td>
                                <td>{invoice.productSeq}</td>
                                <td>{invoice.aggAmount}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}

                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="row">
          <div class="col-12">
            <div className="invoice p-3 mb-3">
              <div className="row">
                <div className="col-12">
                  <p>4) Create Dispute</p>
                  <div className="xxx">

                  <div class="card card-secondary">
                    <div class="card-header">
                      <h3 class="card-title">Dispute</h3>
                    </div>

                    <form>
                      <div className="card-body">
                        <div className="form-group">
                          <label htmlFor="txtAccountNum">Account Num</label>
                          <input type="text" className="form-control" id="txtAccountNum" placeholder="Account Num" />
                        </div>
                        <div className="form-group">
                          <label htmlFor="txtBillSeq">Bill Seq</label>
                          <input type="text" className="form-control" id="txtBillSeq" placeholder="Bill Seq" />
                        </div>
                        <div className="form-group">
                          <label htmlFor="txtAmount">Amount</label>
                          <input type="text" className="form-control" id="txtAmount" placeholder="Amount" value={amount} onChange={(e) => setAmount(e.target.value) } />
                        </div>
                        <div className="form-group">
                          <label>Adjustment Type</label>
                          <select class="form-control" value={selectedAdjustmentType} onChange={(e) => setSelectedAdjustmentType(e.target.value)} >
                            <option value="">Select Adjustment Type</option>
                            {adjustmentTypes.map((adjType) => (
                            <option key={adjType.adjustmentTypeId} value={adjType.adjustmentTypeId}>
                              {adjType.adjustmentTypeName}
                            </option>
                          ))}
                          </select>
                        </div>
                      </div>
                      <div className="card-footer">
                        <button onClick={handleCreateDispute} className="btn btn-secondary">Create Dispute</button>
                      </div>
                    </form>
                  </div>



                    {/* <div>
                      <h3>Create Dispute</h3>
                      <div>
                        <label>Amount:</label>
                        <input
                          type="text"
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                        />
                      </div>
                      <div>
                        <label>Adjustment Type:</label>

                      </div>
                      <button onClick={handleCreateDispute}>Create Dispute</button>
                    </div> */}

                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>




      </div>
    </section>
  </>





  );
}
