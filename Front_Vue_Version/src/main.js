import { createApp } from 'vue';
import { createPinia } from 'pinia';

import App from './App.vue';
import router from './router';
import { useAuthStore } from '@/stores/authContext'; './stores/auth'; // Import store

import './assets/main.css'; // Import global CSS

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);

// Initialize auth store *after* Pinia is installed but *before* router is used for guards
const authStore = useAuthStore();
authStore.initializeAuth(); // Load token from localStorage if available

app.use(router);

app.mount('#app');