
const InvoiceDataServices = ({invoiceDataServices, selectedInvoiceDataService, handleSelectInvoiceServices}) => {

  return (
    <>
        <label>Service Number</label>
        <div className="table-responsive" style={{height: 500, border: '1px solid #dee2e6'}}>
            <table className="table table-as-list text-nowrap table-hover">
            <tbody>
                { invoiceDataServices.map((data, idx) => (
                <tr key={idx} onClick={() => { handleSelectInvoiceServices(data); }} className={selectedInvoiceDataService?.serviceNumber === data.serviceNumber ? 'selected' : ''} >
                    <td>{data.serviceNumber}</td>
                </tr>
                ))}
            </tbody>
            </table>
        </div>    
    </>
  )
}

export default InvoiceDataServices;