import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'https://localhost:7181/api',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

export default apiClient;
