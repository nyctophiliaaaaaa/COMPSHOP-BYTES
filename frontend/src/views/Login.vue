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
/* Your CSS remains exactly the same */
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: white; 
}

.card {
  background-color: #e6e6e6;
  width: 100%;
  max-width: 480px;
  padding: 3rem 2.5rem;
  border-radius: 20px;
  text-align: center;
  box-shadow: 0 4px 20px rgba(0,0,0,0.05);
}

.header {
  margin-bottom: 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 5px;
}

.logo-img {
  width: 60px; 
  height: auto;
  object-fit: contain;
}

h1 {
  font-size: 2.5rem; 
  font-weight: 400; 
  color: #2c3e50;
  margin: 0;
  line-height: 1;
  min-width: 200px; 
}

.input-group {
  margin-bottom: 1.5rem;
  position: relative;
}

.password-group input {
  padding-right: 50px;
}

input {
  width: 100%;
  padding: 1rem 1.2rem;
  border: none;
  border-radius: 12px;
  font-size: 0.95rem;
  background: white;
  outline: none;
  color: #555;
}

input::placeholder { color: #bbb; }

.asterisk {
  position: absolute;
  right: 15px;
  top: 18px;
  color: #ff4d4d;
  font-size: 1.2rem;
  pointer-events: none;
}

.eye-btn {
  position: absolute;
  right: 40px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  padding: 5px;
  display: flex;    
  align-items: center; 
}

.eye-icon-img {
  width: 24px; 
  height: auto;
}

.links {
  display: flex;
  justify-content: space-between;
  margin-bottom: 2rem;
  font-size: 0.9rem;
  padding: 0 5px;
}

.links a {
  color: #000;
  text-decoration: underline;
  font-weight: 500;
}

.login-btn {
  width: 100%;
  padding: 1rem;
  background-color: #2d3446;
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  letter-spacing: 0.5px;
  margin-bottom: 2.5rem;
}

.login-btn:hover { 
  background-color: #3b4559; 
}

.login-btn:disabled {
  background-color: #999;
  cursor: not-allowed;
}

.footer p {
  margin-bottom: 0.2rem;
  color: #000;
  font-size: 1rem;
}

.staff-link {
  color: #0044cc;
  text-decoration: underline;
  font-weight: 500;
  font-size: 1rem;
  cursor: pointer;
}
</style>