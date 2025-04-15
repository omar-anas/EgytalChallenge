<script setup>
import { reactive, ref } from 'vue';
import { useAuthStore } from '@/stores/authContext'; '@/stores/auth';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();

const userData = reactive({
  name: '',
  email: '',
  password: '',
});
const errorMessage = ref('');
const successMessage = ref('');
const isLoading = ref(false);

const handleSignup = async () => {
  errorMessage.value = '';
  successMessage.value = '';
  isLoading.value = true;
  try {
    await authStore.signup(userData);
    successMessage.value = 'Signup successful! Congratulations 👏';
    setTimeout(() => {
        router.push('/');
    }, 1000);
  } catch (error) {
    errorMessage.value = 'Signup failed. Please try again.';
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div class="auth-container">
    <h1>Sign Up</h1>
    <form @submit.prevent="handleSignup">
      <div class="form-group">
        <label for="name">FullName:</label>
        <input
          type="text"
          id="name"
          v-model.trim="userData.name"
          required
          autocomplete="name"
        />
      </div>
      <div class="form-group">
        <label for="email">Email:</label>
        <input
          type="email"
          id="email"
          v-model.trim="userData.email"
          required
          autocomplete="email"
        />
      </div>
      <div class="form-group">
        <label for="password">Password:</label>
        <input
          type="password"
          id="password"
          v-model="userData.password"
          required
          autocomplete="new-password"
        />
      </div>
      <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
      <p v-if="successMessage" class="success-message">{{ successMessage }}</p>

      <button type="submit" :disabled="isLoading">
        {{ isLoading ? 'Signing up...' : 'Sign Up' }}
      </button>
    </form>
    <p>Already have an account? <router-link to="/login">Login</router-link></p>
  </div>
</template>

<style scoped>

@import '@/assets/auth-form.css';

button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}
.success-message {
  color: #3c763d;
  background-color: #dff0d8;
  border: 1px solid #d6e9c6;
  padding: 0.8rem;
  border-radius: 4px;
  margin-top: 1rem;
  font-size: 0.9rem;
  text-align: left;
}
</style>
