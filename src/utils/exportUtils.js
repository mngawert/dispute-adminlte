import * as XLSX from 'xlsx';
import api from '../api';

const headers = {
    documentNum: 'Document Number',
    createdBy: 'Created By',
    createdDtm: 'Created Date Time',
    reviewedBy: 'Reviewed By',
    reviewedDtm: 'Reviewed Date Time',
    approvedBy: 'Approved By',
    approvedDtm: 'Approved Date Time',
    financeReviewedBy: 'Finance Reviewed By',
    financeReviewedDtm: 'Finance Reviewed Date Time',
    sapDocNum: 'SAP Doc Num',
    sapDocDate: 'SAP Doc Date',
    idx: 'Index',
    accountNum: 'Account Number',
    invoiceNum: 'Invoice Number',
    serviceNum: 'Service Number',
    adjustmentTypeName: 'Adjustment Type',
    amount: 'Amount',
    vat: 'VAT',
    total: 'Total',
    status: 'Status',
    comments: 'Comments',
    errorMessage: 'Error Message',
    // Add other headers as needed
};

const convertHeaders = (data) => {
    return data.map(row => {
        const newRow = {};
        Object.keys(row).forEach(key => {
            newRow[headers[key] || key] = row[key];
        });
        return newRow;
    });
};

export const exportToExcel = (data, fileName) => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Report");
    
    // Auto-size columns
    const max_width = data.reduce((w, r) => {
      Object.keys(r).forEach(k => {
        const value = r[k] == null ? '' : r[k].toString();
        w[k] = Math.max(w[k] || 0, value.length);
      });
      return w;
    }, {});
    
    worksheet['!cols'] = Object.keys(max_width).map(k => ({ wch: max_width[k] }));
    
    XLSX.writeFile(workbook, fileName);
};

export const exportAdjustmentRequestsToExcel = async (documentNums, fileName) => {
    try {
        const workbook = XLSX.utils.book_new();

        // Fetch adjustment requests for each document
        const allAdjustmentRequests = [];
        for (const documentNum of documentNums) {
            try {
                const response = await api.get(`/api/Adjustment/GetAdjustmentRequestsReport`, {
                    params: {
                        documentNum: documentNum
                    }
                });
                if (response.data.length > 0) {
                    allAdjustmentRequests.push(...response.data);
                    // Add an empty row to separate data for each document
                    allAdjustmentRequests.push({});
                }
            } catch (error) {
                console.error(`Error fetching adjustment requests for document ${documentNum}`, error);
            }
        }

        if (allAdjustmentRequests.length === 0) {
            alert('No adjustment requests to export.');
            return;
        }

        // Remove the last empty row
        if (allAdjustmentRequests[allAdjustmentRequests.length - 1] && Object.keys(allAdjustmentRequests[allAdjustmentRequests.length - 1]).length === 0) {
            allAdjustmentRequests.pop();
        }

        // Add an empty row before the total row
        allAdjustmentRequests.push({});

        // Convert headers
        const convertedData = convertHeaders(allAdjustmentRequests);

        // Calculate totals
        const totalAmount = allAdjustmentRequests.reduce((sum, adj) => sum + (adj.amount || 0), 0);
        const totalVAT = allAdjustmentRequests.reduce((sum, adj) => sum + (adj.vat || 0), 0);
        const totalOverall = allAdjustmentRequests.reduce((sum, adj) => sum + (adj.total || 0), 0);

        // Add totals row
        const allAdjustmentRequestsWithTotal = [
            ...convertedData,
            {
                'Adjustment Type': 'Summary',
                'Amount': totalAmount,
                'VAT': totalVAT,
                'Total': totalOverall
            }
        ];

        // Add adjustmentRequests sheet
        const allAdjustmentRequestsSheet = XLSX.utils.json_to_sheet(allAdjustmentRequestsWithTotal);
        XLSX.utils.book_append_sheet(workbook, allAdjustmentRequestsSheet, 'Adjustments');

        // Set column widths considering headers and adding extra width
        const headerKeys = Object.keys(headers);
        const maxWidths = headerKeys.map(key => headers[key].length + 5); // Adding extra width
        allAdjustmentRequestsWithTotal.forEach(row => {
            Object.keys(row).forEach((key, colIdx) => {
                const value = row[key] ? row[key].toString() : '';
                maxWidths[colIdx] = Math.max(maxWidths[colIdx], value.length + 5); // Adding extra width
            });
        });
        allAdjustmentRequestsSheet['!cols'] = maxWidths.map(width => ({ wch: width }));

        // Export to Excel
        XLSX.writeFile(workbook, fileName);
    } catch (error) {
        console.error('Error exporting to Excel', error);
    }
};