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
    <div className="row">
      <div className="col-12">
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Dispute</h3>
          </div>
          <div className="card-body">
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
                    <th>ID</th>
                    <th>Date</th>
                    <th>Amount</th>
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

              <br />

              {selectedAccount && (
                <div>
                  {" "}
                  <h3>Account Details</h3>
                  <p>
                    <strong>accountNum:</strong> {selectedAccount.accountNum}
                  </p>
                  <p>
                    <strong>customerRef:</strong> {selectedAccount.customerRef}
                  </p>
                  <p>
                    <strong>billCycle:</strong> {selectedAccount.billCycle}
                  </p>
                </div>
              )}
            </div>

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


      {invoiceFeedData.length > 0 && (
        <div>
          <h3>Invoice Feed Data</h3>
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




          <div>
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
              <select
                value={selectedAdjustmentType}
                onChange={(e) => setSelectedAdjustmentType(e.target.value)}
              >
                <option value="">Select Adjustment Type</option>
                {adjustmentTypes.map((adjType) => (
                  <option key={adjType.adjustmentTypeId} value={adjType.adjustmentTypeId}>
                    {adjType.adjustmentTypeName}
                  </option>
                ))}
              </select>
            </div>
            <button onClick={handleCreateDispute}>Create Dispute</button>
          </div>


          </div>
        </div>
      </div>
    </div>
  );
}
