
const AccountInfo = ({selectedAccount}) => {

    return (
    <>
        <div className="form-group">
            <label>Customer name</label>
            <input type="text" className="form-control" value={selectedAccount ? selectedAccount.legalName : ''} readOnly />
        </div>
        <div className="form-group">
            <label>Account type</label>
            <input type="text" className="form-control" value={selectedAccount ? selectedAccount.invoicingCoName : ''} readOnly />
        </div>
    </>
  );
};

export default AccountInfo;
