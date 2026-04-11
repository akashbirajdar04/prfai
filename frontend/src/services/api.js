import axios from 'axios';

const api = axios.create({
    // HARDCODED to production backend to guarantee it never hits localhost
    baseURL: import.meta.env.VITE_API_URL || 'https://prfeai-backend.onrender.com/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Automatically add the auth token from localStorage to every request
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;
