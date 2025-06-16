import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const formatDateForDisplay = (date) => {
    if (!date) return '';
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`; // Convert to dd/mm/yyyy format
};

const parseDateFromInput = (dateString) => {
    const [day, month, year] = dateString.split('/');
    return new Date(`${year}-${month}-${day}`);
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
                                <DatePicker
                                    selected={fromDate ? new Date(fromDate) : null}
                                    onChange={(date) => handleFromDateChange({ target: { value: date.toISOString().split('T')[0] } })}
                                    dateFormat="dd/MM/yyyy"
                                    className="form-control"
                                    placeholderText="dd/mm/yyyy"
                                    style={{ zIndex: 1050 }}
                                />
                            </div>
                        </div>
                        <div className="col-sm-2">
                            <div className="form-group">
                                <label>To Date:</label>
                                <DatePicker
                                    selected={toDate ? new Date(toDate) : null}
                                    onChange={(date) => handleToDateChange({ target: { value: date.toISOString().split('T')[0] } })}
                                    dateFormat="dd/MM/yyyy"
                                    className="form-control"
                                    placeholderText="dd/mm/yyyy"
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SearchBox;