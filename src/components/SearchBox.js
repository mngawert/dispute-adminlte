import React from 'react';

const SearchBox = ({ searchBy, selectedSearchBy, handleSearchByChange, documentNum, handleInputChange, handleSearch }) => {
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
                    <div className="col-sm-5">
                        <div className="form-group">
                            <button type="button" className="btn btn-primary" onClick={handleSearch}>Search</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SearchBox;