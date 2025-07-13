import React from 'react';
import 'react-datepicker/dist/react-datepicker.css';

const formatDateForDisplay = (dateString) => {
    if (!dateString) return '';
    
    try {
        const date = new Date(dateString);
        if (!isNaN(date.getTime())) {
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const year = date.getFullYear();
            return `${day}/${month}/${year}`;
        }
        return '';
    } catch (error) {
        console.error('Error formatting date:', error);
        return '';
    }
};

const SearchBox = ({ searchBy, selectedSearchBy, handleSearchByChange, documentNum, handleInputChange, handleSearch, filterBy, handleFilterByChange, fromDate, toDate, handleFromDateChange, handleToDateChange, showSearchBy }) => {
    return (
        <div className="card">
            <div className="card-body">
                {showSearchBy && (
                    <div className="row">
                        <div className="col-sm-4">
                            <div className="form-group d-flex align-items-center">
                                <label style={{ width: 160 }}>Search for:</label>
                                <select className="form-control" onChange={handleSearchByChange} value={selectedSearchBy?.value}>
                                    <option value="">All</option>
                                    {searchBy.map((search, index) => (
                                        <option key={index} value={search.value}>{search.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="col-sm-3">
                            <div className="form-group">
                                <input type="text" className="form-control" onChange={handleInputChange} value={documentNum} disabled={!selectedSearchBy?.value} />
                            </div>
                        </div>
                        <div className="col-sm-2">
                            <div className="form-group">
                                <button type="button" className="btn btn-primary" onClick={handleSearch}>Search</button>
                            </div>
                        </div>
                    </div>
                )}
                {!showSearchBy && (
                    <div className="row">
                        <div className="col-sm-3">
                            <div className="form-group">
                                <label>View Adjustments that you:</label>
                                <select className="form-control" onChange={handleFilterByChange} value={filterBy}>
                                    <option value="createdBy">Created</option>
                                    <option value="reviewedBy">Reviewed</option>
                                    <option value="approvedBy">Approved</option>
                                    <option value="financeReviewedBy">Finance Reviewed</option>
                                    <option value="rejectedBy">Rejected</option>
                                    <option value="canceledBy">Canceled</option>
                                </select>
                            </div>
                        </div>
                        <div className="col-sm-2">
                            <div className="form-group">
                                <label>From Date:</label>
                                <div className="input-group">
                                    <input
                                        type="date"
                                        value={fromDate || ''}
                                        onChange={handleFromDateChange}
                                        className="form-control"
                                        style={{ width: "0px", padding: "0", border: "none", opacity: 0, position: "absolute" }}
                                    />
                                    <div 
                                        className="form-control" 
                                        onClick={(e) => document.querySelector('input[type="date"]').showPicker()}
                                        style={{ cursor: "pointer", background: "#f8f9fa" }}
                                    >
                                        {fromDate ? formatDateForDisplay(fromDate) : 'Click to select date'}
                                    </div>
                                    <div className="input-group-append">
                                        <button 
                                            className="btn btn-outline-secondary" 
                                            type="button"
                                            onClick={() => handleFromDateChange({ target: { value: '' }})}
                                            title="Clear date"
                                        >
                                            <i className="fa fa-times"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-sm-2">
                            <div className="form-group">
                                <label>To Date:</label>
                                <div className="input-group">
                                    <input
                                        type="date"
                                        value={toDate || ''}
                                        onChange={handleToDateChange}
                                        className="form-control"
                                        style={{ width: "0px", padding: "0", border: "none", opacity: 0, position: "absolute" }}
                                    />
                                    <div 
                                        className="form-control" 
                                        onClick={(e) => {
                                            // Get the second date input in the component
                                            const inputs = document.querySelectorAll('input[type="date"]');
                                            if (inputs.length > 1) inputs[1].showPicker();
                                        }}
                                        style={{ cursor: "pointer", background: "#f8f9fa" }}
                                    >
                                        {toDate ? formatDateForDisplay(toDate) : 'Click to select date'}
                                    </div>
                                    <div className="input-group-append">
                                        <button 
                                            className="btn btn-outline-secondary" 
                                            type="button"
                                            onClick={() => handleToDateChange({ target: { value: '' }})}
                                            title="Clear date"
                                        >
                                            <i className="fa fa-times"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-sm-2">
                            <div className="form-group" style={{ marginTop: '32px' }}>
                                <button type="button" className="btn btn-primary" onClick={handleSearch}>Search</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SearchBox;