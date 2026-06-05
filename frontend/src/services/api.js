import axios from 'axios';

// Create axios instance with base URL.
// In Vite development, we configure a proxy to route /api to http://localhost:3000
const api = axios.create({
    baseURL: '/api',
    withCredentials: true, // Crucial for sending cookies with requests
});

export const authAPI = {
    login: (data) => api.post('/auth/login', data),
    register: (data) => api.post('/auth/register', data),
    getProfile: () => api.get('/auth/me'),
    logout: () => api.post('/auth/logout'),
};

export const musicAPI = {
    createMusic: (formData) => api.post('/music/create-music', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }),
    createAlbum: (data) => api.post('/music/create-album', data),
    getAllMusic: () => api.get('/music'),
    getArtistMusic: () => api.get('/music/artist'),
};

export const aiAPI = {
    chat: (data) => api.post('/ai/chat', data),
};

export default api;

