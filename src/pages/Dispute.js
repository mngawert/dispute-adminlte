import React, { useState } from "react";
import api from "../api";

export default function Dispute() {
  const [accountNum, setAccountNum] = useState("");
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [billsummary, setBillsummary] = useState([]);
  const [invoiceFeedData, setInvoiceFeedData] = useState([]);

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
              <div>
              <table className="table table-bordered table-striped">
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


          </div>
        </div>
      </div>
    </div>
  );
}
