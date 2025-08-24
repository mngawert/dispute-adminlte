/**
 * Utility functions for loading external configuration
 */

/**
 * Loads configuration from a JSON file
 * @param {string} configPath - Path to the configuration file
 * @returns {Promise<any>} - Promise resolving to the configuration object
 */
export const loadConfig = async (configPath) => {
  try {
    const response = await fetch(configPath);
    if (!response.ok) {
      throw new Error(`Failed to load config: ${response.status} ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error loading configuration from ${configPath}:`, error);
    return null;
  }
};

/**
 * Loads the Review tabs configuration
 * @returns {Promise<{tabConfig: Object, financeRestrictedTabs: string[]}>}
 */
export const loadReviewTabsConfig = async () => {
  const defaultConfig = {
    tabConfig: {
      'Adjust-': true,
      'Adjust+': true,
      'P31': true,
      'P32': true,
      'P35': true,
      'P36': true,
      'P3-': true,
      'P3+': true,
      'B1+/-': true
    },
    financeRestrictedTabs: ['Adjust-', 'Adjust+', 'B1+/-']
  };
  
  const config = await loadConfig('/config/review-tabs-config.json');
  return config || defaultConfig;
};

/**
 * Loads the authentication configuration
 * @returns {Promise<{auth: {requireSessionQueryParam: boolean, intranetRedirectUrl: string}}>}
 */
export const loadAuthConfig = async () => {
  const defaultConfig = {
    auth: {
      requireSessionQueryParam: true,
      intranetRedirectUrl: 'https://intranet.ntplc.co.th'
    }
  };
  
  const config = await loadConfig('/config/auth-config.json');
  return config || defaultConfig;
};
