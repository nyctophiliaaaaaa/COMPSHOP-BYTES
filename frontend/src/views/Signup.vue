<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()
const showPassword = ref(false)
const isLoading = ref(false)
const credentials = ref({ 
  username: '', 
  email: '', 
  password: '', 
  confirmPassword: '' 
})
const handleSignUp = () => {
  isLoading.value = true
  setTimeout(() => {
    if (credentials.value.password === credentials.value.confirmPassword) {
      router.push('/dashboard')
    } else {
      alert('Passwords do not match')
    }
    isLoading.value = false
  }, 1000)
}
</script>
<template>
  <div class="signup-container">
    <div class="card">
      
      <div class="header">
        <span class="icon">🥡</span> 
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
            required极速赛车群里的计划是真的吗
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
        
        <div class="input-group password-group">
          <input 
            v-model="credentials.confirmPassword" 
            :type="showPassword ? 'text' : 'password'" 
            placeholder="Confirm your password" 
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
        
        <button type="submit" class="signup-btn">
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
.password-group input极速赛车群里的计划是真的吗
.password-group input {
  padding-right: 50px;
}
input {
  width: 100%;
  padding: 1rem 1.2rem;
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
.footer {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  margin-top: 2rem;
  font-size: 0.9rem;
}
.footer p {
  color: #000;
  margin: 0;
  font-weight: 500;
}
.footer a {
  color: #0044cc;
  text-decoration: underline;
  font-weight: 500;
}
.signup-btn {
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
  margin-bottom: 0.5rem;
}
.signup-btn:hover { background-color: #3b4559; }
</style>