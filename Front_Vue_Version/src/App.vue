<script setup>
import { RouterLink, RouterView } from 'vue-router';
import { useAuthStore } from '@/stores/authContext'; '@/stores/authContext';

const authStore = useAuthStore();

const handleLogout = () => {
  authStore.logout();
};
</script>

<template>
  <header v-if="authStore.isAuthenticated">
    <h1>Task Management Challenge (Vue)</h1>
    <nav>
      <button @click="handleLogout">Logout</button>
    </nav>
  </header>
  <main>
    <RouterView />
  </main>
</template>

<style scoped>
/* Add styles for header, nav, footer, main layout */
header {
  background-color: #333;
  color: #fff;
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

header h1 {
  margin: 0;
  font-size: 2rem;
}

nav {
  display: flex;
  gap: 1rem;
  align-items: center;
}

nav a {
  color: #fff;
  text-decoration: none;
  padding: 0.5rem;
  border-radius: 4px;
}

nav a:hover,
nav a.router-link-exact-active {
  background-color: #555;
}

nav button {
  background-color: #d9534f;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  cursor: pointer;
  border-radius: 4px;
  font-size: 0.9rem;
}
nav button:hover {
  background-color: #c9302c;
}

main {
  max-width: 900px;
  margin: 2rem auto;
  padding: 1rem;
  /* background-color: #fff; */ /* Let pages handle their background if needed */
  /* box-shadow: 0 0 10px rgba(0,0,0,0.1); */
  /* border-radius: 5px; */
}

footer {
  text-align: center;
  margin-top: 2rem;
  padding: 1rem;
  color: #777;
  font-size: 0.9em;
}

@media (max-width: 600px) {
  header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  nav {
    width: 100%;
    justify-content: space-around;
  }
  main {
    margin: 1rem;
    padding: 0.5rem;
  }
}
</style>
