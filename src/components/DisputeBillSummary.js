import React from 'react';

const DisputeBillSummary = ({ billsummary, handleSelectBill, selectedBill }) => {
  return (
    <div className="xxx">
      {billsummary.length > 0 && (
        <div style={{ maxHeight: '400px', overflowY: 'scroll' }}>
          <table id="billSummaryTable" className="table table-bordered table-striped">
            <thead>
              <tr>
                <th>AccountNum</th>
                <th>BillSeq</th>
                <th>BillAmount</th>
              </tr>
            </thead>
            <tbody>
              {billsummary.map((bill, index) => (
                <tr key={index} onClick={() => handleSelectBill(bill)} className={selectedBill?.invoiceNum === bill.invoiceNum ? 'selected' : ''}>
                  <td>{bill.accountNum}</td>
                  <td>{bill.billSeq}</td>
                  <td>{bill.invoiceNetMny}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default DisputeBillSummary;