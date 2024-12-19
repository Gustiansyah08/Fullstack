import axios from 'axios';

// Membuat instance axios dengan baseURL ke Laravel API
const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api', // Pastikan ini adalah URL API Laravel Anda
  withCredentials: true, // Mengirimkan cookies bersama setiap permintaan
});

// Menambahkan Authorization header jika token tersedia
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); // Ambil token dari localStorage
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
