import React, { useState, useEffect } from "react";
import api from "../api";

export default function Dispute() {
  const [accountNum, setAccountNum] = useState("");
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [billsummary, setBillsummary] = useState([]);
  const [invoiceFeedDataRC, setInvoiceFeedDataRC] = useState([]);
  const [invoiceFeedDataUsage, setInvoiceFeedDataUsage] = useState([]);
  const [invoiceFeedDataServices, setInvoiceFeedDataServices] = useState([]);
  const [selectedInvoiceFeedDataService, setSelectedInvoiceFeedDataService] = useState(null);
  const [selectedinvoiceFeedData, setSelectedinvoiceFeedData] = useState(null);
  const [adjustmentTypes, setAdjustmentTypes] = useState([]);
  const [selectedAdjustmentType, setSelectedAdjustmentType] = useState('');
  const [amount, setAmount] = useState('');
  const [selectedBill, setSelectedBill] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (selectedinvoiceFeedData) {
      console.log("selectedinvoiceFeedData changed:", selectedinvoiceFeedData);
    }
  }, [selectedinvoiceFeedData]);

  const handleSearch = async () => {
    console.log("accountNum: ", accountNum);

    /** Clear all states */
    setAccounts([]);
    setSelectedAccount(null);
    setBillsummary([]);
    setInvoiceFeedDataRC([]);
    setInvoiceFeedDataUsage([]);
    setInvoiceFeedDataServices([]);
    setSelectedInvoiceFeedDataService(null);
    setSelectedinvoiceFeedData(null);
    setAdjustmentTypes([]);
    setSelectedAdjustmentType('');
    setAmount('');
    setSelectedBill(null);
    setSuccessMessage('');

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
    console.log('Selected Bill:', bill); // Debugging log
    setSelectedBill(bill);
    try {
      const response = await api.get(`/api/SAPInvoiceFeedData/GetSAPInvoiceFeedDataServiceNumbers`, {
        params: {
          accountNum: bill.accountNum,
          billSeq: bill.billSeq
        }
      });
      setInvoiceFeedDataServices(response.data);
      setInvoiceFeedDataRC([]);
      setInvoiceFeedDataUsage([]);
      setSelectedInvoiceFeedDataService(null);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSelectInvoiceServices = async (bill) => {
    setSelectedInvoiceFeedDataService(bill);
    setSelectedinvoiceFeedData(null);

    try {
      const response1 = await api.get(`/api/SAPInvoiceFeedData/GetSAPInvoiceFeedDataRC`, {
        params: {
          accountNum: bill.accountNum,
          billSeq: bill.billSeq,
          serviceNumber: bill.serviceNumber
        }
      });
      setInvoiceFeedDataRC(response1.data);

      const response2 = await api.get(`/api/SAPInvoiceFeedData/GetSAPInvoiceFeedDataUsage`, {
        params: {
          accountNum: bill.accountNum,
          billSeq: bill.billSeq,
          serviceNumber: bill.serviceNumber
        }
      });

      setInvoiceFeedDataUsage(response2.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSelectInvoiceFeedDataRC = async (invoice) => {
    setSelectedinvoiceFeedData(invoice);
    try {
      const response = await api.get(`/api/AdjustmentType/GetAdjustmentTypesByProductCodeAndRevenueCode`, {
        params: {
          productCode: invoice.productCode,
          revenueCodeId: invoice.revenueCodeId
        }
      });
      setAdjustmentTypes(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSelectInvoiceFeedDataUsage = async (invoice) => {
    setSelectedinvoiceFeedData(invoice);
    try {
      const response = await api.get(`/api/AdjustmentType/GetAdjustmentTypesByProductCodeAndRevenueCode`, {
        params: {
          productCode: invoice.productCode,
          revenueCodeId: invoice.revenueCodeId
        }
      });
      setAdjustmentTypes(response.data);
    } catch (error) {
      console.error(error);
    }
  };


  const handleCreateDispute = async () => {
    try {
      const response = await api.post('/api/Dispute/CreateAdjustmentRequest', {
        accountNum: selectedinvoiceFeedData.accountNum,
        disputeDtm: new Date().toISOString(),
        billSeq: selectedinvoiceFeedData.billSeq,
        disputeMny: parseFloat(amount),
        productId: selectedinvoiceFeedData.productId,
        cpsId: selectedAccount.cpsId,
        productSeq: selectedinvoiceFeedData.productSeq,
        eventRef: "",
        adjustmentTypeId: selectedAdjustmentType,
        serviceNum: selectedinvoiceFeedData.serviceNumber,
        invoiceNum: selectedBill.invoiceNum,
        disputeSeq: null,
        adjustmentSeq: null,
        requestStatus: "I"
      });
      console.log('Dispute created:', response.data);
      setSuccessMessage('Dispute created successfully!');
    } catch (error) {
      console.error('Error creating dispute', error);
      setSuccessMessage('Failed to create dispute.');
    }
  };

  return (

    <>
      <section className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-6">
              <h1>Adjust -</h1>
            </div>
            <div className="col-sm-6">
              <ol className="breadcrumb float-sm-right">
                <li className="breadcrumb-item"><a href="#">Home</a></li>
                <li className="breadcrumb-item active">Adjust-</li>
              </ol>
            </div>
          </div>
        </div>
      </section>
      <section className="content">
        <div className="container-fluid">
          <div className="row">
            <div className="col-12">
              <div className="card p-3">
                <div className="row">
                  <div className="col-12">
                    <p>1) Search Account Num (000350000103)</p>
                    <div className="xxx">
                      <div>
                        <input
                          type="text"
                          value={accountNum}
                          onChange={(e) => setAccountNum(e.target.value)}
                          placeholder="Enter account number"
                        />
                        <button onClick={handleSearch} >Search</button>
                      </div>

                      <br />
                      {accounts.length > 0 && (
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
                                  className={selectedAccount?.accountNum === account.accountNum ? 'selected' : ''}
                                >
                                  <td>{account.accountNum}</td>
                                  <td>{account.customerRef}</td>
                                  <td>{account.billCycle}</td>
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

          <div className="row">
            <div className="col-12">
              <div className="card p-3">
                <div className="row">
                  <div className="col-12">
                    <p>2) Select Invoice Num</p>
                    <div className="xxx">
                      {billsummary.length > 0 && (
                        <div className="table-container">
                          <table id="billSummaryTable" className="table table-bordered table-striped">
                            <thead>
                              <tr>
                                <th>AccountNum</th>
                                <th>Bill</th>
                                <th>Invoice Number</th>
                                <th>Bill Month</th>
                                <th>BillAmount</th>
                              </tr>
                            </thead>
                            <tbody>
                              {billsummary.map((bill, index) => (
                                <tr
                                  key={index}
                                  onClick={() => {
                                    console.log('Row clicked:', bill); // Debugging log for row click
                                    handleSelectBill(bill);
                                  }}
                                  className={selectedBill?.invoiceNum === bill.invoiceNum ? 'selected' : ''}
                                >
                                  <td>{bill.accountNum}</td>
                                  <td>{bill.billSeq}</td>
                                  <td>{bill.invoiceNum}</td>
                                  <td>{new Date(bill.billDtm).toLocaleDateString()}</td>
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

          <div className="row">
            <div className="col-12">
              <div className="row">
                <div className="col-3">
                  { /** 3.1 Select Services */}
                  <div className="card p-3" style={{ minHeight: '300px' }}>
                    <p>3) Select Service Number</p>

                    {invoiceFeedDataServices.length > 0 && (
                      <div className="table-container">
                        <table className="table table-bordered table-striped">
                          <thead>
                            <tr>
                              <th>Service Number</th>
                            </tr>
                          </thead>
                          <tbody>
                            {invoiceFeedDataServices.map((data, idx) => (
                              <tr
                                key={idx}
                                onClick={() => { handleSelectInvoiceServices(data); }}
                                className={selectedInvoiceFeedDataService?.serviceNumber === data.serviceNumber ? 'selected' : ''}
                              >
                                <td>{data.serviceNumber}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}

                  </div>
                </div>

                <div className="col-9">
                  <div className="row">
                    <div className="col-12">
                      { /** 3.2 Select RC */}
                      <div className="card p-3">
                        <p>RC:</p>
                        {invoiceFeedDataRC.length > 0 && (
                          <div>
                            <table className="table table-bordered table-striped">
                              <thead>
                                <tr>
                                  <th>Service Number</th>
                                  <th>Product Name</th>
                                  <th>Price Plan</th>
                                  <th>Amount</th>
                                  <th>Product Code</th>
                                </tr>
                              </thead>
                              <tbody>
                                {invoiceFeedDataRC.map((invoice, idx) => (
                                  <tr
                                    key={idx}
                                    onClick={() => {
                                      handleSelectInvoiceFeedDataRC(invoice);
                                    }}
                                    className={(selectedinvoiceFeedData?.tariffName === invoice.tariffName && selectedinvoiceFeedData?.productSeq === invoice.productSeq && selectedinvoiceFeedData?.callType === invoice.callType) ? 'selected' : ''}
                                  >
                                    <td>{invoice.serviceNumber}</td>
                                    <td>{invoice.productId}</td>
                                    <td>{invoice.tariffName}</td>
                                    <td>{invoice.aggAmount}</td>
                                    <td>{invoice.productCode}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-12">
                      { /** 3.3 Select USAGE */}
                      <div className="card p-3">
                        <p>USAGE:</p>
                        {invoiceFeedDataUsage.length > 0 && (
                          <div>
                            <table className="table table-bordered table-striped">
                              <thead>
                                <tr>
                                  <th>Service Number</th>
                                  <th>Product Name</th>
                                  <th>Call Type</th>
                                  <th>Amount</th>
                                  <th>Product Code</th>
                                </tr>
                              </thead>
                              <tbody>
                                {invoiceFeedDataUsage.map((invoice, idx) => (
                                  <tr
                                    key={idx}
                                    onClick={() => {
                                      handleSelectInvoiceFeedDataUsage(invoice);
                                    }}
                                    className={(selectedinvoiceFeedData?.tariffName === invoice.tariffName && selectedinvoiceFeedData?.productSeq === invoice.productSeq && selectedinvoiceFeedData?.callType === invoice.callType) ? 'selected' : ''}
                                  >
                                    <td>{invoice.serviceNumber}</td>
                                    <td>{invoice.productId}</td>
                                    <td>{invoice.callType}</td>
                                    <td>{invoice.aggAmount}</td>
                                    <td>{invoice.productCode}</td>
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
          </div>

          <div className="row">
            <div className="col-12">
              <div className="card p-3">
                <div className="row">
                  <div className="col-12">
                    <p>4) Create Dispute</p>
                    <div className="xxx">

                      <div className="card card-secondary">
                        <div className="card-header">
                          <h3 className="card-title">Dispute</h3>
                        </div>

                        <form>
                          <div className="card-body">
                            <div className="form-group">
                              <label htmlFor="txtAccountNum">Account Num</label>
                              <input type="text" className="form-control" id="txtAccountNum" placeholder="Account Num" value={selectedBill ? selectedBill.accountNum : ''} readOnly />
                            </div>
                            <div className="form-group">
                              <label htmlFor="txtBillSeq">Bill Seq</label>
                              <input type="text" className="form-control" id="txtBillSeq" placeholder="Bill Seq" value={selectedBill ? selectedBill.billSeq : ''} readOnly />
                            </div>
                            <div className="form-group">
                              <label htmlFor="txtAmount">Amount</label>
                              <input type="text" className="form-control" id="txtAmount" placeholder="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} />
                            </div>
                            <div className="form-group">
                              <label>Adjustment Type</label>
                              <select className="form-control" value={selectedAdjustmentType} onChange={(e) => setSelectedAdjustmentType(e.target.value)} >
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
                            <button type="button" onClick={handleCreateDispute} className="btn btn-secondary">Create Dispute</button>
                          </div>
                        </form>

                        {successMessage && (
                          <div className="alert alert-secondary mt-3">
                            {successMessage}
                          </div>
                        )}
                      </div>
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
