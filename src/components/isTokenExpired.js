import { getDecodedToken } from '../utils/utils';

const isTokenExpired = (token) => {
  try {
    if (!token) return true;
    
    const decodedToken = getDecodedToken();
    if (!decodedToken || !decodedToken.exp) return true;
    
    const now = Date.now() / 1000; // Current time in seconds
    return decodedToken.exp < now;
  } catch (error) {
    console.error('Error checking token expiration:', error);
    return true;
  }
};

export default isTokenExpired;
