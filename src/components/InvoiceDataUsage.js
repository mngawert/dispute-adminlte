
const InvoiceDataUsage = ({ invoiceDataUsage, selectedInvoiceDataUsage, handleSelectInvoiceUsage }) => {
  return (
        <div className="form-group">
            <label>Usage</label>
            <div className="table-responsive" style={{height: 200}}>
            <table className="table table-head-fixed text-nowrap table-bordered table-hover">
                <thead>
                <tr>
                    <th>Service number</th>
                    <th>Product name</th>
                    <th>Call Type</th>
                    <th>Amount</th>
                    <th>Costed</th>
                    <th>Discount</th>
                </tr>
                </thead>
                <tbody>
                {invoiceDataUsage.map((invoice, idx) => (
                    <tr key={idx} onClick={() => handleSelectInvoiceUsage(invoice)} className={invoice.productSeq === selectedInvoiceDataUsage?.productSeq && invoice.tariffName === selectedInvoiceDataUsage?.tariffName && invoice.callType === selectedInvoiceDataUsage?.callType ? 'selected' : ''}>
                    <td>{invoice.serviceNumber}</td>
                    <td>{invoice.productName}</td>
                    <td>{invoice.callType}</td>
                    <td>{invoice.aggAmount}</td>
                    <td>{invoice.costed}</td>
                    <td>{invoice.discount}</td>
                    </tr>
                ))}
                </tbody>
            </table>
            </div>
        </div>
  );
}

export default InvoiceDataUsage;