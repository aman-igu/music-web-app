import axios from 'axios';

const api = axios.create({
    baseURL: '/api',
    withCredentials: true, // Crucial for sending cookies with requests
});

export const authAPI = {
    login: (data) => api.post('/auth/login', data),
    register: (data) => api.post('/auth/register', data),
    getProfile: () => api.get('/auth/profile'), // You might want to add this to backend
};

export const musicAPI = {
    createMusic: (formData) => api.post('/music/create-music', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }),
    createAlbum: (data) => api.post('/music/create-album', data),
    getAllMusic: () => api.get('/music'), // Assuming you'll add this to backend
};

export default api;
