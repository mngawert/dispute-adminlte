import React, { useState } from 'react';

const InvoiceDataServices = ({ invoiceDataServices, selectedInvoiceDataService, handleSelectInvoiceServices, tableHeight = 500 }) => {
    const [filterText, setFilterText] = useState('');

    const handleFilterChange = (e) => {
        setFilterText(e.target.value);
    };

    const filteredInvoiceDataServices = invoiceDataServices.filter(data =>
        data.serviceNumber.toLowerCase().includes(filterText.toLowerCase())
    );

    return (
        <>
            <label>Service Number</label>
            <input
                type="text"
                className="form-control mb-3"
                placeholder="Filter by Service Number"
                value={filterText}
                onChange={handleFilterChange}
            />
            <div className="table-responsive" style={{ height: tableHeight, border: '1px solid #dee2e6' }}>
                <table className="table table-as-list text-nowrap table-hover">
                    <tbody>
                        {filteredInvoiceDataServices.map((data, idx) => (
                            <tr
                                key={idx}
                                onClick={() => { handleSelectInvoiceServices(data); }}
                                className={selectedInvoiceDataService?.serviceNumber === data.serviceNumber ? 'selected' : ''}
                            >
                                <td>{data.serviceNumber}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
};

export default InvoiceDataServices;