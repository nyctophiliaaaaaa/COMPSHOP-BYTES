<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import toast from '@/utils/toast.js'

import logoImage from '@/assets/logo.png';

const router = useRouter()
const code = ref('')
const countdown = ref(30)
let timer = null

// Timer Logic
const startTimer = () => {
    countdown.value = 30
    clearInterval(timer)
    timer = setInterval(() => {
        if (countdown.value > 0) countdown.value--
        else clearInterval(timer)
    }, 1000)
}

onMounted(() => startTimer())
onUnmounted(() => clearInterval(timer))

const handleVerifyCode = async () => {
    if (code.value.length < 4) {
        toast.warning('Please enter a valid code')
        return
    }

    const email = localStorage.getItem('resetEmail') // Get email from Step 1
    
    if (!email) {
      toast.error("Session expired. Please start over.");
      router.push('/forgot-password');
      return;
    }

    try {
      // Call Backend to Verify
      await axios.post('http://localhost:3000/api/auth/verify-code', {
        email: email,
        code: code.value
      })

      // If success
      toast.success('Code verified! Proceeding to set new password.')
      router.push('/set-new-password') 
    } catch (error) {
      console.error(error)
      toast.error('Invalid code. Check your terminal again.')
    }
}

const resendCode = async () => {
    const email = localStorage.getItem('resetEmail')
    if (countdown.value === 0 && email) {
        try {
            await axios.post('http://localhost:3000/api/auth/forgot-password', { email })
            toast.success('New code sent! Check backend terminal.')
            startTimer()
        } catch (e) {
            toast.error('Failed to resend code.')
        }
    }
}

const goBack = () => router.push('/forgot-password')
</script>

<template>
  <div class="code-entry-container">
    <div class="card">
      <button class="back-btn" @click="goBack">←</button>
      <div class="header">
        <img :src="logoImage" alt="Logo" class="logo-img" />
        <h1>Forgot Password?</h1>
      </div>
      
      <p class="description">
        Verify your email to change your password.<br>
        (Check your VS Code Terminal for the code)
      </p>
      
      <form @submit.prevent="handleVerifyCode">
        <div class="input-group">
          <input 
            v-model="code" 
            type="text" 
            placeholder="Enter code" 
            required 
            maxlength="6" 
            class="code-input" 
          />
          <span class="asterisk">*</span>
        </div>
        <button type="submit" class="continue-btn">CONTINUE</button>
      </form>
      
      <div class="resend-section">
        <span v-if="countdown > 0" class="countdown-text">
          Didn't receive a code? Resend in {{ countdown }}s
        </span>
        <a v-else href="#" @click.prevent="resendCode" class="resend-link">
          Didn't receive a code? <strong>Resend</strong>
        </a>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Responsive Code Entry Page */
.code-entry-container { 
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
  text-align: center; 
  box-shadow: 0 4px 20px rgba(0,0,0,0.05); 
}

.back-btn { 
  position: absolute; 
  top: clamp(14px, 2vw, 22px); 
  left: clamp(14px, 2vw, 22px); 
  background: none; 
  border: none; 
  font-size: clamp(1.4rem, 2vw, 1.9rem); 
  cursor: pointer; 
  color: #333; 
  padding: clamp(3px, 0.5vw, 6px); 
  transition: transform 0.2s; 
}

.back-btn:hover { transform: translateX(-3px); }

.header { 
  display: flex; 
  justify-content: center; 
  align-items: center; 
  gap: clamp(8px, 1.2vw, 14px); 
  margin-top: clamp(0.6rem, 1.2vw, 1.1rem); 
  margin-bottom: clamp(1rem, 2vw, 1.8rem); 
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
  margin-bottom: clamp(1.2rem, 2.5vw, 2.2rem); 
  position: relative; 
}

.code-input { 
  width: 100%; 
  padding: clamp(0.8rem, 1.5vw, 1.3rem); 
  border: none; 
  border-radius: clamp(8px, 1.2vw, 12px); 
  font-size: var(--text-md); 
  font-family: var(--font-primary);
  background: white; 
  outline: none; 
  color: var(--color-text-primary); 
  text-align: center; 
  letter-spacing: 0.5em; 
  font-weight: var(--weight-semibold); 
}

.code-input::placeholder { 
  color: var(--color-text-light); 
  letter-spacing: normal; 
  font-weight: var(--weight-regular); 
}

.asterisk { 
  position: absolute; 
  right: clamp(10px, 1.5vw, 18px); 
  top: 50%; 
  transform: translateY(-50%); 
  color: #ff4d4d; 
  font-size: clamp(1rem, 1.4vw, 1.4rem); 
  pointer-events: none; 
}

.continue-btn { 
  width: 100%; 
  padding: clamp(0.7rem, 1.4vw, 1.2rem); 
  background-color: #2d3446; 
  color: var(--color-text-inverse); 
  border: none; 
  border-radius: clamp(6px, 1vw, 10px); 
  font-size: var(--text-md); 
  font-family: var(--font-primary);
  font-weight: var(--weight-semibold); 
  cursor: pointer; 
  letter-spacing: var(--tracking-wide); 
  margin-bottom: clamp(1rem, 2vw, 1.8rem); 
  transition: background-color 0.3s; 
}

.continue-btn:hover { background-color: #3b4559; }

.resend-section { 
  font-size: var(--text-sm); 
  color: var(--color-text-muted); 
  margin-top: clamp(0.6rem, 1.2vw, 1.1rem); 
}

.countdown-text { color: var(--color-text-muted); }

.resend-link { 
  color: var(--color-text-primary); 
  text-decoration: none; 
}

.resend-link strong { 
  text-decoration: underline; 
  font-weight: var(--weight-semibold); 
}

.resend-link:hover strong { color: #0044cc; }
</style>