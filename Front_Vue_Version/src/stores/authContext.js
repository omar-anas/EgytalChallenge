import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import api from '@/api'; 
import router from '@/router'; //routerDom

export const useAuthStore = defineStore('auth', () => {
    // useState
    const token = ref(localStorage.getItem('authToken') || null);
    const user = ref(null);

    const isAuthenticated = computed(() => !!token.value);

    function setToken(newToken) {
        token.value = newToken;
        if (newToken) {
            localStorage.setItem('authToken', newToken);
        } else {
            localStorage.removeItem('authToken');
        }
    }

    async function login(credentials) {
        try {
            const response = await api.login(credentials);
            if (response.data && response.data.access_token) {
                setToken(response.data.access_token);
                await router.push('/');
                return true;
            } else {
                throw new Error(`Login Fail ${response.data.msg}`);
            }
        } catch (error) {
            setToken(null);
            throw error; 
        }
    }

    async function signup(userData) {
        try {
            const response = await api.signup(userData);
            if (response.data && response.data.access_token) {
                setToken(response.data.access_token);
                await router.push('/');
                return true;
                
            }else{
                throw new Error(`Signup Fail ${response.data.msg}`);
            }
            
            
        } catch (error) {
            console.error(`Signup failed`);
             throw error;
        }
    }

    function logout() {
        setToken(null);
        user.value = null;
        router.push('/login');
    }

    //sign out if theres no token 
    function initializeAuth() {
        const storedToken = localStorage.getItem('authToken');
        if (storedToken) {
            token.value = storedToken;
        }
    }

    return {
        token,
        user,
        isAuthenticated,
        login,
        signup,
        logout,
        initializeAuth,
        setToken
    };
});