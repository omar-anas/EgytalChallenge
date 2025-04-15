import axios from 'axios';
import { useAuthStore } from '@/stores/authContext';'@/stores/auth'

const apiClient = axios.create({
    baseURL: 'http://localhost:5000',
    headers: {
        'Content-Type': 'application/json',
    },
});


apiClient.interceptors.request.use(
    (config) => {
        const authStore = useAuthStore();
        const token = authStore.token;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            const authStore = useAuthStore();
            console.error('Unauthorized request, logging out.');
            authStore.logout(); 
        }
        return Promise.reject(error);
    }
);


export default {
  
    login(credentials) {
        return apiClient.post('/auth/login', credentials);
    },
    signup(userData) {
        return apiClient.post('/auth/register', userData);
    },

 
    getTasks(params = {}) {
        return apiClient.get('/tasks', { params });
    },
    createTask(taskData) {
        return apiClient.post('/tasks', taskData);
    },
    
    updateTaskStatus(taskId, status) {
        return apiClient.patch(`/tasks/${taskId}/status`, { status});
    },
    
    deleteTask(taskId) {
        return apiClient.delete(`/tasks/${taskId}`);
    },
};