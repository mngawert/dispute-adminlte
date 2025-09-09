import React from 'react';
import BaseReport from '../components/BaseReport';

const ReportA = () => {
  return (
    <BaseReport 
      title="Report - All" 
      exportFileName="ReportA.xlsx"
      documentFilterLabel="Document Type"
      apiEndpoint="/api/Adjustment/ReportA"
      allowedDocumentTypes={['Adjust-', 'Adjust+', 'P31', 'P32', 'P35', 'P36']}
    />
  );
};

export default ReportA;