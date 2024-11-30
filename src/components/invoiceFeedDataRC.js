import React from 'react';

const InvoiceFeedDataRC = ({ invoiceFeedDataRC, handleSelectInvoiceFeedDataRC, selectedinvoiceFeedData }) => {
  return (
    <div>
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
                    <td>{invoice.productName}</td>
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
  );
}

export default InvoiceFeedDataRC;
