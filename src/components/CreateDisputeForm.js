import React from 'react';

const CreateDisputeForm = ({
  selectedBill,
  amount,
  setAmount,
  adjustmentTypes,
  selectedAdjustmentType,
  setSelectedAdjustmentType,
  handleCreateDispute,
  successMessage
}) => {
  return (
    <div className="xxx">

    <div className="card card-secondary">
      <div className="card-header">
        <h3 className="card-title">Dispute</h3>
      </div>

      <form>
        <div className="card-body">
          <div className="form-group">
            <label htmlFor="txtAccountNum">Account Num</label>
            <input type="text" className="form-control" id="txtAccountNum" placeholder="Account Num" value={selectedBill ? selectedBill.accountNum : ''} readOnly />
          </div>
          <div className="form-group">
            <label htmlFor="txtBillSeq">Bill Seq</label>
            <input type="text" className="form-control" id="txtBillSeq" placeholder="Bill Seq" value={selectedBill ? selectedBill.billSeq : ''} readOnly />
          </div>
          <div className="form-group">
            <label htmlFor="txtAmount">Amount</label>
            <input type="text" className="form-control" id="txtAmount" placeholder="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} />
          </div>
          <div className="form-group">
            <label>Adjustment Type</label>
            <select className="form-control" value={selectedAdjustmentType} onChange={(e) => setSelectedAdjustmentType(e.target.value)} >
              <option value="">Select Adjustment Type</option>
              {adjustmentTypes.map((adjType) => (
                <option key={adjType.adjustmentTypeId} value={adjType.adjustmentTypeId}>
                  {adjType.adjustmentTypeName}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="card-footer">
          <button type="button" onClick={handleCreateDispute} className="btn btn-secondary">Create Dispute</button>
        </div>
      </form>

      {successMessage && (
        <div className="alert alert-secondary mt-3">
          {successMessage}
        </div>
      )}
    </div>
  </div>
  );
};

export default CreateDisputeForm;