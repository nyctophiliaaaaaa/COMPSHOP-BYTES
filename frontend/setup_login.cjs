const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Updating Slash Icon Size...');

const currentDir = process.cwd();

// --- STEP 1: Install Vue Router (If needed) ---
if (!fs.existsSync(path.join(currentDir, 'node_modules', 'vue-router'))) {
    console.log('📦 Installing vue-router...');
    try {
        execSync('npm install vue-router', { stdio: 'inherit' });
    } catch (e) {
        // Ignore if already installed
    }
}

// --- STEP 2: Define Content ---

const files = {
    // 1. MAIN ENTRY
    'src/main.js': `import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './assets/main.css'

const app = createApp(App)
app.use(router)
app.mount('#app')`,

    // 2. APP ROOT
    'src/App.vue': `<script setup>
import { RouterView } from 'vue-router'
</script>

<template>
  <RouterView />
</template>`,

    // 3. ROUTER
    'src/router/index.js': `import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/Login.vue'
import ForgotPasswordView from '../views/ForgotPassword.vue'

const Dashboard = { template: '<div style="padding:50px; text-align:center;"><h1>Dashboard</h1></div>' }

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'login', component: LoginView },
    { path: '/forgot-password', name: 'forgot-password', component: ForgotPasswordView },
    { path: '/dashboard', name: 'dashboard', component: Dashboard }
  ]
})
export default router`,

    // 4. GLOBAL CSS
    'src/assets/main.css': `
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');

*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  position: relative;
}

body {
  min-height: 100vh;
  background-color: #ffffff;
  font-family: 'Poppins', sans-serif;
  color: #333;
}`,

    // 5. LOGIN PAGE (Fixed Slash CSS)
    'src/views/Login.vue': `<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const isStaffMode = ref(false)
const showPassword = ref(false)
const isLoading = ref(false)
const credentials = ref({ username: '', password: '' })

const toggleMode = () => {
  isStaffMode.value = !isStaffMode.value
  credentials.value = { username: '', password: '' }
}

const handleLogin = () => {
  isLoading.value = true
  setTimeout(() => {
    if (credentials.value.password === 'password') {
      router.push('/dashboard')
    } else {
      alert('Invalid password (try "password")')
    }
    isLoading.value = false
  }, 1000)
}
</script>

<template>
  <div class="login-container">
    <div class="card">
      
      <div class="header">
        <span class="icon">🥡</span> 
        <h1>{{ isStaffMode ? 'Staff Login' : 'Login' }}</h1>
      </div>

      <form @submit.prevent="handleLogin">
        
        <div class="input-group">
          <input 
            v-model="credentials.username" 
            type="text" 
            :placeholder="isStaffMode ? 'Enter Staff ID' : 'Enter your username or email'" 
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
            <span v-if="showPassword" class="slashed-eye">
                👁️
                <div class="slash"></div>
            </span>
            <span v-else>👁️</span>
          </button>
          <span class="asterisk">*</span>
        </div>

        <div class="links">
          <a href="#">{{ isStaffMode ? 'Staff Recovery' : 'Create Account' }}</a>
          <router-link to="/forgot-password">Forgot password?</router-link>
        </div>

        <button type="submit" class="login-btn">
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

.icon {
  font-size: 2.5rem; 
  line-height: 1;
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

/* Eye Button Styles */
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
  justify-content: center;
  font-size: 1.3rem; 
}

/* Slashed Eye Custom CSS */
.slashed-eye {
    position: relative;
    display: inline-block;
}

/* FIXED SLASH SIZE */
.slash {
    position: absolute;
    width: 100%; /* Reduced from 120% to fit */
    height: 2px;
    background-color: #555;
    top: 50%;
    left: 0;
    transform: rotate(45deg);
    pointer-events: none;
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

.login-btn:hover { background-color: #3b4559; }

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
</style>`,

    // 6. FORGOT PASSWORD PAGE (Preserved)
    'src/views/ForgotPassword.vue': `<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const email = ref('')

const handleSendCode = () => {
  alert('Code sent to ' + email.value)
}

const goBack = () => {
  router.push('/')
}
</script>

<template>
  <div class="container">
    <div class="card">
      
      <!-- Back Arrow -->
      <button class="back-btn" @click="goBack">
        ←
      </button>

      <!-- Header with Icon on LEFT -->
      <div class="header">
        <span class="icon">🥡</span>
        <h1>Forgot Password?</h1>
      </div>

      <!-- Description -->
      <p class="description">
        Enter the email address associated with your account.
      </p>

      <!-- Form -->
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
</style>`
};

// --- STEP 3: Write Files ---
const dirs = ['src/router', 'src/views', 'src/assets'];
dirs.forEach(d => {
    const fullPath = path.join(currentDir, d);
    if (!fs.existsSync(fullPath)) fs.mkdirSync(fullPath, { recursive: true });
});

Object.keys(files).forEach(f => {
    fs.writeFileSync(path.join(currentDir, f), files[f]);
    console.log('✅ Updated: ' + f);
});

console.log('🎉 Fixed Slash Size! Check your browser.');