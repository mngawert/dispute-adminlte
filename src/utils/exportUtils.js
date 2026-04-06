import * as XLSX from 'xlsx';
import api from '../api';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

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
    const { CPS_MAP_HASH } = await import('../contexts/Constants');
    
    // Load Sarabun font
    const basePath = process.env.PUBLIC_URL || '';
    const toBase64 = (blob) => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64 = reader.result.split(',')[1];
            resolve(base64);
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
    
    try {
        // Fetch Sarabun fonts
        const [regularBlob, boldBlob] = await Promise.all([
            fetch(`${basePath}/fonts/Sarabun-Regular.ttf`).then(r => r.blob()),
            fetch(`${basePath}/fonts/Sarabun-Bold.ttf`).then(r => r.blob())
        ]);
        
        const [regularB64, boldB64] = await Promise.all([
            toBase64(regularBlob),
            toBase64(boldBlob)
        ]);
        
        // Create PDF in landscape A4
        const pdfDoc = new jsPDF({
            orientation: 'landscape',
            unit: 'mm',
            format: 'a4'
        });
        
        // Add Sarabun font to jsPDF
        pdfDoc.addFileToVFS('Sarabun-Regular.ttf', regularB64);
        pdfDoc.addFont('Sarabun-Regular.ttf', 'Sarabun', 'normal');
        pdfDoc.addFileToVFS('Sarabun-Bold.ttf', boldB64);
        pdfDoc.addFont('Sarabun-Bold.ttf', 'Sarabun', 'bold');
        
        pdfDoc.setFont('Sarabun');
        
        // Debug: Check if autoTable is available
        console.log('autoTable function:', typeof autoTable);
        console.log('pdfDoc.autoTable method:', typeof pdfDoc.autoTable);
        
        // === Calculations ===
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
        
        const notes = collectNotes(doc, adjustmentRequests);
        
        // Start PDF content at 15mm from top
        let yPos = 15;
        const pageWidth = pdfDoc.internal.pageSize.getWidth();
        
        // Title
        pdfDoc.setFontSize(14);
        pdfDoc.setFont('Sarabun', 'bold');
        pdfDoc.text('รายงานข้อมูลการปรับปรุงค่าใช้บริการ', pageWidth / 2, yPos, { align: 'center' });
        yPos += 10;
        
        // Document info
        pdfDoc.setFontSize(10);
        pdfDoc.text(`เลขที่เอกสารปรับปรุงบิล (Document Sequence) : ${doc.documentNum}`, 10, yPos);
        yPos += 7;
        pdfDoc.text(`ประเภทของการปรับปรุงบิล : ${doc.documentTypeDesc}     สร้างเมื่อ : ${formatDateTimeForExport(doc.createdDtm)}     Location : ${doc.homeLocationCode}`, 10, yPos);
        yPos += 10;
        
        pdfDoc.setFont('Sarabun', 'normal');
        pdfDoc.text(`รายละเอียด จำนวน ${adjustmentRequests.length} รายการ`, 10, yPos);
        yPos += 5;
        
        // Build adjustment table data for autoTable
        const tableHeaders = isB1PlusMinus
            ? ['ลำดับ', 'B1- Account\nNumber', 'B1- Invoice\nNumber', 'B1- Service\nNumber', 'Adjustment Type', 'Status', 'B1+ Account\nNumber', 'B1+ Service\nNumber', 'Error\nMessages', 'Amount', 'VAT', 'Total']
            : ['ลำดับ', 'Account\nNumber', 'Invoice\nNumber', 'Service\nNumber', 'Adjustment Type', 'Status', 'Error\nMessages', 'Amount', 'VAT', 'Total'];
        
        const tableRows = adjustmentRequests.map((adj, idx) => {
            const amount = Math.abs(adj.disputeMny);
            const vat = Math.abs(adj.disputeMny * (CPS_MAP_HASH[adj.cpsId] / 100));
            const tot = Math.abs(adj.disputeMny * (1 + CPS_MAP_HASH[adj.cpsId] / 100));
            
            const row = [
                String(idx + 1),
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
                formatNumberForExport(amount),
                formatNumberForExport(vat),
                formatNumberForExport(tot)
            );
            return row;
        });
        
        // Add totals row
        const totalRow = [...Array(tableHeaders.length - 3).fill(''), formatNumberForExport(totalAmount), formatNumberForExport(totalVAT), formatNumberForExport(totalAll)];
        totalRow[tableHeaders.length - 4] = 'รวม';
        tableRows.push(totalRow);
        
        // Create table
        autoTable(pdfDoc, {
            head: [tableHeaders],
            body: tableRows,
            startY: yPos,
            styles: {
                font: 'Sarabun',
                fontSize: 7,
                cellPadding: 1.5
            },
            headStyles: {
                fillColor: [240, 240, 240],
                textColor: [0, 0, 0],
                fontStyle: 'bold',
                halign: 'center'
            },
            columnStyles: {
                0: { halign: 'center', cellWidth: 12 },
                [tableHeaders.length - 3]: { halign: 'right' },
                [tableHeaders.length - 2]: { halign: 'right' },
                [tableHeaders.length - 1]: { halign: 'right' }
            },
            didParseCell: function(data) {
                // Make totals row bold
                if (data.row.index === tableRows.length - 1) {
                    data.cell.styles.fontStyle = 'bold';
                }
                // Right align last row's summary column
                if (data.row.index === tableRows.length - 1 && data.column.index === tableHeaders.length - 4) {
                    data.cell.styles.halign = 'right';
                }
            },
            theme: 'grid',
            tableLineColor: [204, 204, 204],
            tableLineWidth: 0.1
        });
        
        yPos = pdfDoc.lastAutoTable.finalY + 7;
        
        // Notes section
        if (notes.length > 0) {
            pdfDoc.setFontSize(9);
            pdfDoc.text(`เหตุผล : ${notes.join(' | ')}`, 10, yPos);
            yPos += 7;
        }
        
        // Approval workflow
        pdfDoc.setFontSize(10);
        pdfDoc.setFont('Sarabun', 'bold');
        pdfDoc.text('ขั้นตอนการอนุมัติ', 10, yPos);
        yPos += 5;
        
        const approvalRow1 = [
            [`1)\n\nCreated by : ${doc.createdByName || '[Username]'}\nวันที่ : ${formatDateTimeForExport(doc.createdDtm) || 'dd/mm/yyyy hh:mm:ss'}`],
            [`2)\n\nReviewed by : ${doc.reviewedByName || '[Username]'}\nวันที่ : ${formatDateTimeForExport(doc.reviewedDtm) || 'dd/mm/yyyy hh:mm:ss'}`],
            [`3)\n\nApproved by : ${doc.approvedByName || '[Username]'}\nวันที่ : ${formatDateTimeForExport(doc.approvedDtm) || 'dd/mm/yyyy hh:mm:ss'}`],
            [`4)\n\nFinance by : ${doc.financeReviewedByName || '[Username]'}\nวันที่ : ${formatDateTimeForExport(doc.financeReviewedDtm) || 'dd/mm/yyyy hh:mm:ss'}`]
        ];
        
        autoTable(pdfDoc, {
            body: [approvalRow1],
            startY: yPos,
            styles: {
                font: 'Sarabun',
                fontSize: 8,
                cellPadding: 2
            },
            columnStyles: {
                0: { cellWidth: (pageWidth - 20) / 4 },
                1: { cellWidth: (pageWidth - 20) / 4 },
                2: { cellWidth: (pageWidth - 20) / 4 },
                3: { cellWidth: (pageWidth - 20) / 4 }
            },
            theme: 'grid',
            tableLineColor: [204, 204, 204],
            tableLineWidth: 0.1
        });
        
        yPos = pdfDoc.lastAutoTable.finalY + 3;
        
        const approvalRow2 = [
            [''],
            [`\nRejected by : ${doc.rejectedByName || '[Username]'}\nวันที่ : ${formatDateTimeForExport(doc.rejectedDtm) || 'dd/mm/yyyy hh:mm:ss'}`],
            [`\nRetried by : ${doc.retriedByName || '[Username]'}\nวันที่ : ${formatDateTimeForExport(doc.retriedDtm) || 'dd/mm/yyyy hh:mm:ss'}`],
            [`\nCancelled by : ${doc.canceledByName || '[Username]'}\nวันที่ : ${formatDateTimeForExport(doc.canceledDtm) || 'dd/mm/yyyy hh:mm:ss'}`]
        ];
        
        autoTable(pdfDoc, {
            body: [approvalRow2],
            startY: yPos,
            styles: {
                font: 'Sarabun',
                fontSize: 8,
                cellPadding: 2
            },
            columnStyles: {
                0: { cellWidth: (pageWidth - 20) / 4 },
                1: { cellWidth: (pageWidth - 20) / 4 },
                2: { cellWidth: (pageWidth - 20) / 4 },
                3: { cellWidth: (pageWidth - 20) / 4 }
            },
            theme: 'grid',
            tableLineColor: [204, 204, 204],
            tableLineWidth: 0.1,
            didDrawCell: function(data) {
                // Remove border from first cell
                if (data.column.index === 0) {
                    data.cell.styles.lineWidth = 0;
                }
            }
        });
        
        // Add footer to all pages
        const pageCount = pdfDoc.internal.getNumberOfPages();
        pdfDoc.setFontSize(8);
        pdfDoc.setFont('Sarabun', 'normal');
        for (let i = 1; i <= pageCount; i++) {
            pdfDoc.setPage(i);
            pdfDoc.text(`เอกสาร : DR01 (NT Adjustor)  จัดพิมพ์วันที่ : ${printDate}`, 10, pdfDoc.internal.pageSize.getHeight() - 10);
            pdfDoc.text(`Page ${i}/${pageCount}`, pageWidth - 10, pdfDoc.internal.pageSize.getHeight() - 10, { align: 'right' });
        }
        
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
        const fileName = `Document_${doc.documentNum}_${timestamp}.pdf`;
        pdfDoc.save(fileName);
        
    } catch (error) {
        console.error('Error exporting to PDF:', error);
        throw error;
    }
}

