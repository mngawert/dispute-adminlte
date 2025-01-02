
const InvoiceSearch = ({ accountNum, invoices, getInvoicesByAccountNum, selectedInvoice, handleSelectInvoice }) => {
  return (
    <>
        <div className="d-flex">
            <p className="d-flex flex-column">
                <button type="button" className="btn btn-default" onClick={() => getInvoicesByAccountNum(accountNum)} >View Account's Invoices</button>
                {/* <button type="button" className="btn btn-default">Get details for Account</button> */}
            </p>
            <p className="ml-auto d-flex flex-column text-right">

            </p>
        </div>
        <div className="row mb-5">
            <div className="col-12">
            <div className="table-responsive" style={{height: 300}}>
                <table className="table table-head-fixed text-nowrap table-bordered table-hover">
                <thead>
                    <tr>
                    <th>Bill</th>
                    <th>Invoice Number</th>
                    <th>Bill Month</th>
                    <th>Actual Bill</th>
                    {/* <th>Convergent Amount</th> */}
                    <th>Invoice Amount</th>
                    <th>VAT Amount</th>
                    <th>Adjusted</th>
                    <th>Write Off</th>
                    <th>Pending Adjust Amount</th>
                    </tr>
                </thead>
                <tbody>
                    {invoices.map((invoice, index) => (
                    <tr key={index} onClick={() => handleSelectInvoice(invoice)} className={invoice.invoiceNum === selectedInvoice?.invoiceNum ? 'selected' : ''} >
                        <td>{invoice.billSeq}</td>
                        <td>{invoice.invoiceNum}</td>
                        <td>{new Date(invoice.billDtm).toLocaleDateString()}</td>
                        <td>{new Date(invoice.actualBillDtm).toLocaleDateString()}</td>
                        {/* <td>{invoice.convergentAmount}</td> */}
                        <td>{invoice.invoiceNetMny}</td>
                        <td>{invoice.invoiceTaxMny}</td>
                        <td>{invoice.adjustedMny}</td>
                        <td>{invoice.writeOffMny}</td>
                        <td>{invoice.pendingAdjustmentMny}</td>
                    </tr>
                    ))}
                </tbody>
                </table>
            </div>
            </div>
        </div>
    </>
  );
}

export default InvoiceSearch;
