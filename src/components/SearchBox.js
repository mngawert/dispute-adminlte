import React from 'react';

const SearchBox = ({ searchBy, selectedSearchBy, handleSearchByChange, documentNum, handleInputChange, handleSearch, filterBy, handleFilterByChange, fromDate, toDate, handleFromDateChange, handleToDateChange }) => {
    return (
        <div className="card">
            <div className="card-body">
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
                <div className="row">
                    <div className="col-sm-3">
                        <div className="form-group">
                            <label>View Adjustmens that you :</label>
                            <select className="form-control" onChange={handleFilterByChange} value={filterBy}>
                                <option value="createdBy">Created</option>
                                <option value="reviewedBy">Reviewed</option>
                                <option value="approvedBy">Approved</option>
                                <option value="financeReviewedBy">Finance Reviewed</option>
                            </select>
                        </div>
                    </div>
                    <div className="col-sm-3">
                        <div className="form-group">
                            <label>From Date:</label>
                            <input type="date" className="form-control" onChange={handleFromDateChange} value={fromDate} />
                        </div>
                    </div>
                    <div className="col-sm-3">
                        <div className="form-group">
                            <label>To Date:</label>
                            <input type="date" className="form-control" onChange={handleToDateChange} value={toDate} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SearchBox;