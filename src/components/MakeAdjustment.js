import { CPS_MAP_HASH } from "../contexts/Constants";

const MakeAdjustment = ({ adjustmentTypes, selectedAdjustmentType, setSelectedAdjustmentType, selectedCostedEvent, adjustmentNote, setAdjustmentNote, adjustmentAmount, setAdjustmentAmount, handleCreateAdjustmentRequest, documentType, selectedAccount }) => {

    const handleChangeAdjustmentType = (e) => {
        const selectedAdjustmentTypeId = e.target.value;
        const selectedAdjustmentType = adjustmentTypes.find((adjType) => adjType.adjustmentTypeId === Number(selectedAdjustmentTypeId));
        setSelectedAdjustmentType(selectedAdjustmentType);
    }

    const handleAmountChange = (e) => {
        const value = e.target.value;
        if (!isNaN(value) && value >= 1 && value <= 9999) {
            setAdjustmentAmount(value);
        }
    }

    const vat = selectedAccount ? (adjustmentAmount * (CPS_MAP_HASH[selectedAccount.cpsId] / 100)).toFixed(2) : 0;
    const total = selectedAccount ? (adjustmentAmount * (1 + CPS_MAP_HASH[selectedAccount.cpsId] / 100)).toFixed(2) : 0;

    return (
        <div className="card">
            <div className="card-body">
                <div className="row">
                    <div className="col-sm-3 form-group">
                        <label>Make adjustment type</label>
                        <select className="form-control" value={selectedAdjustmentType?.adjustmentTypeId || ''} onChange={(e) => handleChangeAdjustmentType(e)}>
                            <option value="">Select Adjustment Type</option>
                            {adjustmentTypes.map((adjType) => (
                                <option key={adjType.adjustmentTypeId} value={adjType.adjustmentTypeId}>
                                    {adjType.adjustmentTypeName}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="col-sm-3 form-group">
                        <label>Amount</label>
                        <input type="number" className="form-control" value={adjustmentAmount} onChange={handleAmountChange} min="1" max="9999" />
                        <small>Thai Baht (excl VAT).</small>
                    </div>
                    <div className="col-sm-3 form-group">
                        <label>VAT</label>
                        <input type="text" className="form-control" readOnly value={vat} />
                    </div>
                    <div className="col-sm-3 form-group">
                        <label>Total</label>
                        <input type="text" className="form-control" readOnly value={total} />
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
            </div>
        </div>
    );
}

export default MakeAdjustment;
