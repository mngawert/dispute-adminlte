import React from "react";

const InvoiceFeedDataUsage = ({ invoiceFeedDataUsage, handleSelectInvoiceFeedDataUsage, selectedinvoiceFeedData }) => {
  return (
    <div>
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
                    <td>{invoice.productName}</td>
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
  );
}

export default InvoiceFeedDataUsage;
