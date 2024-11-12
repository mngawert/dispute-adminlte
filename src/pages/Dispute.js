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
  const [adjustmentTypes, setAdjustmentTypes] = useState([]);
  const [selectedAdjustmentType, setSelectedAdjustmentType] = useState('');
  const [amount, setAmount] = useState('');
  const [selectedBill, setSelectedBill] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

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
    } catch (error) {
      console.error(error);
    }
  };

  const handleSelectInvoiceServices = async (bill) => {
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
    try {
      const response = await api.get(`/api/AdjustmentType/GetAdjustmentTypesByProductCode`, {
        params: {
          productCode: invoice.productCode
        }
      });
      setAdjustmentTypes(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSelectInvoiceFeedDataUsage = async (invoice) => {
    try {
      const response = await api.get(`/api/AdjustmentType/GetAdjustmentTypesByProductCode`, {
        params: {
          productCode: invoice.productCode
        }
      });
      setAdjustmentTypes(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleCreateDispute = async () => {
    try {
      const response = await api.post('/api/Dispute/CreateDispute', {
        accountNumber: selectedBill.accountNum,
        disputeDtm: new Date().toISOString(),
        billSeq: selectedBill.billSeq,
        disputeTxt: "test",
        disputeMny: parseFloat(amount),
        productId: 0,
        eventTypeId: 0,
        disputeTypeId: 0,
        cpsID: 0,
        productSeq: 0,
        chargeType: 0,
        eventRef: "string",
        receivableClassId: 0,
        otcSeq: 0,
        disputeStatus: "P",
        outcomeDesc: "-",
        genevaUserOra: "-",
        disputeClass: 0,
        taxOverrideId: 0,
        ustCategoryId: 0,
        ustCodeId: 0,
        decisionDtm: new Date().toISOString()
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
              <h1>Dispute</h1>
            </div>
            <div className="col-sm-6">
              <ol className="breadcrumb float-sm-right">
                <li className="breadcrumb-item"><a href="#">Home</a></li>
                <li className="breadcrumb-item active">Dispute</li>
              </ol>
            </div>
          </div>
        </div>
      </section>
      <section className="content">
        <div className="container-fluid">
          <div className="row">
            <div className="col-12">
              <div className="invoice p-3 mb-3">
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

                      </div>

                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>



          <div className="row">
            <div className="col-12">
              <div className="invoice p-3 mb-3">
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
                                <th>BillSeq</th>
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

                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>


          <div className="row">
            <div className="col-12">
              <div className="invoice p-3 mb-3">
                <div className="row">
                  <div className="col-3">
                    <p>3) Select Charge (Invoice Feed Data)</p>

                    <div className="xxx">

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
                                  onClick={() => {
                                    handleSelectInvoiceServices(data);
                                  }}
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
                  <div className="row" style={{ minHeight: '200px'}}>
                      <div className="col-12">
                        <p>RC:</p>
                        <div className="xxx">
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
                        <p>USAGE:</p>
                        <div className="xxx">
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
          </div>

          <div className="row">
            <div className="col-12">
              <div className="invoice p-3 mb-3">
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
                          <div className="alert alert-success mt-3">
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
