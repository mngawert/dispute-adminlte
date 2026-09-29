import { findMatchingInvoice, getRemainingInvoiceAmount, isAmountGreaterThan, toAmount, toMinorUnits } from './invoiceValidationUtils';

describe('invoiceValidationUtils', () => {
  test('toAmount returns 0 for nullish and parses numeric values', () => {
    expect(toAmount(undefined)).toBe(0);
    expect(toAmount(null)).toBe(0);
    expect(toAmount('10.5')).toBe(10.5);
    expect(toAmount(2)).toBe(2);
  });

  test('getRemainingInvoiceAmount computes invoiceNet - adjusted - pending', () => {
    const invoice = {
      invoiceNetMny: '100.25',
      adjustedMny: '20.1',
      pendingAdjustmentMny: '30.15'
    };

    expect(getRemainingInvoiceAmount(invoice)).toBeCloseTo(50, 8);
  });

  test('toMinorUnits normalizes decimal precision to cents', () => {
    expect(toMinorUnits(9.619999999999999)).toBe(962);
    expect(toMinorUnits('9.62')).toBe(962);
  });

  test('isAmountGreaterThan compares money values by cents', () => {
    expect(isAmountGreaterThan('9.62', 9.619999999999999)).toBe(false);
    expect(isAmountGreaterThan('9.63', 9.619999999999999)).toBe(true);
  });

  test('findMatchingInvoice matches by billSeq first', () => {
    const list = [
      { billSeq: 101, invoiceNum: 'INV-A', accountNum: 'A1' },
      { billSeq: 102, invoiceNum: 'INV-B', accountNum: 'A2' }
    ];

    const current = { billSeq: '102', invoiceNum: 'INV-X', accountNum: 'A9' };
    expect(findMatchingInvoice(list, current)).toEqual(list[1]);
  });

  test('findMatchingInvoice falls back to invoiceNum + accountNum', () => {
    const list = [
      { billSeq: 201, invoiceNum: 'INV-1', accountNum: 'A1' },
      { billSeq: 202, invoiceNum: 'INV-1', accountNum: 'A2' }
    ];

    const current = { invoiceNum: 'INV-1', accountNum: 'A2' };
    expect(findMatchingInvoice(list, current)).toEqual(list[1]);
  });

  test('findMatchingInvoice falls back to invoiceNum only', () => {
    const list = [
      { billSeq: 301, invoiceNum: 'INV-7', accountNum: 'A1' }
    ];

    const current = { invoiceNum: 'INV-7' };
    expect(findMatchingInvoice(list, current)).toEqual(list[0]);
  });

  test('findMatchingInvoice returns null when no match', () => {
    const list = [{ billSeq: 1, invoiceNum: 'INV-1', accountNum: 'A1' }];
    const current = { billSeq: 2, invoiceNum: 'INV-2', accountNum: 'A2' };

    expect(findMatchingInvoice(list, current)).toBeNull();
  });
});
