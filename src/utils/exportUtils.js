import * as XLSX from 'xlsx';
import api from '../api';

const headers = {
    accountNum: 'Account Num',
    disputeDtm: 'Dispute Date Time',
    billSeq: 'Bill Sequence',
    disputeMny: 'Dispute Money',
    productId: 'Product ID',
    cpsId: 'CPS ID',
    productSeq: 'Product Sequence',
    eventRef: 'Event Reference',
    eventTypeId: 'Event Type ID',
    adjustmentTypeId: 'Adjustment Type ID',
    serviceNum: 'Service Number',
    invoiceNum: 'Invoice Number',
    disputeSeq: 'Dispute Sequence',
    adjustmentSeq: 'Adjustment Sequence',
    documentNum: 'Document Number',
    requestStatus: 'Request Status',
    documentSeq: 'Document Sequence',
    adjustmentTypeName: 'Adjustment Type Name',
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

export const exportAdjustmentRequestsToExcel = async (documentNums, fileName) => {
    try {
        const workbook = XLSX.utils.book_new();

        // Fetch adjustment requests for each document
        const allAdjustmentRequests = [];
        for (const documentNum of documentNums) {
            try {
                const response = await api.get(`/api/Adjustment/GetAdjustmentRequests`, {
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

        // Add adjustmentRequests sheet
        const totalDisputeMny = allAdjustmentRequests.reduce((sum, adj) => sum + (adj.disputeMny || 0), 0);
        const allAdjustmentRequestsWithTotal = [...convertedData, { 'Dispute Money': totalDisputeMny }];
        const allAdjustmentRequestsSheet = XLSX.utils.json_to_sheet(allAdjustmentRequestsWithTotal);
        XLSX.utils.book_append_sheet(workbook, allAdjustmentRequestsSheet, 'Adjustments');

        // Add "Total" text in column C
        const totalRowIndex = allAdjustmentRequestsWithTotal.length + 1;
        allAdjustmentRequestsSheet[`C${totalRowIndex}`] = { t: 's', v: 'Total' };
        allAdjustmentRequestsSheet[`D${totalRowIndex}`] = { t: 'n', v: totalDisputeMny };

        // Set column widths considering headers
        const headerKeys = Object.keys(headers);
        const maxWidths = headerKeys.map(key => headers[key].length);
        allAdjustmentRequestsWithTotal.forEach(row => {
            Object.keys(row).forEach((key, colIdx) => {
                const value = row[key] ? row[key].toString() : '';
                maxWidths[colIdx] = Math.max(maxWidths[colIdx], value.length);
            });
        });
        allAdjustmentRequestsSheet['!cols'] = maxWidths.map(width => ({ wch: width }));

        // Export to Excel
        XLSX.writeFile(workbook, fileName);
    } catch (error) {
        console.error('Error exporting to Excel', error);
    }
};