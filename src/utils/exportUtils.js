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

// Helper function to format number for display
const formatNumberForExport = (num) => {
    if (num === null || num === undefined) return '0.00';
    return parseFloat(num).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

// Export document details to PDF
export async function exportDocumentToPDF(document, adjustmentRequests) {
    // Import dependencies inside function to avoid circular dependency issues
    const pdfMakeModule = await import('pdfmake/build/pdfmake');
    const pdfFontsModule = await import('pdfmake/build/vfs_fonts');
    const { CPS_MAP_HASH } = await import('../contexts/Constants');
    
    const pdfMake = pdfMakeModule.default || pdfMakeModule;
    const pdfFonts = pdfFontsModule.default || pdfFontsModule;
    
    // Initialize pdfMake fonts
    if (pdfFonts.pdfMake && pdfFonts.pdfMake.vfs) {
        pdfMake.vfs = pdfFonts.pdfMake.vfs;
    } else {
        pdfMake.vfs = pdfFonts.vfs || pdfFonts;
    }
    
    try {
        // Calculate totals
        let totalAmount = 0;
        let totalVAT = 0;
        let total = 0;

        adjustmentRequests.forEach(adj => {
            const amount = Math.abs(adj.disputeMny);
            const vat = Math.abs(adj.disputeMny * (CPS_MAP_HASH[adj.cpsId] / 100));
            const totalAdj = Math.abs(adj.disputeMny * (1 + CPS_MAP_HASH[adj.cpsId] / 100));
            
            totalAmount += parseFloat(amount.toFixed(2));
            totalVAT += parseFloat(vat.toFixed(2));
            total += parseFloat(totalAdj.toFixed(2));
        });

        // Prepare table headers based on document type
        const isB1PlusMinus = document.documentTypeDesc === 'B1+/-';
        
        const tableHeaders = [
            { text: isB1PlusMinus ? 'B1- Account Number' : 'Account Number', style: 'tableHeader', bold: true },
            { text: isB1PlusMinus ? 'B1- Invoice Number' : 'Invoice Number', style: 'tableHeader', bold: true },
            { text: isB1PlusMinus ? 'B1- Service Number' : 'Service Number', style: 'tableHeader', bold: true },
            { text: 'Adjustment Type', style: 'tableHeader', bold: true },
            { text: 'Status', style: 'tableHeader', bold: true }
        ];

        if (isB1PlusMinus) {
            tableHeaders.push(
                { text: 'B1+ Account Number', style: 'tableHeader', bold: true },
                { text: 'B1+ Service Number', style: 'tableHeader', bold: true }
            );
        }

        tableHeaders.push(
            { text: 'Error Messages', style: 'tableHeader', bold: true },
            { text: 'Amount', style: 'tableHeader', bold: true },
            { text: 'VAT', style: 'tableHeader', bold: true },
            { text: 'Total', style: 'tableHeader', bold: true }
        );

        // Prepare table rows
        const tableBody = [tableHeaders];

        adjustmentRequests.forEach(adj => {
            const row = [
                adj.accountNum || '',
                adj.invoiceNum || '',
                adj.serviceNum || '',
                adj.adjustmentTypeName || '',
                adj.requestStatus || ''
            ];

            if (isB1PlusMinus) {
                row.push(
                    adj.accountNumBPlus || '',
                    adj.serviceNumBPlus || ''
                );
            }

            const amount = Math.abs(adj.disputeMny);
            const vat = Math.abs(adj.disputeMny * (CPS_MAP_HASH[adj.cpsId] / 100));
            const totalAdj = Math.abs(adj.disputeMny * (1 + CPS_MAP_HASH[adj.cpsId] / 100));

            row.push(
                adj.errorMessages || '-',
                { text: formatNumberForExport(amount), alignment: 'right' },
                { text: formatNumberForExport(vat), alignment: 'right' },
                { text: formatNumberForExport(totalAdj), alignment: 'right' }
            );

            tableBody.push(row);
        });

        // Add totals row
        const totalsRow = [];
        const colSpan = isB1PlusMinus ? 8 : 6;
        totalsRow.push({ text: 'Total', colSpan: colSpan, alignment: 'right', bold: true });
        for (let i = 1; i < colSpan; i++) {
            totalsRow.push({});
        }
        totalsRow.push(
            { text: formatNumberForExport(totalAmount), alignment: 'right', bold: true },
            { text: formatNumberForExport(totalVAT), alignment: 'right', bold: true },
            { text: formatNumberForExport(total), alignment: 'right', bold: true }
        );
        tableBody.push(totalsRow);

        // Create PDF document definition
        const docDefinition = {
            content: [
                { text: `Document Details - ${document.documentNum}`, style: 'header' },
                { text: '\n' },
                { text: 'Document Information', style: 'subheader' },
                {
                    columns: [
                        {
                            width: '50%',
                            stack: [
                                { text: [{ text: 'Document Sequence: ', bold: true }, document.documentNum] },
                                { text: [{ text: 'Document Type: ', bold: true }, document.documentTypeDesc] },
                                { text: [{ text: 'Total Amount: ', bold: true }, formatNumberForExport(document.documentTypeDesc === 'B1+/-' ? Math.abs(document.totalMny) / 2 : Math.abs(document.totalMny))] }
                            ]
                        },
                        {
                            width: '50%',
                            stack: [
                                { text: [{ text: 'Location: ', bold: true }, document.homeLocationCode] },
                                { text: [{ text: 'Created by: ', bold: true }, document.createdByName] },
                                { text: [{ text: 'Created date: ', bold: true }, formatDateForExport(document.createdDtm)] }
                            ]
                        }
                    ]
                },
                { text: '\n' }
            ],
            styles: {
                header: {
                    fontSize: 18,
                    bold: true
                },
                subheader: {
                    fontSize: 14,
                    bold: true,
                    margin: [0, 10, 0, 5]
                },
                tableHeader: {
                    bold: true,
                    fontSize: 10,
                    color: 'black',
                    fillColor: '#eeeeee'
                }
            },
            pageOrientation: 'landscape',
            pageMargins: [40, 60, 40, 60]
        };

        // Add notes section if available
        if (document.reviewNote || document.approveNote || document.financeNote || document.cancelNote) {
            docDefinition.content.push({ text: 'Notes:', style: 'subheader' });
            const notesList = [];
            if (document.reviewNote) notesList.push({ text: `[Reviewer]: ${document.reviewNote}` });
            if (document.approveNote) notesList.push({ text: `[Approver]: ${document.approveNote}` });
            if (document.financeNote) notesList.push({ text: `[Financial Reviewer]: ${document.financeNote}` });
            if (document.cancelNote) notesList.push({ text: `[Canceller]: ${document.cancelNote}` });
            docDefinition.content.push({ ul: notesList });
            docDefinition.content.push({ text: '\n' });
        }

        // Add adjustment requests table
        docDefinition.content.push({ text: 'Adjustment Requests:', style: 'subheader' });
        docDefinition.content.push({
            table: {
                headerRows: 1,
                widths: isB1PlusMinus ? ['auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto'] : ['auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto'],
                body: tableBody
            },
            layout: {
                fillColor: function (rowIndex, node, columnIndex) {
                    return (rowIndex === 0) ? '#eeeeee' : null;
                }
            },
            fontSize: 8
        });

        // Generate and download PDF
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
        const fileName = `Document_${document.documentNum}_${timestamp}.pdf`;
        
        pdfMake.createPdf(docDefinition).download(fileName);
    } catch (error) {
        console.error('Error exporting to PDF:', error);
        throw error;
    }
};

// Export document details to DOCX
export async function exportDocumentToDOCX(document, adjustmentRequests) {
    // Import dependencies inside function to avoid circular dependency issues
    const { Document, Packer, Paragraph, Table, TableRow, TableCell, WidthType, AlignmentType, TextRun, HeadingLevel } = await import('docx');
    const fileSaverModule = await import('file-saver');
    const saveAs = fileSaverModule.default || fileSaverModule.saveAs;
    const { CPS_MAP_HASH } = await import('../contexts/Constants');
    
    try {
        // Calculate totals
        let totalAmount = 0;
        let totalVAT = 0;
        let total = 0;

        adjustmentRequests.forEach(adj => {
            const amount = Math.abs(adj.disputeMny);
            const vat = Math.abs(adj.disputeMny * (CPS_MAP_HASH[adj.cpsId] / 100));
            const totalAdj = Math.abs(adj.disputeMny * (1 + CPS_MAP_HASH[adj.cpsId] / 100));
            
            totalAmount += parseFloat(amount.toFixed(2));
            totalVAT += parseFloat(vat.toFixed(2));
            total += parseFloat(totalAdj.toFixed(2));
        });

        const isB1PlusMinus = document.documentTypeDesc === 'B1+/-';

        // Create table headers
        const headerCells = [
            new TableCell({
                children: [new Paragraph({ text: isB1PlusMinus ? 'B1- Account Number' : 'Account Number', bold: true })],
                shading: { fill: "EEEEEE" }
            }),
            new TableCell({
                children: [new Paragraph({ text: isB1PlusMinus ? 'B1- Invoice Number' : 'Invoice Number', bold: true })],
                shading: { fill: "EEEEEE" }
            }),
            new TableCell({
                children: [new Paragraph({ text: isB1PlusMinus ? 'B1- Service Number' : 'Service Number', bold: true })],
                shading: { fill: "EEEEEE" }
            }),
            new TableCell({
                children: [new Paragraph({ text: 'Adjustment Type', bold: true })],
                shading: { fill: "EEEEEE" }
            }),
            new TableCell({
                children: [new Paragraph({ text: 'Status', bold: true })],
                shading: { fill: "EEEEEE" }
            })
        ];

        if (isB1PlusMinus) {
            headerCells.push(
                new TableCell({
                    children: [new Paragraph({ text: 'B1+ Account Number', bold: true })],
                    shading: { fill: "EEEEEE" }
                }),
                new TableCell({
                    children: [new Paragraph({ text: 'B1+ Service Number', bold: true })],
                    shading: { fill: "EEEEEE" }
                })
            );
        }

        headerCells.push(
            new TableCell({
                children: [new Paragraph({ text: 'Error Messages', bold: true })],
                shading: { fill: "EEEEEE" }
            }),
            new TableCell({
                children: [new Paragraph({ text: 'Amount', bold: true, alignment: AlignmentType.RIGHT })],
                shading: { fill: "EEEEEE" }
            }),
            new TableCell({
                children: [new Paragraph({ text: 'VAT', bold: true, alignment: AlignmentType.RIGHT })],
                shading: { fill: "EEEEEE" }
            }),
            new TableCell({
                children: [new Paragraph({ text: 'Total', bold: true, alignment: AlignmentType.RIGHT })],
                shading: { fill: "EEEEEE" }
            })
        );

        // Create table rows
        const tableRows = [new TableRow({ children: headerCells })];

        adjustmentRequests.forEach(adj => {
            const cells = [
                new TableCell({ children: [new Paragraph(adj.accountNum || '')] }),
                new TableCell({ children: [new Paragraph(adj.invoiceNum || '')] }),
                new TableCell({ children: [new Paragraph(adj.serviceNum || '')] }),
                new TableCell({ children: [new Paragraph(adj.adjustmentTypeName || '')] }),
                new TableCell({ children: [new Paragraph(adj.requestStatus || '')] })
            ];

            if (isB1PlusMinus) {
                cells.push(
                    new TableCell({ children: [new Paragraph(adj.accountNumBPlus || '')] }),
                    new TableCell({ children: [new Paragraph(adj.serviceNumBPlus || '')] })
                );
            }

            const amount = Math.abs(adj.disputeMny);
            const vat = Math.abs(adj.disputeMny * (CPS_MAP_HASH[adj.cpsId] / 100));
            const totalAdj = Math.abs(adj.disputeMny * (1 + CPS_MAP_HASH[adj.cpsId] / 100));

            cells.push(
                new TableCell({ children: [new Paragraph(adj.errorMessages || '-')] }),
                new TableCell({ children: [new Paragraph({ text: formatNumberForExport(amount), alignment: AlignmentType.RIGHT })] }),
                new TableCell({ children: [new Paragraph({ text: formatNumberForExport(vat), alignment: AlignmentType.RIGHT })] }),
                new TableCell({ children: [new Paragraph({ text: formatNumberForExport(totalAdj), alignment: AlignmentType.RIGHT })] })
            );

            tableRows.push(new TableRow({ children: cells }));
        });

        // Add totals row
        const totalCells = [];
        const colSpan = isB1PlusMinus ? 8 : 6;
        
        totalCells.push(
            new TableCell({
                children: [new Paragraph({ text: 'Total', bold: true, alignment: AlignmentType.RIGHT })],
                columnSpan: colSpan
            })
        );
        
        // Add empty cells for the column span
        for (let i = 1; i < colSpan; i++) {
            totalCells.push(new TableCell({ children: [] }));
        }
        
        totalCells.push(
            new TableCell({ children: [new Paragraph({ text: formatNumberForExport(totalAmount), bold: true, alignment: AlignmentType.RIGHT })] }),
            new TableCell({ children: [new Paragraph({ text: formatNumberForExport(totalVAT), bold: true, alignment: AlignmentType.RIGHT })] }),
            new TableCell({ children: [new Paragraph({ text: formatNumberForExport(total), bold: true, alignment: AlignmentType.RIGHT })] })
        );

        tableRows.push(new TableRow({ children: totalCells }));

        // Create document content
        const docContent = [
            new Paragraph({
                text: `Document Details - ${document.documentNum}`,
                heading: HeadingLevel.HEADING_1
            }),
            new Paragraph({ text: '' }),
            new Paragraph({
                text: 'Document Information',
                heading: HeadingLevel.HEADING_2
            }),
            new Paragraph({
                children: [
                    new TextRun({ text: 'Document Sequence: ', bold: true }),
                    new TextRun(document.documentNum)
                ]
            }),
            new Paragraph({
                children: [
                    new TextRun({ text: 'Document Type: ', bold: true }),
                    new TextRun(document.documentTypeDesc)
                ]
            }),
            new Paragraph({
                children: [
                    new TextRun({ text: 'Total Amount: ', bold: true }),
                    new TextRun(formatNumberForExport(document.documentTypeDesc === 'B1+/-' ? Math.abs(document.totalMny) / 2 : Math.abs(document.totalMny)))
                ]
            }),
            new Paragraph({
                children: [
                    new TextRun({ text: 'Location: ', bold: true }),
                    new TextRun(document.homeLocationCode)
                ]
            }),
            new Paragraph({
                children: [
                    new TextRun({ text: 'Created by: ', bold: true }),
                    new TextRun(document.createdByName)
                ]
            }),
            new Paragraph({
                children: [
                    new TextRun({ text: 'Created date: ', bold: true }),
                    new TextRun(formatDateForExport(document.createdDtm))
                ]
            }),
            new Paragraph({ text: '' })
        ];

        // Add notes section if available
        if (document.reviewNote || document.approveNote || document.financeNote || document.cancelNote) {
            docContent.push(
                new Paragraph({
                    text: 'Notes:',
                    heading: HeadingLevel.HEADING_2
                })
            );
            if (document.reviewNote) {
                docContent.push(new Paragraph(`[Reviewer]: ${document.reviewNote}`));
            }
            if (document.approveNote) {
                docContent.push(new Paragraph(`[Approver]: ${document.approveNote}`));
            }
            if (document.financeNote) {
                docContent.push(new Paragraph(`[Financial Reviewer]: ${document.financeNote}`));
            }
            if (document.cancelNote) {
                docContent.push(new Paragraph(`[Canceller]: ${document.cancelNote}`));
            }
            docContent.push(new Paragraph({ text: '' }));
        }

        // Add adjustment requests table
        docContent.push(
            new Paragraph({
                text: 'Adjustment Requests:',
                heading: HeadingLevel.HEADING_2
            })
        );

        docContent.push(
            new Table({
                rows: tableRows,
                width: {
                    size: 100,
                    type: WidthType.PERCENTAGE
                }
            })
        );

        // Create and download document
        const doc = new Document({
            sections: [{
                properties: {
                    page: {
                        margin: {
                            top: 720,
                            right: 720,
                            bottom: 720,
                            left: 720
                        }
                    }
                },
                children: docContent
            }]
        });

        const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
        const fileName = `Document_${document.documentNum}_${timestamp}.docx`;

        const blob = await Packer.toBlob(doc);
        saveAs(blob, fileName);
    } catch (error) {
        console.error('Error exporting to DOCX:', error);
        throw error;
    }
};