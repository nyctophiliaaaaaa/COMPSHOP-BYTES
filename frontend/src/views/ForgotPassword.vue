<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()
const email = ref('')
const handleSendCode = () => {
  alert('Code sent to ' + email.value) 
  router.push('/enter-code') 
}
const goBack = () => {
  router.push('/')
}
</script>
<template>
  <div class="container">
    <div class="card">
      
      <button class="back-btn" @click="goBack">
        ←
      </button>
      <div class="header">
        <span class="icon">🥡</span>
        <h1>Forgot Password?</h1>
      </div>
      <p class="description">
        Enter the email address associated with your account.
      </p>
      <form @submit.prevent="handleSendCode">
        
        <div class="input-group">
          <input 
            v-model="email" 
            type="email" 
            placeholder="Enter your email" 
            required
          />
        </div>
        <button type="submit" class="submit-btn">
          SUBMIT
        </button>
      </form>
    </div>
  </div>
</template>
<style scoped>
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: white;
}
.card {
  position: relative;
  background-color: #e6e6e6;
  width: 100%;
  max-width: 500px;
  padding: 3rem 2.5rem;
  border-radius: 20px;
  text-align: left;
  box-shadow: 0 4px 20px rgba(0,0,0,0.05);
}
.back-btn {
  position: absolute;
  top: 20px;
  left: 20px;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #333;
  padding: 5px;
}
.header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 1rem;
  margin-bottom: 1rem;
}
.header h1 {
  font-size: 1.8rem;
  font-weight: 700;
  color: #000;
  margin: 0;
}
.icon {
  font-size: 2rem;
  line-height: 1;
}
.description {
  color: #666;
  font-size: 1rem;
  margin-bottom: 2.5rem;
  line-height: 1.5;
}
.input-group {
  margin-bottom: 2.5rem;
}
input {
  width: 100%;
  padding: 1rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 1rem;
  background: white;
  outline: none;
  color: #333;
}
input::placeholder {
  color: #aaa;
}
.submit-btn {
  width: 100%;
  padding: 1rem;
  background-color: #2d3446;
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
  letter-spacing: 0.5px;
}
.submit-btn:hover {
  background-color: #3b4559;
}
</style>