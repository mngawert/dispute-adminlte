
export const DOCUMENT_TYPE = {
  ADJUST_MINUS  : '01',
  ADJUST_PLUS   : '02',
  P31           : '31',
  P32           : '32',
  P35           : '35',
  P36           : '36',
  P3_PLUS       : '21',
  P3_MINUS      : '22',
  B             : '11'
};

export const DOCUMENT_STATUS_LIST = [
  { name: 'Create-Pending', value: 'Create-Pending' },
  { name: 'Create-Accept', value: 'Create-Accept' },
  { name: 'Create-Reject', value: 'Create-Reject' },
  { name: 'Review-Accept', value: 'Review-Accept' },
  { name: 'Review-Reject', value: 'Review-Reject' },
  { name: 'Finance-Accept', value: 'Finance-Accept' },
  { name: 'Finance-Reject', value: 'Finance-Reject' },
  { name: 'Approve-Accept', value: 'Approve-Accept' },
  { name: 'Approve-Reject', value: 'Approve-Reject' },
  { name: 'Created in RBM', value: 'CREATED_IN_RBM' },
];

export const SEARCH_BY_LIST = [
  { name: 'Documen Number', value: 'DocumentNum' },
  { name: 'Account Number', value: 'AccountNum' },
  { name: 'Service Number', value: 'ServiceNum' },
];