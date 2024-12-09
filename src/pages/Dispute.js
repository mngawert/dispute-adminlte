import React, { useState, useEffect } from "react";
import api from "../api";
import { event } from "jquery";
import SearchAccount from "../components/SearchAccount";
import BillSummary from "../components/BillSummary";
import InvoiceFeedDataService from "../components/InvoiceFeedDataService";
import InvoiceFeedDataRC from "../components/invoiceFeedDataRC";
import InvoiceFeedDataUsage from "../components/InvoiceFeedDataUsage";
import CostedEvent from "../components/CostedEvent";
import CreateDisputeForm from "../components/CreateDisputeForm";

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
  const [costedEvents, setCostedEvents] = useState([]);
  const [selectedCostedEvent, setSelectedCostedEvent] = useState(null);
  const [adjustmentTypes, setAdjustmentTypes] = useState([]);
  const [selectedAdjustmentType, setSelectedAdjustmentType] = useState('');
  const [amount, setAmount] = useState('');
  const [selectedBill, setSelectedBill] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [selectedType, setSelectedType] = useState('');

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
      setCostedEvents([]);
      setSelectedCostedEvent(null);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSelectInvoiceServices = async (bill) => {
    setSelectedInvoiceFeedDataService(bill);
    setSelectedinvoiceFeedData(null);
    setCostedEvents([]);
    setSelectedCostedEvent(null);

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
    setSelectedType('RC');
    setSelectedinvoiceFeedData(invoice);
    setAmount(invoice.aggAmount);
    setCostedEvents([]);
    setSelectedCostedEvent(null);
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
    setSelectedType('Usage');
    setSelectedinvoiceFeedData(invoice);
    setAmount(invoice.aggAmount);
    try {
      const response1 = await api.get(`/api/AdjustmentType/GetAdjustmentTypesByProductCodeAndRevenueCode`, {
        params: {
          productCode: invoice.productCode,
          revenueCodeId: invoice.revenueCodeId
        }
      });
      setAdjustmentTypes(response1.data);

      const response2 = await api.get(`/api/CostedEvent/GetCostedEvents`, {
        params: {
          accountNum: invoice.accountNum,
          billSeq: invoice.billSeq,
          eventSource: invoice.serviceNumber,
          eventTypeId: invoice.eventTypeId,
          callType: invoice.callType
        }
      });
      console.log('Costed Events:', response2.data);
      setCostedEvents(response2.data);

    } catch (error) {
      console.error(error);
    }
  };

  const handleSelectCostedEvent = (costedEvent) => {
    setSelectedType('CostedEvent');
    setSelectedCostedEvent(costedEvent);
    setAmount(costedEvent.eventCostMny);
  };

  const validateDispute = () => {
    if (!selectedAccount) {
      setSuccessMessage('Please select an account.');
      return false;
    }
    if (!selectedBill) {
      setSuccessMessage('Please select a bill.');
      return false;
    }
    if (!selectedinvoiceFeedData) {
      setSuccessMessage('Please select an invoice feed data.');
      return false;
    }
    if (!selectedAdjustmentType) {
      setSuccessMessage('Please select an adjustment type.');
      return false;
    }
    if (!amount) {
      setSuccessMessage('Please enter an amount.');
      return false;
    }
    if (parseFloat(amount) > parseFloat(selectedinvoiceFeedData.aggAmount)) {
      setSuccessMessage('Amount cannot be greater than the aggregated amount.');
      return false;
    }
    return true;
  }

  const handleCreateDispute = async () => {

    if (!validateDispute()) { return; }

    // Retrieve userId from local storage
    const userLogin = JSON.parse(localStorage.getItem('userLogin'));
    const userId = userLogin ? userLogin.userId : null;

    try {
      const response = await api.post('/api/Adjustment/CreateAdjustmentRequest', {
        documentType: '31',
        createdBy: userId,
        accountNum: selectedinvoiceFeedData.accountNum,
        disputeDtm: new Date().toISOString(),
        billSeq: selectedinvoiceFeedData.billSeq,
        disputeMny: parseFloat(amount),
        productId: selectedinvoiceFeedData.productId,
        cpsId: selectedAccount.cpsId,
        productSeq: selectedinvoiceFeedData.productSeq,
        eventRef: selectedCostedEvent?.eventRef,
        eventTypeId: selectedCostedEvent?.eventTypeId,
        adjustmentTypeId: selectedAdjustmentType,
        serviceNum: selectedinvoiceFeedData.serviceNumber,
        invoiceNum: selectedBill.invoiceNum,
        disputeSeq: null,
        adjustmentSeq: null,
        requestStatus: "Create-Pending"
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
                <li className="breadcrumb-item active"> [ { JSON.parse(localStorage.getItem('userLogin'))?.username } ] </li>
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
                    <p>1) Search Account Num (000350000103, 000102931589)</p>
                    <SearchAccount
                      accountNum={accountNum}
                      setAccountNum={setAccountNum}
                      handleSearch={handleSearch}
                      accounts={accounts}
                      handleSelectAccount={handleSelectAccount}
                      selectedAccount={selectedAccount}
                    />
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
                    <BillSummary billsummary={billsummary} handleSelectBill={handleSelectBill} selectedBill={selectedBill}  />
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
                    <InvoiceFeedDataService
                      invoiceFeedDataServices={invoiceFeedDataServices}
                      handleSelectInvoiceServices={handleSelectInvoiceServices}
                      selectedInvoiceFeedDataService={selectedInvoiceFeedDataService} />
                  </div>
                </div>

                <div className="col-9">
                  <div className="row">
                    <div className="col-12">
                      { /** 3.2 Select RC */}
                      <div className="card p-3">
                        <p>RC:</p>
                        <InvoiceFeedDataRC invoiceFeedDataRC={invoiceFeedDataRC} handleSelectInvoiceFeedDataRC={handleSelectInvoiceFeedDataRC} selectedinvoiceFeedData={selectedinvoiceFeedData} />

                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-12">
                      { /** 3.3 Select USAGE */}
                      <div className="card p-3">
                        <p>USAGE:</p>
                        <InvoiceFeedDataUsage invoiceFeedDataUsage={invoiceFeedDataUsage} handleSelectInvoiceFeedDataUsage={handleSelectInvoiceFeedDataUsage} selectedinvoiceFeedData={selectedinvoiceFeedData} />

                      </div>
                    </div>
                  </div>


                  <div className="row">
                    <div className="col-12">
                      { /** 3.4 Select CostedEvent */}
                      <div className="card p-3">
                        <p>CostedEvent:</p>
                        <CostedEvent costedEvents={costedEvents} handleSelectCostedEvent={handleSelectCostedEvent} selectedCostedEvent={selectedCostedEvent} />
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
                    <CreateDisputeForm
                      adjustmentTypes={adjustmentTypes}
                      selectedAdjustmentType={selectedAdjustmentType}
                      setSelectedAdjustmentType={setSelectedAdjustmentType}
                      amount={amount}
                      setAmount={setAmount}
                      handleCreateDispute={handleCreateDispute}
                      successMessage={successMessage}
                      />

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
