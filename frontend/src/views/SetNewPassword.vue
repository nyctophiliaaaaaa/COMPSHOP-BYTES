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
  margin-bottom: clamp(1rem, 2vw, 1.8rem); 
  position: relative; 
}

input { 
  width: 100%; 
  padding: clamp(0.7rem, 1.3vw, 1.1rem); 
  border: none; 
  border-radius: clamp(8px, 1.2vw, 12px); 
  font-size: clamp(0.8rem, 1vw, 1rem); 
  background: white; 
  outline: none; 
  color: #555; 
}

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