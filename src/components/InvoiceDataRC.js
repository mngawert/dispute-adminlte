
const InvoiceDataRC = ({ invoiceDataRC, selectedInvoiceDataRC, handleSelectInvoiceRC }) => {

    return (
        <div className="form-group">
            <label>RC</label>
            <div className="table-responsive" style={{height: 200}}>
                <table className="table table-head-fixed text-nowrap table-bordered table-hover">
                    <thead>
                    <tr>
                        <th>Service number</th>
                        <th>Product name</th>
                        <th>Price plan</th>
                        <th>Amount</th>
                        <th>Costed</th>
                        <th>Discount</th>
                    </tr>
                    </thead>
                    <tbody>
                    {invoiceDataRC.map((invoice, idx) => (
                        <tr key={idx} onClick={() => handleSelectInvoiceRC(invoice)} className={invoice.productSeq === selectedInvoiceDataRC.productSeq && invoice.tariffName === selectedInvoiceDataRC.tariffName && invoice.callType === selectedInvoiceDataRC.callType ? 'selected' : ''} >
                            <td>{invoice.serviceNumber}</td>
                            <td>{invoice.productName}</td>
                            <td>{invoice.tariffName}</td>
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

export default InvoiceDataRC;