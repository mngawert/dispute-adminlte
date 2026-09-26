import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { DocumentProvider, useDocumentContext } from './DocumentContext';
import api from '../api';

jest.mock('../api', () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn()
  }
}));

const initialInvoice = {
  billSeq: 'BILL-1',
  invoiceNum: 'INV-1',
  accountNum: 'A-100',
  invoiceNetMny: '100',
  adjustedMny: '20',
  pendingAdjustmentMny: '30'
};

const refreshedInvoice = {
  ...initialInvoice,
  pendingAdjustmentMny: '10'
};

const Harness = () => {
  const {
    setSelectedAccount,
    setSelectedInvoice,
    selectedInvoice,
    deleteAdjustmentRequest
  } = useDocumentContext();

  return (
    <div>
      <button
        onClick={() => {
          setSelectedAccount({ accountNum: 'A-100' });
          setSelectedInvoice(initialInvoice);
        }}
      >
        seed
      </button>

      <button onClick={async () => await deleteAdjustmentRequest(777)}>
        delete
      </button>

      <div data-testid="pending-adjustment">{selectedInvoice?.pendingAdjustmentMny ?? ''}</div>
    </div>
  );
};

describe('DocumentContext integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('deleteAdjustmentRequest refreshes selected invoice with latest pendingAdjustmentMny', async () => {
    api.delete.mockResolvedValue({ data: { success: true } });
    api.get.mockImplementation((url) => {
      if (url === '/api/BillSummary/GetBillSummaryByAccountNum') {
        return Promise.resolve({ data: [refreshedInvoice] });
      }
      return Promise.resolve({ data: [] });
    });

    render(
      <DocumentProvider>
        <Harness />
      </DocumentProvider>
    );

    fireEvent.click(screen.getByText('seed'));
    expect(screen.getByTestId('pending-adjustment').textContent).toBe('30');

    fireEvent.click(screen.getByText('delete'));

    await waitFor(() => {
      expect(screen.getByTestId('pending-adjustment').textContent).toBe('10');
    });

    expect(api.delete).toHaveBeenCalledWith('/api/Adjustment/DeleteAdjustmentRequestByDocumentSeq', {
      params: { documentSeq: 777 }
    });

    expect(api.get).toHaveBeenCalledWith('/api/BillSummary/GetBillSummaryByAccountNum', {
      params: { accountNum: 'A-100' }
    });
  });
});
