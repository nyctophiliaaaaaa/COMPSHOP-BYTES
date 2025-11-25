<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()
const newPassword = ref('')
const confirmPassword = ref('')
const showPassword = ref(false)
const handleResetPassword = () => {
  if (newPassword.value !== confirmPassword.value) {
    alert('Passwords do not match.')
    return
  }
  
  alert('Password has been successfully reset! Redirecting to login.')
  router.push('/')
}
const goBack = () => {
  router.push('/enter-code')
}
</script>
<template>
  <div class="container">
    <div class="card">
      
      <button class="back-btn" @click="goBack">
        ←
      </button>
      <div class="header">
        <span class="icon">🥡</span>
        <h1>Set New Password</h1>
      </div>
      <p class="description">
        Enter your new password below.
      </p>
      <form @submit.prevent="handleResetPassword">
        
        <div class="input-group password-group">
          <input 
            v-model="newPassword" 
            :type="showPassword ? 'text' : 'password'" 
            placeholder="Enter new password" 
            required
          />
          <button type="button" class="eye-btn" @click="showPassword = !showPassword">
            <span v-if="showPassword" class="slashed-eye">
                👁️
                <div class="slash"></div>
            </span>
            <span v-else>👁️</span>
          </button>
        </div>
        <div class="input-group password-group">
          <input 
            v-model="confirmPassword" 
            :type="showPassword ? 'text' : 'password'" 
            placeholder="Confirm new password" 
            required
          />
        </div>
        <button type="submit" class="submit-btn">
          UPDATE PASSWORD
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
  margin-bottom: 1.5rem;
  position: relative;
}
input {
  width: 100%;
  padding: 1rem;
  border: none; 
  border-radius: 12px;
  font-size: 0.95rem;
  background: white;
  outline: none;
  color: #555;
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
  margin-top: 2rem;
}
.submit-btn:hover {
  background-color: #3b4559;
}
.password-group input {
  padding-right: 50px; 
}
.eye-btn {
  position: absolute;
  right: 10px; 
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
.slashed-eye {
    position: relative;
    display: inline-block;
}
.slash {
    position: absolute;
    width: 100%; 
    height: 2px;
    background-color: #555;
    top: 50%;
    left: 0;
    transform: rotate(45deg);
    pointer-events: none;
}
</style>