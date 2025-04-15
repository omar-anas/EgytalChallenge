<script setup>
import { reactive, ref } from 'vue';
import { useAuthStore } from '@/stores/authContext'; '@/stores/auth';

const authStore = useAuthStore();

const credentials = reactive({
  email: '', 
  password: '',
});
const errorMessage = ref('');
const isLoading = ref(false);

const handleLogin = async () => {
  errorMessage.value = '';
  isLoading.value = true;
  try {
    await authStore.login(credentials);
    console.log(credentials);
  } catch (error) {
    errorMessage.value = error.response?.data?.message || error.message ;
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div class="auth-container">
    <h1>Login</h1>
    <form @submit.prevent="handleLogin">
      <div class="form-group">
        <label for="email">Email:</label>
        <input
          type="text"
          id="email"
          v-model.trim="credentials.email"
          required
          autocomplete="email"
        />
      </div>
      <div class="form-group">
        <label for="password">Password:</label>
        <input
          type="password"
          id="password"
          v-model="credentials.password"
          required
          autocomplete="current-password"
        />
      </div>

      <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>

      <button type="submit" :disabled="isLoading">
        {{ isLoading ? 'Logging in...' : 'Login' }}
      </button>
    </form>
    <p>Don't have an account? <router-link to="/signup">Sign Up</router-link></p>
  </div>
</template>

<style scoped>
@import '@/assets/main.css';
@import '@/assets/auth-form.css';

button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}
</style>
