import axios from 'axios';

export const apiClient = axios.create({
    baseURL: '/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

apiClient.interceptors.request.use((config) => {
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
});

apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        // Global error handling could go here (e.g. redirect on 401)
        if (error.response?.status === 401) {
            // Optional: Redirect to login or clear token
            // window.location.href = '/login'; 
        }
        return Promise.reject(error);
    }
);
