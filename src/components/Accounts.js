
const Accounts = ({accounts, selectedAccount, setSelectedAccount}) => {
  return (
    <>
        <div className="form-group">
            <label>Accounts</label>
            <div className="table-responsive" style={{minHeight: 120, border: '1px solid #dee2e6'}}>
            <table className="table table-as-list text-nowrap table-hover">
                <tbody>
                {accounts.map((account, index) => (
                    <tr key={index} onClick={() => setSelectedAccount(account)} className={selectedAccount?.accountNum === account.accountNum ? 'selected' : ''} >
                        <td>{account.accountNum}</td>
                    </tr>
                ))}
                </tbody>
            </table>
            </div>
        </div>
    </>
  );
};

export default Accounts;
