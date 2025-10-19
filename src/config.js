// config.js
const config = {
  //apiBaseUrl: 'http://10.1.66.25:8082',
  apiBaseUrl: "https://localhost:44351",
  
  // Authentication and security settings
  auth: {
    // When enabled, redirects to intranet if 'session' query parameter is missing
    requireSessionQueryParam: true,
    // URL to redirect to when session query parameter is missing
    intranetRedirectUrl: "https://intranet.ntplc.co.th"
  },

  // Business rules for adjustments
  adjustment: {
    // Customer types that are not allowed to create adjustments
    // 25 = Internal Customer
    restrictedCustomerTypeIds: [25]
  },
};

export default config;
