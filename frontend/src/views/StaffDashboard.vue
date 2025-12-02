<template>
  <div class="staff-container">
    <h1>Staff Dashboard</h1>
    <p>Staff Access Only. You are logged in.</p>
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
.staff-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 50px;
  font-family: sans-serif;
}
.logout-btn {
  margin-top: 20px;
  padding: 10px 20px;
  background-color: #ff4a4a;
  color: white;
  border: none;
  cursor: pointer;
}
</style>