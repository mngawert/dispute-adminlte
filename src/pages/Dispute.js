import React, { useState } from "react";
import api from "../api";

export default function Dispute() {
  const [accountNum, setAccountNum] = useState("");
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(null);

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

  const handleSelect = (account) => {
    setSelectedAccount(account);

    console.log("selectedAccount:", selectedAccount);
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
                        handleSelect(account);
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
          </div>
        </div>
      </div>
    </div>
  );
}
