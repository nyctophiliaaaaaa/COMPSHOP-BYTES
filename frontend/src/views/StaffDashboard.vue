<template>
  <div class="staff-container">
    <h1>Staff Dashboard</h1>
    <p>Welcome. You are logged in as a Staff Member.</p>
    <button class="logout-btn" @click="handleLogout">Logout</button>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const handleLogout = () => {
  localStorage.removeItem('userRole'); 
  router.push({ name: 'login' });
};
</script>

<style scoped>
/* Responsive Staff Dashboard */
.staff-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: clamp(60px, 10vw, 120px);
  font-family: 'Segoe UI', sans-serif;
  padding-left: clamp(1rem, 3vw, 2rem);
  padding-right: clamp(1rem, 3vw, 2rem);
}

h1 { 
  color: #2c3e50;
  font-size: clamp(1.5rem, 3vw, 2.5rem);
  margin-bottom: clamp(0.5rem, 1vw, 1rem);
}

p {
  font-size: clamp(0.9rem, 1.2vw, 1.1rem);
  color: #555;
}

.logout-btn {
  margin-top: clamp(15px, 2.5vw, 25px);
  padding: clamp(8px, 1.2vw, 12px) clamp(16px, 2.5vw, 24px);
  background-color: #ff4a4a;
  color: white;
  border: none;
  border-radius: clamp(4px, 0.5vw, 6px);
  cursor: pointer;
  font-weight: bold;
  font-size: clamp(0.85rem, 1.1vw, 1rem);
  transition: background-color 0.2s;
}

.logout-btn:hover {
  background-color: #e63939;
}
</style>
