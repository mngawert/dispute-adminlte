import React, { useState } from 'react';

const InvoiceSearch = ({ accountNum, invoices, getInvoicesByAccountNum, selectedInvoice, handleSelectInvoice }) => {
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });

    const sortedInvoices = React.useMemo(() => {
        let sortableInvoices = [...invoices];
        if (sortConfig.key !== null) {
            sortableInvoices.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? -1 : 1;
                }
                if (a[sortConfig.key] > b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? 1 : -1;
                }
                return 0;
            });
        }
        return sortableInvoices;
    }, [invoices, sortConfig]);

    const requestSort = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const getSortIndicator = (key) => {
        if (sortConfig.key === key) {
            return sortConfig.direction === 'ascending' ? '▲' : '▼';
        }
        return null;
    };

    const formatNumber = (value) => {
        return Number(value).toLocaleString();
    };

    return (
        <>
            <div className="d-flex">
                <p className="d-flex flex-column">
                    <button type="button" className="btn btn-default" onClick={() => getInvoicesByAccountNum(accountNum)}>View Account's Invoices</button>
                </p>
                <p className="ml-auto d-flex flex-column text-right">
                </p>
            </div>
            <div className="row mb-5">
                <div className="col-12">
                    <div className="table-responsive" style={{ height: 300 }}>
                        <table className="table table-head-fixed text-nowrap table-bordered table-hover">
                            <thead>
                                <tr>
                                    <th className="sortable" onClick={() => requestSort('billSeq')}>Bill {getSortIndicator('billSeq')}</th>
                                    <th className="sortable" onClick={() => requestSort('invoiceNum')}>Invoice Number {getSortIndicator('invoiceNum')}</th>
                                    <th className="sortable" onClick={() => requestSort('billDtm')}>Bill Month {getSortIndicator('billDtm')}</th>
                                    <th className="sortable" onClick={() => requestSort('actualBillDtm')}>Actual Bill {getSortIndicator('actualBillDtm')}</th>
                                    <th className="sortable" onClick={() => requestSort('invoiceNetMny')}>Invoice Amount {getSortIndicator('invoiceNetMny')}</th>
                                    <th className="sortable" onClick={() => requestSort('invoiceTaxMny')}>VAT Amount {getSortIndicator('invoiceTaxMny')}</th>
                                    <th className="sortable" onClick={() => requestSort('adjustedMny')}>Adjusted {getSortIndicator('adjustedMny')}</th>
                                    <th className="sortable" onClick={() => requestSort('writeOffMny')}>Write Off {getSortIndicator('writeOffMny')}</th>
                                    <th className="sortable" onClick={() => requestSort('pendingAdjustmentMny')}>Pending Adjust Amount {getSortIndicator('pendingAdjustmentMny')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sortedInvoices.map((invoice, index) => (
                                    <tr key={index} onClick={() => handleSelectInvoice(invoice)} className={invoice.invoiceNum === selectedInvoice?.invoiceNum && invoice.billSeq === selectedInvoice?.billSeq ? 'selected' : ''}>
                                        <td>{invoice.billSeq}</td>
                                        <td>{invoice.invoiceNum}</td>
                                        <td>{new Date(invoice.billDtm).toLocaleDateString('en-GB')}</td>
                                        <td>{new Date(invoice.actualBillDtm).toLocaleDateString('en-GB')}</td>
                                        <td>{formatNumber(invoice.invoiceNetMny)}</td>
                                        <td>{formatNumber(invoice.invoiceTaxMny)}</td>
                                        <td>{formatNumber(invoice.adjustedMny)}</td>
                                        <td>{formatNumber(invoice.writeOffMny)}</td>
                                        <td>{formatNumber(invoice.pendingAdjustmentMny)}</td>
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
