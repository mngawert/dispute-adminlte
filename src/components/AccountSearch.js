import AccountInfo from "./AccountInfo";
import Accounts from "./Accounts";
import ServiceSearch from "./ServiceSearch";

const AccountSearch = ({ accountNum, setAccountNum, accounts, getAccountsByAccountNum, getAccountsByServiceNum, selectedAccount, setSelectedAccount }) => {
  return (
    <div className="card">
        <div className="card-body">
        <div className="row">
            <div className="col-sm-4">
                <ServiceSearch accountNum={accountNum} setAccountNum={setAccountNum} getAccountsByAccountNum={getAccountsByAccountNum} getAccountsByServiceNum={getAccountsByServiceNum} />
            </div>
            <div className="col-sm-4">
                <Accounts accounts={accounts} selectedAccount={selectedAccount} setSelectedAccount={setSelectedAccount} />
            </div>
            <div className="col-sm-4">
                <AccountInfo selectedAccount={selectedAccount} />
            </div>
        </div>
        </div>
    </div>
);
}

export default AccountSearch;
