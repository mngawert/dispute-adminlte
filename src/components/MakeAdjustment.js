import React, { useState, useEffect } from 'react';
import { CPS_MAP_HASH, DOCUMENT_TYPE } from "../contexts/Constants";
import { formatNumber } from '../utils/utils'; // Import the utility function

const MakeAdjustment = ({ adjustmentTypes, selectedAdjustmentType, setSelectedAdjustmentType, selectedCostedEvent, adjustmentNote, setAdjustmentNote, adjustmentAmount, setAdjustmentAmount, handleCreateAdjustmentRequest, documentType, selectedAccount }) => {
    const [filteredAdjustmentTypes, setFilteredAdjustmentTypes] = useState([]);
    const [adjustmentTypeFilter, setAdjustmentTypeFilter] = useState('');

    // Filter adjustment types when the filter changes or on initial load
    useEffect(() => {
        if (documentType === DOCUMENT_TYPE.ADJUST_PLUS) {
            if (!adjustmentTypeFilter) {
                setFilteredAdjustmentTypes(adjustmentTypes);
            } else {
                const filtered = adjustmentTypes.filter(adjType => 
                    adjType.adjustmentTypeName.toLowerCase().includes(adjustmentTypeFilter.toLowerCase())
                );
                setFilteredAdjustmentTypes(filtered);
            }
        } else {
            setFilteredAdjustmentTypes(adjustmentTypes);
        }
    }, [adjustmentTypeFilter, adjustmentTypes, documentType]);

    const handleChangeAdjustmentType = (e) => {
        const selectedAdjustmentTypeId = e.target.value;
        const selectedAdjustmentType = adjustmentTypes.find((adjType) => adjType.adjustmentTypeId === Number(selectedAdjustmentTypeId));
        setSelectedAdjustmentType(selectedAdjustmentType);
    }

    const handleAmountChange = (e) => {
        const value = e.target.value;
        if (!isNaN(value)) {
            setAdjustmentAmount(value);

            console.log("Adjustment Amount:", value);
            console.log("selectedAccount:", selectedAccount);
        }
    }

    const vat = selectedAccount ? (adjustmentAmount * (CPS_MAP_HASH[selectedAccount.cpsId] / 100)).toFixed(2) : 0;
    const total = selectedAccount ? (adjustmentAmount * (1 + CPS_MAP_HASH[selectedAccount.cpsId] / 100)).toFixed(2) : 0;

    return (
        <>
            <div className="row">
                {documentType === DOCUMENT_TYPE.B ? (
                    <div className="col-sm-3 form-group">
                        <label>Make adjustment type</label>
                        <div className="form-control-plaintext font-weight-bold">B1+/-</div>
                    </div>
                ) : (
                    <div className="col-sm-3 form-group">
                        <label>Make adjustment type</label>
                        {documentType === DOCUMENT_TYPE.ADJUST_PLUS && (
                            <div className="input-group mb-2">
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    placeholder="Filter adjustment types..." 
                                    value={adjustmentTypeFilter} 
                                    onChange={(e) => setAdjustmentTypeFilter(e.target.value)} 
                                />
                                {adjustmentTypeFilter && (
                                    <div className="input-group-append">
                                        <button 
                                            className="btn btn-outline-secondary" 
                                            type="button"
                                            onClick={() => setAdjustmentTypeFilter('')}
                                            title="Clear filter"
                                        >
                                            <i className="fa fa-times"></i>
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                        <select className="form-control" value={selectedAdjustmentType?.adjustmentTypeId || ''} onChange={handleChangeAdjustmentType}>
                            <option value="">Select Adjustment Type</option>
                            {filteredAdjustmentTypes.map((adjType) => (
                                <option key={adjType.adjustmentTypeId} value={adjType.adjustmentTypeId}>
                                    {adjType.adjustmentTypeName}
                                </option>
                            ))}
                        </select>
                    </div>
                )}
                <div className="col-sm-3 form-group d-flex flex-column" style={{ justifyContent: documentType === DOCUMENT_TYPE.ADJUST_PLUS ? 'flex-end' : 'flex-start' }}>
                    <label>Amount <small>Thai Baht (excl VAT).</small> </label>
                    <input type="number" className="form-control" value={adjustmentAmount} onChange={handleAmountChange} />                    
                </div>
                <div className="col-sm-3 form-group d-flex flex-column" style={{ justifyContent: documentType === DOCUMENT_TYPE.ADJUST_PLUS ? 'flex-end' : 'flex-start' }}>
                    <label>VAT</label>
                    <input type="text" className="form-control" readOnly value={formatNumber(vat)} />
                </div>
                <div className="col-sm-3 form-group d-flex flex-column" style={{ justifyContent: documentType === DOCUMENT_TYPE.ADJUST_PLUS ? 'flex-end' : 'flex-start' }}>
                    <label>Total</label>
                    <input type="text" className="form-control" readOnly value={formatNumber(total)} />
                </div>
            </div>
            <div className="row">
                <div className="col-sm-6 form-group">
                    <label>Note</label>
                    <textarea className="form-control" rows={3} value={adjustmentNote} onChange={(e) => setAdjustmentNote(e.target.value)} />
                </div>
                <div className="col-sm-6 form-group d-flex" style={{ alignItems: 'flex-end' }}>
                    <button type="submit" className="btn btn-default" onClick={() => handleCreateAdjustmentRequest(documentType)} >Submit</button>
                </div>
            </div>
        </>
    );
}

export default MakeAdjustment;
