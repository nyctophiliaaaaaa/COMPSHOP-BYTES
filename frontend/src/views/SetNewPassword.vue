<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

import logoImage from '@/assets/logo.png';
import hiddenEyeIcon from '@/assets/hidden-eye.jpg';
import openEyeIcon from '@/assets/open-eye.png';

const router = useRouter()
const newPassword = ref('')
const confirmPassword = ref('')
const showPassword = ref(false)
const isLoading = ref(false)

const handleResetPassword = async () => {
  if (newPassword.value !== confirmPassword.value) {
    alert('Passwords do not match.')
    return
  }
  
  const email = localStorage.getItem('resetEmail')
  
  if (!email) {
      alert("Session expired.");
      router.push('/forgot-password');
      return;
  }

  isLoading.value = true

  try {
    // Call Backend to Update Password
    await axios.post('http://localhost:3000/api/auth/reset-password', {
      email: email,
      newPassword: newPassword.value
    })

    alert('Password has been successfully reset! Redirecting to login.')
    localStorage.removeItem('resetEmail') // Clean up
    router.push('/') // Back to Login
  } catch (error) {
    console.error(error)
    alert('Failed to reset password. Please try again.')
  } finally {
    isLoading.value = false
  }
}

const goBack = () => router.push('/enter-code')
</script>

<template>
  <div class="container">
    <div class="card">
      <button class="back-btn" @click="goBack">←</button>
      <div class="header">
        <img :src="logoImage" alt="Logo" class="logo-img" />
        <h1>Set New Password</h1>
      </div>
      <p class="description">Enter your new password below.</p>
      
      <form @submit.prevent="handleResetPassword">
        <div class="input-group password-group">
          <input 
            v-model="newPassword" 
            :type="showPassword ? 'text' : 'password'" 
            placeholder="Enter new password" 
            required 
          />
          <button type="button" class="eye-btn" @click="showPassword = !showPassword">
            <img :src="showPassword ? openEyeIcon : hiddenEyeIcon" class="eye-icon-img" />
          </button>
        </div>
        
        <div class="input-group password-group">
          <input 
            v-model="confirmPassword" 
            :type="showPassword ? 'text' : 'password'" 
            placeholder="Confirm new password" 
            required 
          />
          <button type="button" class="eye-btn" @click="showPassword = !showPassword">
            <img :src="showPassword ? openEyeIcon : hiddenEyeIcon" class="eye-icon-img" />
          </button>
        </div>
        
        <button type="submit" class="submit-btn" :disabled="isLoading">
            {{ isLoading ? 'UPDATING...' : 'UPDATE PASSWORD' }}
        </button>
      </form>
    </div>
  </div>
</template>

<style scoped>
.container { display: flex; justify-content: center; align-items: center; min-height: 100vh; background-color: white; }
.card { position: relative; background-color: #e6e6e6; width: 100%; max-width: 500px; padding: 3rem 2.5rem; border-radius: 20px; text-align: left; box-shadow: 0 4px 20px rgba(0,0,0,0.05); }
.back-btn { position: absolute; top: 20px; left: 20px; background: none; border: none; font-size: 1.5rem; cursor: pointer; color: #333; padding: 5px; }
.header { display: flex; align-items: center; gap: 15px; margin-top: 1rem; margin-bottom: 1rem; }
.logo-img { width: 50px; height: auto; object-fit: contain; }
.header h1 { font-size: 1.8rem; font-weight: 700; color: #000; margin: 0; }
.description { color: #666; font-size: 1rem; margin-bottom: 2.5rem; line-height: 1.5; }
.input-group { margin-bottom: 1.5rem; position: relative; }
input { width: 100%; padding: 1rem; border: none; border-radius: 12px; font-size: 0.95rem; background: white; outline: none; color: #555; }
.submit-btn { width: 100%; padding: 1rem; background-color: #2d3446; color: white; border: none; border-radius: 10px; font-size: 1.1rem; font-weight: 700; cursor: pointer; letter-spacing: 0.5px; margin-top: 2rem; }
.submit-btn:disabled { background-color: #777; cursor: not-allowed; }
.password-group input { padding-right: 50px; }
.eye-btn { position: absolute; right: 10px; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; padding: 5px; display: flex; align-items: center; justify-content: center; }
.eye-icon-img { width: 24px; height: auto; }
</style>