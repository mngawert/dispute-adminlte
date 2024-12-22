
const ServiceSearch = ({ title = "Search for:", accountNum, setAccountNum, getAccountsByServiceNum, getAccountsByAccountNum }) => {

  return (
    <>
        <div className="form-group">
            <label>{title}</label>
            <input type="text" className="form-control" placeholder="" value={accountNum} onChange={(e) => setAccountNum(e.target.value)} />
        </div>
        <div className="form-group">
            <button type="button" className="btn btn-default mr-1" onClick={() => getAccountsByServiceNum(accountNum)} >Service Num</button>
            <button type="button" className="btn btn-default" onClick={() => getAccountsByAccountNum(accountNum)} >Account Num</button>
        </div>
    </>
  );
};

export default ServiceSearch;
