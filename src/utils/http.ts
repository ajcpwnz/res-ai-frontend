import axios from 'axios'

export const API_HOST = import.meta.env.VITE_API_URL as string;
// export const API_HOST = 'http://67.205.183.132:5005'

const client = axios.create({
  baseURL: `${API_HOST}/v1`,
  headers: {
    'Content-Type': 'application/json',
  },
})

client.interceptors.request.use((config) => {
  const token = localStorage.getItem('jwt_token');

  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});


export const http = client;

