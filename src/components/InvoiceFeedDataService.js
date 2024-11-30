
import React from 'react';

const InvoiceFeedDataService = ({ invoiceFeedDataServices, handleSelectInvoiceServices, selectedInvoiceFeedDataService }) => {

    return (
        <div className="xxx">
            {
                invoiceFeedDataServices.length > 0 && (
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
                )
            }
        </div>
    )
}

export default InvoiceFeedDataService;
