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
    accountNumBPlus: 'Account Number B1+',
    serviceNumBPlus: 'Service Number B1+',
    adjustmentTypeNameBPlus: 'Adjustment Type B1+'
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

        // Apply absolute values to amount, vat, and total fields
        const allAdjustmentRequestsWithAbsValues = allAdjustmentRequests.map(adj => {
            if (Object.keys(adj).length === 0) return adj; // Keep empty rows as is
            return {
                ...adj,
                amount: adj.amount !== null && adj.amount !== undefined ? Math.abs(adj.amount) : adj.amount,
                vat: adj.vat !== null && adj.vat !== undefined ? Math.abs(adj.vat) : adj.vat,
                total: adj.total !== null && adj.total !== undefined ? Math.abs(adj.total) : adj.total
            };
        });

        // Add an empty row before the total row
        allAdjustmentRequestsWithAbsValues.push({});

        // Convert headers
        const convertedData = convertHeaders(allAdjustmentRequestsWithAbsValues);

        // Calculate totals using absolute values with proper rounding to avoid discrepancies
        const totalAmount = allAdjustmentRequests.reduce((sum, adj) => {
            if (adj.amount !== null && adj.amount !== undefined) {
                const roundedAmount = parseFloat(Math.abs(adj.amount).toFixed(2));
                return sum + roundedAmount;
            }
            return sum;
        }, 0);
        
        const totalVAT = allAdjustmentRequests.reduce((sum, adj) => {
            if (adj.vat !== null && adj.vat !== undefined) {
                const roundedVAT = parseFloat(Math.abs(adj.vat).toFixed(2));
                return sum + roundedVAT;
            }
            return sum;
        }, 0);
        
        const totalOverall = allAdjustmentRequests.reduce((sum, adj) => {
            if (adj.total !== null && adj.total !== undefined) {
                const roundedTotal = parseFloat(Math.abs(adj.total).toFixed(2));
                return sum + roundedTotal;
            }
            return sum;
        }, 0);

        // Add totals row
        const allAdjustmentRequestsWithTotal = [
            ...convertedData,
            {
                'Adjustment Type': 'Summary',
                'Amount': parseFloat(totalAmount.toFixed(2)),
                'VAT': parseFloat(totalVAT.toFixed(2)),
                'Total': parseFloat(totalOverall.toFixed(2))
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

// Helper function to format date for display
const formatDateForExport = (dateString) => {
    if (!dateString) return '';
    try {
        const date = new Date(dateString);
        if (!isNaN(date.getTime())) {
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const year = date.getFullYear();
            return `${day}/${month}/${year}`;
        }
        return '';
    } catch (error) {
        return '';
    }
};

// Helper function to format datetime for display
const formatDateTimeForExport = (dateString) => {
    if (!dateString) return '';
    try {
        const date = new Date(dateString);
        if (!isNaN(date.getTime())) {
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const year = date.getFullYear();
            const hours = String(date.getHours()).padStart(2, '0');
            const minutes = String(date.getMinutes()).padStart(2, '0');
            const seconds = String(date.getSeconds()).padStart(2, '0');
            return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
        }
        return '';
    } catch (error) {
        return '';
    }
};

// Helper function to format number for display
const formatNumberForExport = (num) => {
    if (num === null || num === undefined) return '0.00';
    return parseFloat(num).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

// Collect all notes from document and adjustment requests
const collectNotes = (doc, adjustmentRequests) => {
    const notes = [];
    adjustmentRequests.forEach(adj => {
        if (adj.note) notes.push(`[Creator]: ${adj.note}`);
    });
    if (doc.reviewNote) notes.push(`[Reviewer]: ${doc.reviewNote}`);
    if (doc.approveNote) notes.push(`[Approver]: ${doc.approveNote}`);
    if (doc.financeNote) notes.push(`[Financial Reviewer]: ${doc.financeNote}`);
    if (doc.retriedNote) notes.push(`[Retrier]: ${doc.retriedNote}`);
    if (doc.cancelNote) notes.push(`[Canceller]: ${doc.cancelNote}`);
    // Remove duplicates
    return Array.from(new Set(notes));
};

// Export document details to PDF
export async function exportDocumentToPDF(doc, adjustmentRequests) {
    const pdfMakeModule = await import('pdfmake/build/pdfmake');
    const pdfFontsModule = await import('pdfmake/build/vfs_fonts');
    const { CPS_MAP_HASH } = await import('../contexts/Constants');
    
    const pdfMake = pdfMakeModule.default || pdfMakeModule;
    const pdfFonts = pdfFontsModule.default || pdfFontsModule;
    
    if (pdfFonts.pdfMake && pdfFonts.pdfMake.vfs) {
        pdfMake.vfs = pdfFonts.pdfMake.vfs;
    } else {
        pdfMake.vfs = pdfFonts.vfs || pdfFonts;
    }
    
    try {
        const isB1PlusMinus = doc.documentTypeDesc === 'B1+/-';
        const printDate = formatDateForExport(new Date().toISOString());

        // Calculate totals
        let totalAmount = 0, totalVAT = 0, totalAll = 0;
        adjustmentRequests.forEach(adj => {
            const amount = parseFloat(Math.abs(adj.disputeMny).toFixed(2));
            const vat = parseFloat(Math.abs(adj.disputeMny * (CPS_MAP_HASH[adj.cpsId] / 100)).toFixed(2));
            const tot = parseFloat(Math.abs(adj.disputeMny * (1 + CPS_MAP_HASH[adj.cpsId] / 100)).toFixed(2));
            totalAmount += amount;
            totalVAT += vat;
            totalAll += tot;
        });

        // === Build adjustment table ===
        const baseHeaders = [
            { text: 'ลำดับ', style: 'tableHeader', alignment: 'center' },
            { text: 'Account\nNumber', style: 'tableHeader', alignment: 'center' },
            { text: 'Invoice\nNumber', style: 'tableHeader', alignment: 'center' },
            { text: 'Service\nNumber', style: 'tableHeader', alignment: 'center' },
            { text: 'Adjustment Type', style: 'tableHeader', alignment: 'center' },
            { text: 'Status', style: 'tableHeader', alignment: 'center' },
            { text: 'Error\nMessages', style: 'tableHeader', alignment: 'center' },
            { text: 'Amount', style: 'tableHeader', alignment: 'center' },
            { text: 'VAT', style: 'tableHeader', alignment: 'center' },
            { text: 'Total', style: 'tableHeader', alignment: 'center' }
        ];

        if (isB1PlusMinus) {
            baseHeaders[1].text = 'B1- Account\nNumber';
            baseHeaders[2].text = 'B1- Invoice\nNumber';
            baseHeaders[3].text = 'B1- Service\nNumber';
            baseHeaders.splice(7, 0,
                { text: 'B1+ Account\nNumber', style: 'tableHeader', alignment: 'center' },
                { text: 'B1+ Service\nNumber', style: 'tableHeader', alignment: 'center' }
            );
        }

        const tableBody = [baseHeaders];
        const totalCols = baseHeaders.length;

        adjustmentRequests.forEach((adj, idx) => {
            const amount = Math.abs(adj.disputeMny);
            const vat = Math.abs(adj.disputeMny * (CPS_MAP_HASH[adj.cpsId] / 100));
            const tot = Math.abs(adj.disputeMny * (1 + CPS_MAP_HASH[adj.cpsId] / 100));

            const row = [
                { text: String(idx + 1), alignment: 'center' },
                adj.accountNum || '',
                adj.invoiceNum || '',
                adj.serviceNum || '',
                adj.adjustmentTypeName || '',
                adj.requestStatus || ''
            ];

            if (isB1PlusMinus) {
                row.push(adj.accountNumBPlus || '', adj.serviceNumBPlus || '');
            }

            row.push(
                adj.errorMessages || '',
                { text: formatNumberForExport(amount), alignment: 'right' },
                { text: formatNumberForExport(vat), alignment: 'right' },
                { text: formatNumberForExport(tot), alignment: 'right' }
            );
            tableBody.push(row);
        });

        // Totals row
        const summaryColSpan = totalCols - 3;
        const totalsRow = [
            { text: 'รวม', colSpan: summaryColSpan, alignment: 'right', bold: true, color: '#dc3545' }
        ];
        for (let i = 1; i < summaryColSpan; i++) totalsRow.push({});
        totalsRow.push(
            { text: formatNumberForExport(totalAmount), alignment: 'right', bold: true, color: '#dc3545' },
            { text: formatNumberForExport(totalVAT), alignment: 'right', bold: true, color: '#dc3545' },
            { text: formatNumberForExport(totalAll), alignment: 'right', bold: true, color: '#dc3545' }
        );
        tableBody.push(totalsRow);

        const tableWidths = isB1PlusMinus
            ? ['auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto']
            : ['auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto'];

        // === Build notes ===
        const notes = collectNotes(doc, adjustmentRequests);

        // === Build approval table ===
        const approvalRow1 = [
            {
                stack: [
                    { text: '1)', bold: true },
                    { text: '' },
                    { text: [{ text: 'Created by : ', bold: false }, { text: doc.createdByName || '[Username]', color: '#dc3545' }] },
                    { text: ['วันที่ : ', { text: formatDateTimeForExport(doc.createdDtm) || 'dd/mm/yyyy hh:mm:ss', color: '#dc3545' }] }
                ],
                border: [true, true, true, true]
            },
            {
                stack: [
                    { text: '2)', bold: true },
                    { text: '' },
                    { text: [{ text: 'Reviewed by : ' }, { text: doc.reviewedByName || '[Username]', color: '#dc3545' }] },
                    { text: ['วันที่ : ', { text: formatDateTimeForExport(doc.reviewedDtm) || 'dd/mm/yyyy hh:mm:ss', color: '#dc3545' }] }
                ],
                border: [true, true, true, true]
            },
            {
                stack: [
                    { text: '3)', bold: true },
                    { text: '' },
                    { text: [{ text: 'Approved by : ' }, { text: doc.approvedByName || '[Username]', color: '#dc3545' }] },
                    { text: ['วันที่ : ', { text: formatDateTimeForExport(doc.approvedDtm) || 'dd/mm/yyyy hh:mm:ss', color: '#dc3545' }] }
                ],
                border: [true, true, true, true]
            },
            {
                stack: [
                    { text: '4)', bold: true },
                    { text: '' },
                    { text: [{ text: 'Finance by : ' }, { text: doc.financeReviewedByName || '[Username]', color: '#dc3545' }] },
                    { text: ['วันที่ : ', { text: formatDateTimeForExport(doc.financeReviewedDtm) || 'dd/mm/yyyy hh:mm:ss', color: '#dc3545' }] }
                ],
                border: [true, true, true, true]
            }
        ];

        const approvalRow2 = [
            { text: '', border: [false, false, false, false] },
            {
                stack: [
                    { text: '' },
                    { text: [{ text: 'Rejected by : ' }, { text: doc.rejectedByName || '[Username]', color: '#dc3545' }] },
                    { text: ['วันที่ : ', { text: formatDateTimeForExport(doc.rejectedDtm) || 'dd/mm/yyyy hh:mm:ss', color: '#dc3545' }] }
                ],
                border: [true, true, true, true]
            },
            {
                stack: [
                    { text: '' },
                    { text: [{ text: 'Retried by : ' }, { text: doc.retriedByName || '[Username]', color: '#dc3545' }] },
                    { text: ['วันที่ : ', { text: formatDateTimeForExport(doc.retriedDtm) || 'dd/mm/yyyy hh:mm:ss', color: '#dc3545' }] }
                ],
                border: [true, true, true, true]
            },
            {
                stack: [
                    { text: '' },
                    { text: [{ text: 'Cancelled by : ' }, { text: doc.canceledByName || '[Username]', color: '#dc3545' }] },
                    { text: ['วันที่ : ', { text: formatDateTimeForExport(doc.canceledDtm) || 'dd/mm/yyyy hh:mm:ss', color: '#dc3545' }] }
                ],
                border: [true, true, true, true]
            }
        ];

        // === Assemble document definition ===
        const docDefinition = {
            pageOrientation: 'landscape',
            pageMargins: [40, 40, 40, 50],
            footer: function(currentPage, pageCount) {
                return {
                    columns: [
                        { text: `เอกสาร : DR01 (NT Adjustor)  จัดพิมพ์วันที่ : ${printDate}`, fontSize: 8, margin: [40, 0, 0, 0] },
                        { text: `Page ${currentPage}/${pageCount}`, alignment: 'right', fontSize: 8, margin: [0, 0, 40, 0] }
                    ]
                };
            },
            content: [
                { text: 'รายงานข้อมูลการปรับปรุงค่าใช้บริการ', style: 'header', alignment: 'center' },
                { text: '\n' },
                { text: [{ text: 'เลขที่เอกสารปรับปรุงบิล (Document Sequence) : ', bold: true }, { text: doc.documentNum, color: '#dc3545' }], fontSize: 10 },
                {
                    columns: [
                        { text: [{ text: 'ประเภทของการปรับปรุงบิล : ', bold: true }, { text: doc.documentTypeDesc, color: '#dc3545' }], fontSize: 10, width: '35%' },
                        { text: [{ text: 'สร้างเมื่อ : ', bold: true }, { text: formatDateTimeForExport(doc.createdDtm), color: '#dc3545' }], fontSize: 10, width: '35%' },
                        { text: [{ text: 'Location : ', bold: true }, { text: doc.homeLocationCode, color: '#dc3545' }], fontSize: 10, width: '30%' }
                    ]
                },
                { text: '\n' },
                { text: `รายละเอียด จำนวน ${adjustmentRequests.length} รายการ`, fontSize: 10 },
                {
                    table: {
                        headerRows: 1,
                        widths: tableWidths,
                        body: tableBody
                    },
                    layout: {
                        fillColor: function (rowIndex) {
                            return (rowIndex === 0) ? '#f0f0f0' : null;
                        },
                        hLineWidth: function() { return 0.5; },
                        vLineWidth: function() { return 0.5; },
                        hLineColor: function() { return '#cccccc'; },
                        vLineColor: function() { return '#cccccc'; }
                    },
                    fontSize: 8
                },
                { text: '\n' },
                ...(notes.length > 0 ? [
                    { text: [{ text: 'เหตุผล : ', bold: true }, { text: notes.join(' | '), color: '#dc3545', fontSize: 9 }], fontSize: 10 }
                ] : []),
                { text: '\n' },
                { text: 'ขั้นตอนการอนุมัติ', bold: true, fontSize: 10 },
                { text: '\n' },
                {
                    table: {
                        widths: ['25%', '25%', '25%', '25%'],
                        body: [approvalRow1]
                    },
                    layout: {
                        hLineWidth: function() { return 0.5; },
                        vLineWidth: function() { return 0.5; },
                        hLineColor: function() { return '#cccccc'; },
                        vLineColor: function() { return '#cccccc'; }
                    },
                    fontSize: 9
                },
                { text: '\n' },
                {
                    table: {
                        widths: ['25%', '25%', '25%', '25%'],
                        body: [approvalRow2]
                    },
                    layout: {
                        hLineWidth: function(i, node) {
                            return 0.5;
                        },
                        vLineWidth: function(i, node) {
                            return 0.5;
                        },
                        hLineColor: function() { return '#cccccc'; },
                        vLineColor: function() { return '#cccccc'; }
                    },
                    fontSize: 9
                }
            ],
            styles: {
                header: { fontSize: 14, bold: true },
                tableHeader: { bold: true, fontSize: 8, fillColor: '#f0f0f0' }
            }
        };

        const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
        const fileName = `Document_${doc.documentNum}_${timestamp}.pdf`;
        pdfMake.createPdf(docDefinition).download(fileName);
    } catch (error) {
        console.error('Error exporting to PDF:', error);
        throw error;
    }
}

// Export document details to DOCX
export async function exportDocumentToDOCX(doc, adjustmentRequests) {
    const { Document: DocxDocument, Packer, Paragraph, Table, TableRow, TableCell, WidthType, AlignmentType, TextRun, HeadingLevel, BorderStyle, PageOrientation, Footer, PageNumber } = await import('docx');
    const fileSaverModule = await import('file-saver');
    const saveAs = fileSaverModule.default || fileSaverModule.saveAs;
    const { CPS_MAP_HASH } = await import('../contexts/Constants');
    
    try {
        const isB1PlusMinus = doc.documentTypeDesc === 'B1+/-';
        const printDate = formatDateForExport(new Date().toISOString());

        // Calculate totals
        let totalAmount = 0, totalVAT = 0, totalAll = 0;
        adjustmentRequests.forEach(adj => {
            const amount = parseFloat(Math.abs(adj.disputeMny).toFixed(2));
            const vat = parseFloat(Math.abs(adj.disputeMny * (CPS_MAP_HASH[adj.cpsId] / 100)).toFixed(2));
            const tot = parseFloat(Math.abs(adj.disputeMny * (1 + CPS_MAP_HASH[adj.cpsId] / 100)).toFixed(2));
            totalAmount += amount;
            totalVAT += vat;
            totalAll += tot;
        });

        const thinBorder = {
            top: { style: BorderStyle.SINGLE, size: 1, color: 'CCCCCC' },
            bottom: { style: BorderStyle.SINGLE, size: 1, color: 'CCCCCC' },
            left: { style: BorderStyle.SINGLE, size: 1, color: 'CCCCCC' },
            right: { style: BorderStyle.SINGLE, size: 1, color: 'CCCCCC' }
        };

        const noBorder = {
            top: { style: BorderStyle.NONE },
            bottom: { style: BorderStyle.NONE },
            left: { style: BorderStyle.NONE },
            right: { style: BorderStyle.NONE }
        };

        const redRun = (text) => new TextRun({ text: text || '', color: 'DC3545' });
        const boldRun = (text) => new TextRun({ text, bold: true });
        const normalRun = (text) => new TextRun({ text: text || '' });

        // === Adjustment Table ===
        const headerTexts = isB1PlusMinus
            ? ['ลำดับ', 'B1- Account\nNumber', 'B1- Invoice\nNumber', 'B1- Service\nNumber', 'Adjustment Type', 'Status', 'B1+ Account\nNumber', 'B1+ Service\nNumber', 'Error Messages', 'Amount', 'VAT', 'Total']
            : ['ลำดับ', 'Account\nNumber', 'Invoice\nNumber', 'Service\nNumber', 'Adjustment Type', 'Status', 'Error Messages', 'Amount', 'VAT', 'Total'];

        const headerRow = new TableRow({
            children: headerTexts.map(h => new TableCell({
                children: [new Paragraph({ children: [boldRun(h)], alignment: AlignmentType.CENTER })],
                borders: thinBorder,
                shading: { fill: 'F0F0F0' }
            }))
        });

        const dataRows = adjustmentRequests.map((adj, idx) => {
            const amount = Math.abs(adj.disputeMny);
            const vat = Math.abs(adj.disputeMny * (CPS_MAP_HASH[adj.cpsId] / 100));
            const tot = Math.abs(adj.disputeMny * (1 + CPS_MAP_HASH[adj.cpsId] / 100));

            const cells = [
                new TableCell({ children: [new Paragraph({ text: String(idx + 1), alignment: AlignmentType.CENTER })], borders: thinBorder }),
                new TableCell({ children: [new Paragraph(adj.accountNum || '')], borders: thinBorder }),
                new TableCell({ children: [new Paragraph(adj.invoiceNum || '')], borders: thinBorder }),
                new TableCell({ children: [new Paragraph(adj.serviceNum || '')], borders: thinBorder }),
                new TableCell({ children: [new Paragraph(adj.adjustmentTypeName || '')], borders: thinBorder }),
                new TableCell({ children: [new Paragraph(adj.requestStatus || '')], borders: thinBorder })
            ];

            if (isB1PlusMinus) {
                cells.push(
                    new TableCell({ children: [new Paragraph(adj.accountNumBPlus || '')], borders: thinBorder }),
                    new TableCell({ children: [new Paragraph(adj.serviceNumBPlus || '')], borders: thinBorder })
                );
            }

            cells.push(
                new TableCell({ children: [new Paragraph(adj.errorMessages || '')], borders: thinBorder }),
                new TableCell({ children: [new Paragraph({ text: formatNumberForExport(amount), alignment: AlignmentType.RIGHT })], borders: thinBorder }),
                new TableCell({ children: [new Paragraph({ text: formatNumberForExport(vat), alignment: AlignmentType.RIGHT })], borders: thinBorder }),
                new TableCell({ children: [new Paragraph({ text: formatNumberForExport(tot), alignment: AlignmentType.RIGHT })], borders: thinBorder })
            );

            return new TableRow({ children: cells });
        });

        // Totals row
        const summaryColSpan = headerTexts.length - 3;
        const totalRowCells = [
            new TableCell({
                children: [new Paragraph({ children: [new TextRun({ text: 'รวม', bold: true, color: 'DC3545' })], alignment: AlignmentType.RIGHT })],
                columnSpan: summaryColSpan,
                borders: thinBorder
            }),
            new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: formatNumberForExport(totalAmount), bold: true, color: 'DC3545' })], alignment: AlignmentType.RIGHT })], borders: thinBorder }),
            new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: formatNumberForExport(totalVAT), bold: true, color: 'DC3545' })], alignment: AlignmentType.RIGHT })], borders: thinBorder }),
            new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: formatNumberForExport(totalAll), bold: true, color: 'DC3545' })], alignment: AlignmentType.RIGHT })], borders: thinBorder })
        ];

        const adjTable = new Table({
            rows: [headerRow, ...dataRows, new TableRow({ children: totalRowCells })],
            width: { size: 100, type: WidthType.PERCENTAGE }
        });

        // === Notes ===
        const notes = collectNotes(doc, adjustmentRequests);

        // === Approval Table Row 1 ===
        const makeApprovalCell = (label, name, dtm, numbered) => {
            const children = [];
            if (numbered) children.push(new Paragraph({ children: [boldRun(numbered)] }));
            children.push(new Paragraph({ text: '' }));
            children.push(new Paragraph({ children: [normalRun(`${label} : `), redRun(name || '[Username]')] }));
            children.push(new Paragraph({ children: [normalRun('วันที่ : '), redRun(formatDateTimeForExport(dtm) || 'dd/mm/yyyy hh:mm:ss')] }));
            return new TableCell({ children, borders: thinBorder });
        };

        const approvalTable1 = new Table({
            rows: [new TableRow({
                children: [
                    makeApprovalCell('Created by', doc.createdByName, doc.createdDtm, '1)'),
                    makeApprovalCell('Reviewed by', doc.reviewedByName, doc.reviewedDtm, '2)'),
                    makeApprovalCell('Approved by', doc.approvedByName, doc.approvedDtm, '3)'),
                    makeApprovalCell('Finance by', doc.financeReviewedByName, doc.financeReviewedDtm, '4)')
                ]
            })],
            width: { size: 100, type: WidthType.PERCENTAGE }
        });

        const approvalTable2 = new Table({
            rows: [new TableRow({
                children: [
                    new TableCell({ children: [new Paragraph('')], borders: noBorder }),
                    makeApprovalCell('Rejected by', doc.rejectedByName, doc.rejectedDtm, null),
                    makeApprovalCell('Retried by', doc.retriedByName, doc.retriedDtm, null),
                    makeApprovalCell('Cancelled by', doc.canceledByName, doc.canceledDtm, null)
                ]
            })],
            width: { size: 100, type: WidthType.PERCENTAGE }
        });

        // === Assemble document ===
        const docContent = [
            new Paragraph({ children: [boldRun('รายงานข้อมูลการปรับปรุงค่าใช้บริการ')], alignment: AlignmentType.CENTER, spacing: { after: 200 } }),
            new Paragraph({ text: '' }),
            new Paragraph({ children: [boldRun('เลขที่เอกสารปรับปรุงบิล (Document Sequence) : '), redRun(doc.documentNum)] }),
            new Paragraph({
                children: [
                    boldRun('ประเภทของการปรับปรุงบิล : '), redRun(doc.documentTypeDesc),
                    normalRun('                    '),
                    boldRun('สร้างเมื่อ : '), redRun(formatDateTimeForExport(doc.createdDtm)),
                    normalRun('                    '),
                    boldRun('Location : '), redRun(doc.homeLocationCode)
                ]
            }),
            new Paragraph({ text: '' }),
            new Paragraph({ children: [normalRun(`รายละเอียด จำนวน ${adjustmentRequests.length} รายการ`)] }),
            adjTable,
            new Paragraph({ text: '' })
        ];

        if (notes.length > 0) {
            docContent.push(new Paragraph({ children: [boldRun('เหตุผล : '), redRun(notes.join(' | '))] }));
        }

        docContent.push(
            new Paragraph({ text: '' }),
            new Paragraph({ children: [boldRun('ขั้นตอนการอนุมัติ')] }),
            new Paragraph({ text: '' }),
            approvalTable1,
            new Paragraph({ text: '' }),
            approvalTable2,
            new Paragraph({ text: '' }),
            new Paragraph({ children: [normalRun(`เอกสาร : DR01 (NT Adjustor)  จัดพิมพ์วันที่ : ${printDate}`)] })
        );

        const docxDoc = new DocxDocument({
            sections: [{
                properties: {
                    page: {
                        size: { orientation: PageOrientation.LANDSCAPE },
                        margin: { top: 720, right: 720, bottom: 720, left: 720 }
                    }
                },
                children: docContent
            }]
        });

        const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
        const fileName = `Document_${doc.documentNum}_${timestamp}.docx`;
        const blob = await Packer.toBlob(docxDoc);
        saveAs(blob, fileName);
    } catch (error) {
        console.error('Error exporting to DOCX:', error);
        throw error;
    }
};