import {jwtDecode} from 'jwt-decode';

const isTokenExpired = (token) => {
  const decodedToken = jwtDecode(token);
  const roles = decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || [];

  // console.log("decodedToken:", decodedToken);
  // console.log("roles:", roles);
  
  const now = Date.now() / 1000; // Current time in seconds

  return decodedToken.exp < now;
};

export default isTokenExpired;
