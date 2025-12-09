<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import toast from '@/utils/toast.js'

import logoImage from '@/assets/logo.png';

const router = useRouter()
const email = ref('')
const isLoading = ref(false)

const handleSendCode = async () => {
  isLoading.value = true
  try {
    await axios.post('http://localhost:3000/api/auth/forgot-password', {
      email: email.value
    })

    localStorage.setItem('resetEmail', email.value)
    
    toast.success('Code generated! Please check your VS Code Terminal (Backend).') 
    router.push('/enter-code') 
  } catch (error) {
    console.error(error)
    toast.error('Error: Email not found or server issue.')
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
  gap: clamp(8px, 1.2vw, 14px); 
  margin-top: clamp(0.6rem, 1.2vw, 1.1rem); 
  margin-bottom: clamp(0.6rem, 1.2vw, 1.1rem); 
}

.logo-img { 
  width: clamp(38px, 5vw, 55px); 
  height: auto; 
  object-fit: contain; 
}

.header h1 { 
  font-size: var(--text-2xl); 
  font-weight: var(--weight-semibold); 
  color: var(--color-text-primary); 
  margin: 0; 
}

.description { 
  color: var(--color-text-muted); 
  font-size: var(--text-base); 
  margin-bottom: clamp(1.5rem, 3vw, 2.8rem); 
  line-height: var(--leading-normal); 
}

.input-group { 
  margin-bottom: clamp(1.5rem, 3vw, 2.8rem); 
}

input { 
  width: 100%; 
  padding: clamp(0.7rem, 1.3vw, 1.1rem); 
  border: 1px solid #ccc; 
  border-radius: clamp(6px, 0.8vw, 10px); 
  font-size: var(--text-base); 
  font-family: var(--font-primary);
  background: white; 
  outline: none; 
  color: var(--color-text-primary); 
}

input::placeholder { color: var(--color-text-light); }

.submit-btn { 
  width: 100%; 
  padding: clamp(0.7rem, 1.3vw, 1.1rem); 
  background-color: #2d3446; 
  color: var(--color-text-inverse); 
  border: none; 
  border-radius: clamp(6px, 1vw, 10px); 
  font-size: var(--text-md); 
  font-family: var(--font-primary);
  font-weight: var(--weight-semibold); 
  cursor: pointer; 
  letter-spacing: var(--tracking-wide); 
}

.submit-btn:hover { background-color: #3b4559; }
.submit-btn:disabled { background-color: #777; cursor: not-allowed; }
</style>