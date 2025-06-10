export const DOCUMENT_TYPE = {
  ADJUST_MINUS  : '01',
  ADJUST_PLUS   : '02',
  P31           : '31',
  P32           : '32',
  P35           : '35',
  P36           : '36',
  P3_MINUS      : '21',
  P3_PLUS       : '22',
  B             : '11'
};

export const DOCUMENT_TYPE_DESC = {
  '01': 'Adjust(-)',
  '02': 'Adjust(+)',
  '31': 'P31',
  '32': 'P32',
  '35': 'P35',
  '36': 'P36',
  '21': 'P3-',
  '22': 'P3+',
  '11': 'B +/-'
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
  { name: 'Document Sequence', value: 'DocumentNum' },
  { name: 'Account Number', value: 'AccountNum' },
  { name: 'Invoice Number', value: 'InvoiceNum' },
  { name: 'Service Number', value: 'ServiceNum' }
];

export const CPS_MAP = [
  { name: '0', value: '0' },
  { name: '1', value: '7' },
  { name: '2', value: '7' },
  { name: '9', value: '0' },
  { name: '10', value: '7' },
  { name: '11', value: '0' },
  { name: '12', value: '0' },
  { name: '30', value: '7' },
  { name: '31', value: '0' },
  { name: '32', value: '0' },
  { name: '40', value: '7' },
  { name: '41', value: '0' },
  { name: '42', value: '0' },
  { name: '50', value: '7' },
  { name: '51', value: '0' },
  { name: '52', value: '0' },   
]

export const CPS_MAP_HASH = CPS_MAP.reduce((acc, { name, value }) => {
  acc[name] = value;
  return acc;
}, {});
