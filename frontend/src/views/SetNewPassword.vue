<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import toast from '@/utils/toast.js'

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
    toast.warning('Passwords do not match.')
    return
  }
  
  const email = localStorage.getItem('resetEmail')
  
  if (!email) {
      toast.error("Session expired.");
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

    toast.success('Password has been successfully reset! Redirecting to login.')
    localStorage.removeItem('resetEmail') // Clean up
    router.push('/') // Back to Login
  } catch (error) {
    console.error(error)
    toast.error('Failed to reset password. Please try again.')
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
/* Responsive Set New Password Page */
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
  margin-bottom: clamp(1rem, 2vw, 1.8rem); 
  position: relative; 
}

input { 
  width: 100%; 
  padding: clamp(0.7rem, 1.3vw, 1.1rem); 
  border: none; 
  border-radius: clamp(8px, 1.2vw, 12px); 
  font-size: var(--text-base); 
  font-family: var(--font-primary);
  background: white; 
  outline: none; 
  color: var(--color-text-secondary); 
}

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
  margin-top: clamp(1.2rem, 2.5vw, 2.2rem); 
}

.submit-btn:disabled { 
  background-color: #777; 
  cursor: not-allowed; 
}

.password-group input { 
  padding-right: clamp(40px, 5vw, 55px); 
}

.eye-btn { 
  position: absolute; 
  right: clamp(8px, 1vw, 12px); 
  top: 50%; 
  transform: translateY(-50%); 
  background: none; 
  border: none; 
  cursor: pointer; 
  padding: clamp(3px, 0.5vw, 6px); 
  display: flex; 
  align-items: center; 
  justify-content: center; 
}

.eye-icon-img { 
  width: clamp(18px, 2vw, 26px); 
  height: auto; 
}
</style>