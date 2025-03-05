import * as XLSX from 'xlsx';
import api from '../api';

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
                allAdjustmentRequests.push(...response.data);
            } catch (error) {
                console.error(`Error fetching adjustment requests for document ${documentNum}`, error);
            }
        }

        if (allAdjustmentRequests.length === 0) {
            alert('No adjustment requests to export.');
            return;
        }

        // Add adjustmentRequests sheet
        const totalDisputeMny = allAdjustmentRequests.reduce((sum, adj) => sum + adj.disputeMny, 0);
        const allAdjustmentRequestsWithTotal = [...allAdjustmentRequests, { disputeMny: totalDisputeMny }];
        const allAdjustmentRequestsSheet = XLSX.utils.json_to_sheet(allAdjustmentRequestsWithTotal);
        XLSX.utils.book_append_sheet(workbook, allAdjustmentRequestsSheet, 'Adjustments');

        // Add "Total" text in column C
        const totalRowIndex = allAdjustmentRequestsWithTotal.length + 1;
        allAdjustmentRequestsSheet[`C${totalRowIndex}`] = { t: 's', v: 'Total' };
        allAdjustmentRequestsSheet[`D${totalRowIndex}`] = { t: 'n', v: totalDisputeMny };

        // Set column widths
        const maxWidths = [];
        allAdjustmentRequestsWithTotal.forEach(row => {
            Object.keys(row).forEach((key, colIdx) => {
                const value = row[key] ? row[key].toString() : '';
                maxWidths[colIdx] = Math.max(maxWidths[colIdx] || 0, value.length);
            });
        });
        allAdjustmentRequestsSheet['!cols'] = maxWidths.map(width => ({ wch: width }));

        // Export to Excel
        XLSX.writeFile(workbook, fileName);
    } catch (error) {
        console.error('Error exporting to Excel', error);
    }
};