// Export document details to DOCX
export async function exportDocumentToDOCX(doc, adjustmentRequests) {
    const { Document: DocxDocument, Packer, Paragraph, Table, TableRow, TableCell, WidthType, AlignmentType, TextRun, BorderStyle, PageOrientation } = await import('docx');
    const fileSaverModule = await import('file-saver');
    const saveAs = fileSaverModule.default || fileSaverModule.saveAs;
    const { CPS_MAP_HASH } = await import('../contexts/Constants');
    
    try {
        const isB1PlusMinus = doc.documentTypeDesc === 'B1+/-';
        const printDate = formatDateForExport(new Date().toISOString());
        const FONT = 'Sarabun';

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

        const makeRun = (text, opts = {}) => new TextRun({ text: text || '', font: FONT, ...opts });
        const boldRun = (text) => makeRun(text, { bold: true });
        const normalRun = (text) => makeRun(text);

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
                new TableCell({ children: [new Paragraph({ children: [normalRun(String(idx + 1))], alignment: AlignmentType.CENTER })], borders: thinBorder }),
                new TableCell({ children: [new Paragraph({ children: [normalRun(adj.accountNum || '')] })], borders: thinBorder }),
                new TableCell({ children: [new Paragraph({ children: [normalRun(adj.invoiceNum || '')] })], borders: thinBorder }),
                new TableCell({ children: [new Paragraph({ children: [normalRun(adj.serviceNum || '')] })], borders: thinBorder }),
                new TableCell({ children: [new Paragraph({ children: [normalRun(adj.adjustmentTypeName || '')] })], borders: thinBorder }),
                new TableCell({ children: [new Paragraph({ children: [normalRun(adj.requestStatus || '')] })], borders: thinBorder })
            ];

            if (isB1PlusMinus) {
                cells.push(
                    new TableCell({ children: [new Paragraph({ children: [normalRun(adj.accountNumBPlus || '')] })], borders: thinBorder }),
                    new TableCell({ children: [new Paragraph({ children: [normalRun(adj.serviceNumBPlus || '')] })], borders: thinBorder })
                );
            }

            cells.push(
                new TableCell({ children: [new Paragraph({ children: [normalRun(adj.errorMessages || '')] })], borders: thinBorder }),
                new TableCell({ children: [new Paragraph({ children: [normalRun(formatNumberForExport(amount))], alignment: AlignmentType.RIGHT })], borders: thinBorder }),
                new TableCell({ children: [new Paragraph({ children: [normalRun(formatNumberForExport(vat))], alignment: AlignmentType.RIGHT })], borders: thinBorder }),
                new TableCell({ children: [new Paragraph({ children: [normalRun(formatNumberForExport(tot))], alignment: AlignmentType.RIGHT })], borders: thinBorder })
            );

            return new TableRow({ children: cells });
        });

        // Totals row
        const summaryColSpan = headerTexts.length - 3;
        const totalRowCells = [
            new TableCell({
                children: [new Paragraph({ children: [boldRun('รวม')], alignment: AlignmentType.RIGHT })],
                columnSpan: summaryColSpan,
                borders: thinBorder
            }),
            new TableCell({ children: [new Paragraph({ children: [boldRun(formatNumberForExport(totalAmount))], alignment: AlignmentType.RIGHT })], borders: thinBorder }),
            new TableCell({ children: [new Paragraph({ children: [boldRun(formatNumberForExport(totalVAT))], alignment: AlignmentType.RIGHT })], borders: thinBorder }),
            new TableCell({ children: [new Paragraph({ children: [boldRun(formatNumberForExport(totalAll))], alignment: AlignmentType.RIGHT })], borders: thinBorder })
        ];

        const adjTable = new Table({
            rows: [headerRow, ...dataRows, new TableRow({ children: totalRowCells })],
            width: { size: 100, type: WidthType.PERCENTAGE }
        });

        // === Notes ===
        const notes = collectNotes(doc, adjustmentRequests);

        // === Approval Table ===
        const makeApprovalCell = (label, name, dtm, numbered) => {
            const children = [];
            if (numbered) children.push(new Paragraph({ children: [boldRun(numbered)] }));
            children.push(new Paragraph({ children: [] }));
            children.push(new Paragraph({ children: [normalRun(`${label} : `), normalRun(name || '[Username]')] }));
            children.push(new Paragraph({ children: [normalRun('วันที่ : '), normalRun(formatDateTimeForExport(dtm) || 'dd/mm/yyyy hh:mm:ss')] }));
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
                    new TableCell({ children: [new Paragraph({ children: [] })], borders: noBorder }),
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
            new Paragraph({ children: [] }),
            new Paragraph({ children: [boldRun('เลขที่เอกสารปรับปรุงบิล (Document Sequence) : '), normalRun(doc.documentNum)] }),
            new Paragraph({
                children: [
                    boldRun('ประเภทของการปรับปรุงบิล : '), normalRun(doc.documentTypeDesc),
                    normalRun('                    '),
                    boldRun('สร้างเมื่อ : '), normalRun(formatDateTimeForExport(doc.createdDtm)),
                    normalRun('                    '),
                    boldRun('Location : '), normalRun(doc.homeLocationCode)
                ]
            }),
            new Paragraph({ children: [] }),
            new Paragraph({ children: [normalRun(`รายละเอียด จำนวน ${adjustmentRequests.length} รายการ`)] }),
            adjTable,
            new Paragraph({ children: [] })
        ];

        if (notes.length > 0) {
            docContent.push(new Paragraph({ children: [boldRun('เหตุผล : '), normalRun(notes.join(' | '))] }));
        }

        docContent.push(
            new Paragraph({ children: [] }),
            new Paragraph({ children: [boldRun('ขั้นตอนการอนุมัติ')] }),
            new Paragraph({ children: [] }),
            approvalTable1,
            new Paragraph({ children: [] }),
            approvalTable2,
            new Paragraph({ children: [] }),
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