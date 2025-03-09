import React, { useState } from 'react';
import { formatNumber } from '../utils/utils'; // Import the utility function

const InvoiceSearch = ({ accountNum, invoices, getInvoicesByAccountNum, selectedInvoice, handleSelectInvoice }) => {
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
    const [filters, setFilters] = useState({
        billSeq: '',
        invoiceNum: '',
        billDtm: '',
        actualBillDtm: '',
        invoiceNetMny: '',
        invoiceTaxMny: '',
        adjustedMny: '',
        writeOffMny: '',
        pendingAdjustmentMny: ''
    });

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters({
            ...filters,
            [name]: value
        });
    };

    const filteredInvoices = invoices.filter(invoice => {
        return Object.keys(filters).every(key => {
            if (!filters[key]) return true;
            if (key === 'billDtm' || key === 'actualBillDtm') {
                return new Date(invoice[key]).toLocaleDateString('en-GB').includes(filters[key]);
            }
            return invoice[key].toString().toLowerCase().includes(filters[key].toLowerCase());
        });
    });

    const sortedInvoices = React.useMemo(() => {
        let sortableInvoices = [...filteredInvoices];
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
    }, [filteredInvoices, sortConfig]);

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
        //return '⇅';
        return null;
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
                                    {['billSeq', 'invoiceNum', 'billDtm', 'actualBillDtm', 'invoiceNetMny', 'invoiceTaxMny', 'adjustedMny', 'writeOffMny', 'pendingAdjustmentMny'].map((key) => (
                                        <th key={key} className="sortable">
                                            <div className="d-flex flex-column">
                                                <div className="d-flex justify-content-between align-items-center">
                                                    <span onClick={() => requestSort(key)} style={{ cursor: 'pointer' }}>{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                                                     {getSortIndicator(key)}</span>
                                                </div>
                                                <input type="text" name={key} value={filters[key]} onChange={handleFilterChange} placeholder="Filter" className="form-control" />
                                            </div>
                                        </th>
                                    ))}
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
