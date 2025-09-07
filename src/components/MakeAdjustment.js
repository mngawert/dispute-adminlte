import React, { useState, useEffect } from 'react';
import { CPS_MAP_HASH, DOCUMENT_TYPE } from "../contexts/Constants";
import { formatNumber } from '../utils/utils'; // Import the utility function
import api from '../api'; // Import the API

const MakeAdjustment = ({ adjustmentTypes, selectedAdjustmentType, setSelectedAdjustmentType, selectedCostedEvent, adjustmentNote, setAdjustmentNote, adjustmentAmount, setAdjustmentAmount, handleCreateAdjustmentRequest, documentType, selectedAccount }) => {
    const [filteredAdjustmentTypes, setFilteredAdjustmentTypes] = useState([]);
    const [adjustmentTypeFilter, setAdjustmentTypeFilter] = useState('');
    const [adjustmentReasons, setAdjustmentReasons] = useState([]);
    const [selectedReason, setSelectedReason] = useState('');
    const [isLoadingReasons, setIsLoadingReasons] = useState(false);
    const [reasonError, setReasonError] = useState('');

    // Fetch adjustment reasons on component mount
    useEffect(() => {
        const fetchAdjustmentReasons = async () => {
            setIsLoadingReasons(true);
            try {
                const response = await api.get('/api/AdjustmentReason/GetAllAdjustmentReasons');
                setAdjustmentReasons(response.data);
                setReasonError('');
            } catch (error) {
                console.error('Error fetching adjustment reasons:', error);
                setReasonError('Failed to load adjustment reasons. Please try again.');
            } finally {
                setIsLoadingReasons(false);
            }
        };

        fetchAdjustmentReasons();
    }, []);
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
                
                {documentType === DOCUMENT_TYPE.ADJUST_PLUS ? (
                    // For Adjust+, align the input with the dropdown from the first column
                    <div className="col-sm-3 form-group d-flex flex-column">
                        <label>Amount <small>Thai Baht (excl VAT).</small></label>
                        {/* Using flex layout with margin-top to perfectly align with dropdown */}
                        <div className="d-flex flex-column" style={{ flex: 1, justifyContent: 'flex-end' }}>
                            <input type="number" className="form-control" value={adjustmentAmount} onChange={handleAmountChange} />
                        </div>
                    </div>
                ) : (
                    // For other document types, use the existing layout
                    <div className="col-sm-3 form-group d-flex flex-column" style={{ justifyContent: 'flex-start' }}>
                        <label>Amount <small>Thai Baht (excl VAT).</small> </label>
                        <input type="number" className="form-control" value={adjustmentAmount} onChange={handleAmountChange} />                    
                    </div>
                )}
                
                {documentType === DOCUMENT_TYPE.ADJUST_PLUS ? (
                    <div className="col-sm-3 form-group d-flex flex-column">
                        <label>VAT</label>
                        {/* Using flex layout with margin-top to perfectly align with dropdown */}
                        <div className="d-flex flex-column" style={{ flex: 1, justifyContent: 'flex-end' }}>
                            <input type="text" className="form-control" readOnly value={formatNumber(vat)} />
                        </div>
                    </div>
                ) : (
                    <div className="col-sm-3 form-group d-flex flex-column" style={{ justifyContent: 'flex-start' }}>
                        <label>VAT</label>
                        <input type="text" className="form-control" readOnly value={formatNumber(vat)} />
                    </div>
                )}
                
                {documentType === DOCUMENT_TYPE.ADJUST_PLUS ? (
                    <div className="col-sm-3 form-group d-flex flex-column">
                        <label>Total</label>
                        {/* Using flex layout with margin-top to perfectly align with dropdown */}
                        <div className="d-flex flex-column" style={{ flex: 1, justifyContent: 'flex-end' }}>
                            <input type="text" className="form-control" readOnly value={formatNumber(total)} />
                        </div>
                    </div>
                ) : (
                    <div className="col-sm-3 form-group d-flex flex-column" style={{ justifyContent: 'flex-start' }}>
                        <label>Total</label>
                        <input type="text" className="form-control" readOnly value={formatNumber(total)} />
                    </div>
                )}
            </div>
            <div className="row">
                <div className="col-sm-6 form-group">
                    <label>Reason to Adjust <span className="text-danger">*</span></label>
                    {isLoadingReasons ? (
                        <div className="d-flex align-items-center">
                            <div className="spinner-border spinner-border-sm text-primary mr-2" role="status">
                                <span className="sr-only">Loading...</span>
                            </div>
                            <span>Loading reasons...</span>
                        </div>
                    ) : (
                        <>
                            <select 
                                className={`form-control ${reasonError ? 'is-invalid' : ''}`} 
                                value={selectedReason} 
                                onChange={(e) => setSelectedReason(e.target.value)}
                                required
                            >
                                <option value="">Select Reason</option>
                                {adjustmentReasons.map((reason) => (
                                    <option key={reason.reasonId} value={reason.reasonId}>
                                        {reason.reasonName}
                                    </option>
                                ))}
                            </select>
                            {reasonError && <div className="invalid-feedback">{reasonError}</div>}
                        </>
                    )}
                </div>
            </div>
            <div className="row">
                <div className="col-sm-6 form-group">
                    <label>Note</label>
                    <textarea className="form-control" rows={3} value={adjustmentNote} onChange={(e) => setAdjustmentNote(e.target.value)} />
                </div>
                <div className="col-sm-6 form-group d-flex" style={{ alignItems: 'flex-end' }}>
                    <button 
                        type="submit" 
                        className="btn btn-default" 
                        onClick={() => {
                            if (!selectedReason) {
                                setReasonError('Please select a reason to adjust');
                                return;
                            }
                            handleCreateAdjustmentRequest(documentType, selectedReason);
                        }} 
                        disabled={!selectedReason || isLoadingReasons}
                    >
                        Submit
                    </button>
                </div>
            </div>
        </>
    );
}

export default MakeAdjustment;
