import React from 'react';

const SearchAccount = ({ accountNum, setAccountNum, handleSearch, accounts, handleSelectAccount, selectedAccount }) => {
  return (
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
              <tr key={index} onClick={() => handleSelectAccount(account)} className={selectedAccount?.accountNum === account.accountNum ? 'selected' : ''}>
                <td>{account.accountNum}</td>
                <td>{account.customerRef}</td>
                <td>{account.billCycle}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SearchAccount;