<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

import logoImage from '@/assets/logo.png';

const router = useRouter()
const email = ref('')
const isLoading = ref(false)

const handleSendCode = async () => {
  isLoading.value = true
  try {
    // 1. Call Backend to generate code
    await axios.post('http://localhost:3000/api/auth/forgot-password', {
      email: email.value
    })

    // 2. Save email locally so the next step knows who we are verifying
    localStorage.setItem('resetEmail', email.value)
    
    // 3. Notify user (Simulation)
    alert('Code generated! Please check your VS Code Terminal (Backend).') 
    router.push('/enter-code') 
  } catch (error) {
    console.error(error)
    alert('Error: Email not found or server issue.')
  } finally {
    isLoading.value = false
  }
}

const goBack = () => {
  router.push('/')
}
</script>

<template>
  <div class="container">
    <div class="card">
      <button class="back-btn" @click="goBack">←</button>
      <div class="header">
        <img :src="logoImage" alt="Logo" class="logo-img" />
        <h1>Forgot Password?</h1>
      </div>
      <p class="description">Enter the email address associated with your account.</p>
      <form @submit.prevent="handleSendCode">
        <div class="input-group">
          <input 
            v-model="email" 
            type="email" 
            placeholder="Enter your email" 
            required 
          />
        </div>
        <button type="submit" class="submit-btn" :disabled="isLoading">
          {{ isLoading ? 'SENDING...' : 'SUBMIT' }}
        </button>
      </form>
    </div>
  </div>
</template>

<style scoped>
/* Responsive Forgot Password Page */
.container { 
  display: flex; 
  justify-content: center; 
  align-items: center; 
  min-height: 100vh; 
  background-color: white;
  padding: clamp(1rem, 3vw, 2rem);
}

.card { 
  position: relative; 
  background-color: #e6e6e6; 
  width: 100%; 
  max-width: clamp(340px, 42vw, 520px); 
  padding: clamp(2rem, 4vw, 3.5rem) clamp(1.5rem, 3vw, 2.8rem); 
  border-radius: clamp(12px, 2vw, 20px); 
  text-align: left; 
  box-shadow: 0 4px 20px rgba(0,0,0,0.05); 
}

.back-btn { 
  position: absolute; 
  top: clamp(14px, 2vw, 22px); 
  left: clamp(14px, 2vw, 22px); 
  background: none; 
  border: none; 
  font-size: clamp(1.2rem, 1.8vw, 1.6rem); 
  cursor: pointer; 
  color: #333; 
  padding: clamp(3px, 0.5vw, 6px); 
}

.header { 
  display: flex; 
  align-items: center; 
  gap: clamp(10px, 1.5vw, 18px); 
  margin-top: clamp(0.6rem, 1.2vw, 1.1rem); 
  margin-bottom: clamp(0.6rem, 1.2vw, 1.1rem); 
}

.logo-img { 
  width: clamp(35px, 4.5vw, 55px); 
  height: auto; 
  object-fit: contain; 
}

.header h1 { 
  font-size: clamp(1.3rem, 2vw, 1.9rem); 
  font-weight: 700; 
  color: #000; 
  margin: 0; 
}

.description { 
  color: #666; 
  font-size: clamp(0.85rem, 1.1vw, 1.05rem); 
  margin-bottom: clamp(1.5rem, 3vw, 2.8rem); 
  line-height: 1.5; 
}

.input-group { 
  margin-bottom: clamp(1.5rem, 3vw, 2.8rem); 
}

input { 
  width: 100%; 
  padding: clamp(0.7rem, 1.3vw, 1.1rem); 
  border: 1px solid #ccc; 
  border-radius: clamp(6px, 0.8vw, 10px); 
  font-size: clamp(0.85rem, 1.1vw, 1.05rem); 
  background: white; 
  outline: none; 
  color: #333; 
}

input::placeholder { color: #aaa; }

.submit-btn { 
  width: 100%; 
  padding: clamp(0.7rem, 1.3vw, 1.1rem); 
  background-color: #2d3446; 
  color: white; 
  border: none; 
  border-radius: clamp(6px, 1vw, 10px); 
  font-size: clamp(0.9rem, 1.2vw, 1.15rem); 
  font-weight: 700; 
  cursor: pointer; 
  letter-spacing: 0.5px; 
}

.submit-btn:hover { background-color: #3b4559; }
.submit-btn:disabled { background-color: #777; cursor: not-allowed; }
</style>