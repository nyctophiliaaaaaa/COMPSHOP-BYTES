<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import toast from '@/utils/toast.js'

import logoImage from '@/assets/logo.png';
import hiddenEyeIcon from '@/assets/hidden-eye.jpg'
import openEyeIcon from '@/assets/open-eye.png'

const router = useRouter()
const showPassword = ref(false)
const isLoading = ref(false)

const credentials = ref({ 
  username: '', 
  email: '', 
  password: '', 
  confirmPassword: '' 
})

const handleSignUp = async () => {
  if (credentials.value.password !== credentials.value.confirmPassword) {
    toast.warning('Passwords do not match')
    return
  }

  isLoading.value = true

  try {
    const response = await axios.post('http://localhost:3000/api/auth/register', {
      username: credentials.value.username,
      email: credentials.value.email,
      password: credentials.value.password
    });

    toast.success('Account created successfully! Please login.');
    router.push('/'); 

  } catch (error) {
    console.error(error);
    if (error.response && error.response.data.error) {
      toast.error("Error: " + error.response.data.error);
    } else {
      toast.error("Registration failed. Please check if the backend is running.");
    }
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="signup-container">
    <div class="card">
      
      <div class="header">
        <img :src="logoImage" alt="Logo" class="logo-img" />
        <h1>Sign Up</h1>
      </div>
      
      <form @submit.prevent="handleSignUp">
        
        <div class="input-group">
          <input 
            v-model="credentials.username" 
            type="text" 
            placeholder="Enter your username" 
            required
          />
          <span class="asterisk">*</span>
        </div>
        
        <div class="input-group">
          <input 
            v-model="credentials.email" 
            type="email" 
            placeholder="Enter your email" 
            required
          />
          <span class="asterisk">*</span>
        </div>
        
        <div class="input-group password-group">
          <input 
            v-model="credentials.password" 
            :type="showPassword ? 'text' : 'password'" 
            placeholder="Enter your password" 
            required
          />
          <button type="button" class="eye-btn" @click="showPassword = !showPassword">
            <img 
              :src="showPassword ? openEyeIcon : hiddenEyeIcon" 
              alt="Toggle Password" 
              class="eye-icon-img" 
            />
          </button>
          <span class="asterisk">*</span>
        </div>
        
        <div class="input-group password-group">
          <input 
            v-model="credentials.confirmPassword" 
            :type="showPassword ? 'text' : 'password'" 
            placeholder="Confirm your password" 
            required
          />
          <button type="button" class="eye-btn" @click="showPassword = !showPassword">
            <img 
              :src="showPassword ? openEyeIcon : hiddenEyeIcon" 
              alt="Toggle Password" 
              class="eye-icon-img" 
            />
          </button>
          <span class="asterisk">*</span>
        </div>
        
        <button type="submit" class="signup-btn" :disabled="isLoading">
          {{ isLoading ? 'CREATING ACCOUNT...' : 'SIGN UP' }}
        </button>
      </form>
      
      <div class="footer">
        <p>Already have an account?</p>
        <router-link to="/">Click here to login</router-link>
      </div>
    </div>
  </div>
</template>

<style scoped>
.signup-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: white;
  padding: clamp(1rem, 3vw, 2rem);
}

.card {
  background-color: #e6e6e6;
  width: 100%;
  max-width: clamp(320px, 40vw, 480px);
  padding: clamp(2rem, 4vw, 3.5rem) clamp(1.5rem, 3vw, 2.5rem);
  border-radius: clamp(12px, 2vw, 20px);
  text-align: center;
  box-shadow: 0 4px 20px rgba(0,0,0,0.05);
}

.header {
  margin-bottom: clamp(1.2rem, 2.5vw, 2rem);
  display: flex;
  justify-content: center;
  align-items: center;
  gap: clamp(8px, 1.2vw, 14px);
}

.logo-img {
  width: clamp(38px, 5vw, 55px); 
  height: auto;
  object-fit: contain;
}

h1 {
  font-size: var(--text-2xl); 
  font-weight: var(--weight-semibold); 
  color: var(--color-text-primary);
  margin: 0;
  line-height: var(--leading-tight);
}

.input-group {
  margin-bottom: clamp(1rem, 2vw, 1.5rem);
  position: relative;
}

.password-group input {
  padding-right: clamp(40px, 5vw, 55px);
}

input {
  width: 100%;
  padding: clamp(0.7rem, 1.3vw, 1.1rem) clamp(0.9rem, 1.5vw, 1.3rem);
  border: none;
  border-radius: clamp(8px, 1.2vw, 12px);
  font-size: var(--text-base);
  font-family: var(--font-primary);
  background: white;
  outline: none;
  color: var(--color-text-secondary);
}

input::placeholder {
   color: var(--color-text-light); 
}

.asterisk {
  position: absolute;
  right: clamp(10px, 1.5vw, 18px);
  top: clamp(14px, 1.8vw, 20px);
  color: #ff4d4d;
  font-size: clamp(0.9rem, 1.2vw, 1.2rem);
  pointer-events: none;
}

.eye-btn {
  position: absolute;
  right: clamp(30px, 4vw, 45px);
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  padding: clamp(3px, 0.5vw, 6px);
  display: flex;    
  align-items: center; 
}

.eye-icon-img {
  width: clamp(18px, 2vw, 26px); 
  height: auto;
}

.footer {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: clamp(0.3rem, 0.6vw, 0.5rem);
  margin-top: clamp(1.2rem, 2.5vw, 2rem);
  font-size: var(--text-sm);
}

.footer p {
  color: var(--color-text-primary);
  margin: 0;
  font-weight: var(--weight-medium);
}

.footer a {
  color: #0044cc;
  text-decoration: underline;
  font-weight: var(--weight-medium);
}

.signup-btn {
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
  margin-bottom: clamp(0.3rem, 0.6vw, 0.5rem);
}

.signup-btn:hover { 
  background-color: #3b4559; 
}

.signup-btn:disabled {
  background-color: #777;
  cursor: not-allowed;
}
</style>