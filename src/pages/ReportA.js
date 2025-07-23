import React from 'react';
import BaseReport from '../components/BaseReport';

const ReportA = () => {
  return (
    <BaseReport 
      title="Report - All" 
      exportFileName="ReportA.xlsx"
      documentFilterLabel="Document Type"
      apiEndpoint="/api/Adjustment/ReportA"
      // No allowed document types list means all document types will be shown
    />
  );
};

export default ReportA;