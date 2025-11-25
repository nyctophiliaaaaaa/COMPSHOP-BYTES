<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()
const code = ref('')
const countdown = ref(30)
let timer = null
const startTimer = () => {
    countdown.value = 30
    clearInterval(timer)
    timer = setInterval(() => {
        if (countdown.value > 0) {
            countdown.value--
        } else {
            clearInterval(timer)
        }
    }, 1000)
}
onMounted(() => {
    startTimer()
})
onUnmounted(() => {
    clearInterval(timer)
})
const handleVerifyCode = () => {
    if (code.value.length < 4) {
        alert('Please enter a valid code')
        return
    }

    alert('Code verified! Proceeding to set new password.')
    router.push('/set-new-password') 
}
const resendCode = () => {
    if (countdown.value === 0) {
        alert('Resending code...')
        startTimer()
    }
}
const goBack = () => {
  router.push('/forgot-password')
}
</script>
<template>
  <div class="code-entry-container">
    <div class="card">

      <button class="back-btn" @click="goBack">
        ←
      </button>

      <div class="header">
        <span class="icon">🥡</span>
        <h1>Forgot Password?</h1>
      </div>
      
      <p class="description">
        Verify your email to change your password.
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
        
        <button type="submit" class="continue-btn">
          CONTINUE
        </button>
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
.code-entry-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: white;
  padding: 20px;
}
.card {
  position: relative;
  background-color: #e6e6e6;
  width: 100%;
  max-width: 500px;
  padding: 3rem 2.5rem;
  border-radius: 20px;
  text-align: center;
  box-shadow: 0 4px 20px rgba(0,0,0,0.05);
}
.back-btn {
  position: absolute;
  top: 20px;
  left: 20px;
  background: none;
  border: none;
  font-size: 1.8rem;
  cursor: pointer;
  color: #333;
  padding: 5px;
  transition: transform 0.2s;
}
.back-btn:hover {
  transform: translateX(-3px);
}
.header {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  margin-top: 1rem;
  margin-bottom: 1.5rem;
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
  margin-bottom: 2rem;
  position: relative;
}
.code-input {
  width: 100%;
  padding: 1.2rem;
  border: none;
  border-radius: 12px;
  font-size: 1.1rem;
  background: white;
  outline: none;
  color: #333;
  text-align: center;
  letter-spacing: 0.5em;
  font-weight: 600;
}
.code-input::placeholder {
  color: #aaa;
  letter-spacing: normal;
  font-weight: 400;
}
.asterisk {
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: #ff4d4d;
  font-size: 1.3rem;
  pointer-events: none;
}
.continue-btn {
  width: 100%;
  padding: 1.1rem;
  background-color: #2d3446;
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
  letter-spacing: 0.5px;
  margin-bottom: 1.5rem;
  transition: background-color 0.3s;
}
.continue-btn:hover {
  background-color: #3b4559;
}
.resend-section {
  font-size: 0.95rem;
  color: #666;
  margin-top: 1rem;
}
.countdown-text {
  color: #666;
}
.resend-link {
  color: #2d3446;
  text-decoration: none;
}
.resend-link strong {
  text-decoration: underline;
  font-weight: 600;
}
.resend-link:hover strong {
  color: #0044cc;
}
</style>