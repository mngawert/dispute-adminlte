export const toAmount = (value) => Number(value ?? 0);

export const toMinorUnits = (value) => Math.round((toAmount(value) + Number.EPSILON) * 100);

export const isAmountGreaterThan = (leftAmount, rightAmount) => toMinorUnits(leftAmount) > toMinorUnits(rightAmount);

export const getRemainingInvoiceAmount = (invoice) => {
  const invoiceNetAmount = toAmount(invoice?.invoiceNetMny);
  const adjustedAmount = toAmount(invoice?.adjustedMny);
  const pendingAdjustmentAmount = toAmount(invoice?.pendingAdjustmentMny);
  return invoiceNetAmount - adjustedAmount - pendingAdjustmentAmount;
};

export const findMatchingInvoice = (invoiceList, currentInvoice) => {
  if (!currentInvoice || Object.keys(currentInvoice).length === 0) {
    return null;
  }

  const list = invoiceList || [];
  const currentBillSeq = currentInvoice?.billSeq;
  const currentInvoiceNum = currentInvoice?.invoiceNum;
  const currentAccountNum = currentInvoice?.accountNum;

  if (currentBillSeq !== undefined && currentBillSeq !== null) {
    const byBillSeq = list.find((invoice) => String(invoice?.billSeq) === String(currentBillSeq));
    if (byBillSeq) {
      return byBillSeq;
    }
  }

  if (currentInvoiceNum !== undefined && currentInvoiceNum !== null) {
    const byInvoiceNumAndAccount = list.find((invoice) =>
      String(invoice?.invoiceNum) === String(currentInvoiceNum) &&
      String(invoice?.accountNum) === String(currentAccountNum)
    );
    if (byInvoiceNumAndAccount) {
      return byInvoiceNumAndAccount;
    }

    const byInvoiceNum = list.find((invoice) => String(invoice?.invoiceNum) === String(currentInvoiceNum));
    if (byInvoiceNum) {
      return byInvoiceNum;
    }
  }

  return null;
};
