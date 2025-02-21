import React from 'react';

const DocumentTable = ({ documents, selectedDocument, handleSelectDocument }) => {
    return (
        <div className="table-responsive" style={{ height: 200 }}>
            <table className="table table-head-fixed text-nowrap table-bordered table-hover">
                <thead>
                    <tr>
                        <th>Document Number</th>
                        <th>Type</th>
                        <th>Total Amount</th>
                        <th>Created by</th>
                        <th>Created date</th>
                        <th>Location</th>
                    </tr>
                </thead>
                <tbody>
                    {documents.map((document, index) => (
                        <tr key={index} onClick={() => handleSelectDocument(document)} className={document.documentNum === selectedDocument?.documentNum ? 'selected' : ''}>
                            <td>{document.documentNum}</td>
                            <td>{document.documentTypeDesc}</td>
                            <td>{document.totalMny}</td>
                            <td>{document.createdByName}</td>
                            <td>{new Date(document.createdDtm).toLocaleString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' })}</td>
                            <td>{document.homeLocationCode}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default DocumentTable;