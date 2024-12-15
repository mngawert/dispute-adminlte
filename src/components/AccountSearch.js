

const AccountSearch = ({ accountNum, setAccountNum, accounts, getAccountsByAccountNum, getAccountsByServiceNum, selectedAccount, setSelectedAccount }) => {
  return (
    <div className="card">
        <div className="card-body">
        <div className="row">
            <div className="col-sm-4">
                <div className="form-group">
                    <label>Search for service number:</label>
                    <input type="text" className="form-control" placeholder="" value={accountNum} onChange={(e) => setAccountNum(e.target.value)} />
                </div>
                <div className="form-group">
                    <button type="submit" className="btn btn-default mr-1" onClick={() => getAccountsByServiceNum(accountNum)} >Service Num</button>
                    <button type="submit" className="btn btn-default" onClick={() => getAccountsByAccountNum(accountNum)} >Account Num</button>
                </div>
            </div>
            <div className="col-sm-4">
                <div className="form-group">
                    <label>Accounts</label>
                    <div className="table-responsive" style={{height: 200, border: '1px solid #dee2e6'}}>
                    <table className="table table-as-list text-nowrap table-hover">
                        <tbody>
                        {accounts.map((account, index) => (
                            <tr key={index} onClick={() => setSelectedAccount(account)} className={selectedAccount?.accountNum == account.accountNum ? 'selected' : ''} >
                                <td>{account.accountNum}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                    </div>
                </div>
            </div>
            <div className="col-sm-4">
                <div className="form-group">
                    <label>Customer name</label>
                    <input type="text" className="form-control" value={selectedAccount?.legalName} readOnly />
                </div>
                <div className="form-group">
                    <label>Account type</label>
                    <input type="text" className="form-control" value={selectedAccount?.billCycle} readOnly />
                </div>
            </div>
        </div>
        </div>
    </div>
);
}

export default AccountSearch;
