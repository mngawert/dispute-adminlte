import { jwtDecode } from 'jwt-decode';

export const formatNumber = (value) => {
    return Number(value).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

export const formatDate = (date) => {
    return new Date(date).toLocaleString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
};

/**
 * Truncates text to a specified length and adds ellipsis if needed
 * @param {string} text - The text to truncate
 * @param {number} maxLength - Maximum length before truncation (default: 30)
 * @returns {string} - Truncated text with ellipsis if needed
 */
export const truncateText = (text, maxLength = 30) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
};

/**
 * Decodes JWT token and extracts user roles
 * @returns {Array} - Array of user roles, empty array if no token or error
 */
export const getUserRoles = () => {
    try {
        const token = localStorage.getItem('authToken');
        if (!token) return [];
        
        const decodedToken = jwtDecode(token);
        const roleData = decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
        
        if (!roleData) return [];
        return Array.isArray(roleData) ? roleData : [roleData];
    } catch (error) {
        console.error('Error decoding token for roles:', error);
        return [];
    }
};

/**
 * Checks if user has a specific role
 * @param {string} role - The role to check
 * @returns {boolean} - True if user has the role
 */
export const userHasRole = (role) => {
    const roles = getUserRoles();
    return roles.some(r => r === role);
};

/**
 * Decodes JWT token and returns the decoded token object
 * @returns {Object|null} - Decoded token or null if error
 */
export const getDecodedToken = () => {
    try {
        const token = localStorage.getItem('authToken');
        if (!token) return null;
        return jwtDecode(token);
    } catch (error) {
        console.error('Error decoding token:', error);
        return null;
    }
};