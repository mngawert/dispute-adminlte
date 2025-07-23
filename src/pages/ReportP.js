import React from 'react';
import BaseReport from '../components/BaseReport';

// Define allowed document types for Report P
const ALLOWED_DOCUMENT_TYPES = ['P3+', 'P3-'];

const ReportP = () => {
  return (
    <BaseReport 
      title="Report - P3-P3+" 
      exportFileName="ReportP.xlsx"
      allowedDocumentTypes={ALLOWED_DOCUMENT_TYPES}
      documentFilterLabel="Document Type"
      apiEndpoint="/api/Adjustment/ReportA" // Using the same API endpoint
    />
  );
};

export default ReportP;