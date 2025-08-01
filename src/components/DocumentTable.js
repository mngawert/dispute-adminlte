import React, { useState } from 'react';
import { formatNumber, formatDate } from '../utils/utils'; // Import the utility functions

const DocumentTable = ({ documents, selectedDocument, handleSelectDocument }) => {
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });

    const sortedDocuments = React.useMemo(() => {
        let sortableDocuments = [...documents];
        if (sortConfig.key !== null) {
            sortableDocuments.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? -1 : 1;
                }
                if (a[sortConfig.key] > b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? 1 : -1;
                }
                return 0;
            });
        }
        return sortableDocuments;
    }, [documents, sortConfig]);

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

    return (
        <>
            <label className="mb-3">Documents:</label>
            <div className="table-responsive" style={{ height: 200 }}>
                <table className="table table-head-fixed text-nowrap table-bordered table-hover">
                    <thead>
                        <tr>
                            <th className="sortable" onClick={() => requestSort('documentNum')}>Document Sequence {getSortIndicator('documentNum')}</th>
                            <th className="sortable" onClick={() => requestSort('documentTypeDesc')}>Type {getSortIndicator('documentTypeDesc')}</th>
                            <th className="sortable" onClick={() => requestSort('totalMny')}>Total Amount {getSortIndicator('totalMny')}</th>
                            <th className="sortable" onClick={() => requestSort('createdByName')}>Created by {getSortIndicator('createdByName')}</th>
                            <th className="sortable" onClick={() => requestSort('createdDtm')}>Created date {getSortIndicator('createdDtm')}</th>
                            <th className="sortable" onClick={() => requestSort('homeLocationCode')}>Location {getSortIndicator('homeLocationCode')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedDocuments.map((document, index) => (
                            <tr key={index} onClick={() => handleSelectDocument(document)} className={document.documentNum === selectedDocument?.documentNum ? 'selected' : ''}>
                                <td>{document.documentNum}</td>
                                <td>{document.documentTypeDesc}</td>
                                <td>
                                    {document.documentTypeDesc === 'B1+/-'
                                        ? formatNumber(Math.abs(document.totalMny) / 2)
                                        : formatNumber(Math.abs(document.totalMny))}
                                </td>
                                <td>{document.createdByName}</td>
                                <td>{formatDate(document.createdDtm)}</td>
                                <td>{document.homeLocationCode}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>        
        </>
    );
};

export default DocumentTable;