import {jwtDecode} from 'jwt-decode';

const isTokenExpired = (token) => {
  const decoded = jwtDecode(token);
  const now = Date.now() / 1000; // Current time in seconds

  return decoded.exp < now;
};

export default isTokenExpired;
