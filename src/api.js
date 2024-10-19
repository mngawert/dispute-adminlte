import axios from "axios";
import { useHistory } from 'react-router-dom';
import isTokenExpired from "./components/isTokenExpired";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token && isTokenExpired(token)) {
    localStorage.removeItem('authToken');
    window.location.href = '/login';
  }
  config.headers.Authorization = token ? `Bearer ${token}` : '';
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;
