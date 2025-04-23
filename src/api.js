import axios from "axios";
import isTokenExpired from "./components/isTokenExpired";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token && isTokenExpired(token)) {
    localStorage.removeItem('authToken');
    // Store the current URL before redirecting to login
    localStorage.setItem('redirectUrl', window.location.href);
    window.location.href = '/NTAdjustor/login';
  }
  config.headers.Authorization = token ? `Bearer ${token}` : '';
  return config;
}, (error) => {
  return Promise.reject(error);
});

api.interceptors.response.use((response) => {
  return response;
}, (error) => {
  if (error.response && error.response.status === 401) {
    localStorage.removeItem('authToken');
    // Store the current URL before redirecting to login
    localStorage.setItem('redirectUrl', window.location.href);
    window.location.href = '/NTAdjustor/login';
  }
  return Promise.reject(error);
});

export default api;
