<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios' // 1. Import Axios

import logoImage from '@/assets/logo.png';
import hiddenEyeIcon from '@/assets/hidden-eye.jpg'
import openEyeIcon from '@/assets/open-eye.png'

const router = useRouter()
const isStaffMode = ref(false)
const showPassword = ref(false)
const isLoading = ref(false)
const credentials = ref({ username: '', password: '' })

const toggleMode = () => {
  isStaffMode.value = !isStaffMode.value
  credentials.value = { username: '', password: '' }
}

const handleLogin = async () => {
  isLoading.value = true
  
  try {
    // 2. Call your Node.js + Supabase API
    const response = await axios.post('http://localhost:3000/api/auth/login', {
      username: credentials.value.username,
      password: credentials.value.password
    });

    // 3. Extract data from backend response
    const { user, message } = response.data;
    const role = user.role; // 'Admin', 'Staff', or 'Customer'

    // 4. Save session data
    localStorage.setItem('userRole', role);
    localStorage.setItem('userId', user.id);
    localStorage.setItem('username', user.username);

    // 5. Redirect based on Database Role
    if (role === 'Admin' || role === 'Staff') {
      router.push({ name: 'staff-dashboard' }); 
    } else {
      router.push({ name: 'dashboard' }); // Customer goes to Menu
    }

  } catch (error) {
    // Handle Errors (Wrong password, etc.)
    if (error.response && error.response.status === 401) {
      alert('Invalid username or password.');
    } else {
      console.error(error);
      alert('Server error. Is the backend running?');
    }
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="login-container">
    <div class="card">
      
      <div class="header">
        <img :src="logoImage" alt="Logo" class="logo-img" />
        <h1>{{ isStaffMode ? 'Staff Login' : 'Login' }}</h1>
      </div>

      <form @submit.prevent="handleLogin">
        
        <div class="input-group">
          <input 
            v-model="credentials.username" 
            type="text" 
            :placeholder="isStaffMode ? 'Enter Staff Username' : 'Enter your username'" 
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

        <div class="links">
          <router-link to="/signup">{{ isStaffMode ? 'Staff Recovery' : 'Create Account' }}</router-link>
          <router-link to="/forgot-password">Forgot password?</router-link>
        </div>

        <button type="submit" class="login-btn" :disabled="isLoading">
          {{ isLoading ? 'LOGGING IN...' : 'LOGIN' }}
        </button>

      </form>

      <div class="footer">
        <p>{{ isStaffMode ? 'Not a staff member?' : 'Are you a staff member?' }}</p>
        <a href="#" @click.prevent="toggleMode" class="staff-link">
            {{ isStaffMode ? 'Click here for Customer Login' : 'Click here to Login' }}
        </a>
      </div>

    </div>
  </div>
</template>

<style scoped>
/* Responsive Login Page */
.login-container {
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

input::placeholder { color: var(--color-text-light); }

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

.links {
  display: flex;
  justify-content: space-between;
  margin-bottom: clamp(1.2rem, 2.5vw, 2rem);
  font-size: var(--text-sm);
  padding: 0 clamp(3px, 0.5vw, 6px);
  flex-wrap: wrap;
  gap: clamp(0.5rem, 1vw, 1rem);
}

.links a {
  color: var(--color-text-primary);
  text-decoration: underline;
  font-weight: var(--weight-medium);
}

.login-btn {
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
  margin-bottom: clamp(1.5rem, 3vw, 2.5rem);
}

.login-btn:hover { 
  background-color: #3b4559; 
}

.login-btn:disabled {
  background-color: #999;
  cursor: not-allowed;
}

.footer p {
  margin-bottom: clamp(0.15rem, 0.3vw, 0.25rem);
  color: var(--color-text-primary);
  font-size: var(--text-sm);
}

.staff-link {
  color: #0044cc;
  text-decoration: underline;
  font-weight: var(--weight-medium);
  font-size: var(--text-sm);
  cursor: pointer;
}

/* Responsive breakpoints */
@media (max-width: 480px) {
  .links {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
}
</style>