<script setup>
import { onMounted, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import HeaderBar from '@/components/HeaderBar.vue'

const router = useRouter()
const route = useRoute()

const method = ref(route.query.method === 'maya' ? 'Maya' : 'GCash')

onMounted(() => {
  setTimeout(() => {
    router.push({ 
        path: '/payment-success', 
        query: { 
            method: route.query.method,
            total: route.query.total 
        } 
    })
  }, 3000)
})
</script>

<template>
  <div class="process-container">
    <HeaderBar />
    
    <div class="card">
      <div class="spinner"></div>
      <h2>Processing Your Payment...</h2>
      <p>Please wait while we confirm your payment with {{ method }}.</p>
      <p class="warning">Do not close or refresh this page.</p>
      
      <h3>Order #A12-4391</h3>
      
      <div class="redirect-box">
        Redirecting to Order Status...
      </div>
    </div>
  </div>
</template>

<style scoped>
.process-container { 
  min-height: 100vh; 
  background-color: #f5f5f5; 
  display: flex; 
  flex-direction: column;
  font-size: clamp(14px, 1vw + 10px, 16px);
}

.card { 
  background: white; 
  margin: clamp(1.5rem, 4vw, 3.5rem) auto; 
  padding: clamp(2rem, 5vw, 4.5rem) clamp(1.2rem, 2.5vw, 2.5rem); 
  text-align: center; 
  max-width: clamp(400px, 50vw, 620px); 
  width: 90%; 
  border-radius: clamp(8px, 1.2vw, 14px); 
  box-shadow: 0 4px 15px rgba(0,0,0,0.05); 
}

.spinner { 
  width: clamp(40px, 5vw, 65px); 
  height: clamp(40px, 5vw, 65px); 
  border: clamp(4px, 0.5vw, 7px) solid #e0e0e0; 
  border-top: clamp(4px, 0.5vw, 7px) solid #888; 
  border-radius: 50%; 
  margin: 0 auto clamp(1.2rem, 2.5vw, 2.2rem); 
  animation: spin 1s linear infinite; 
}

@keyframes spin { 
  0% { transform: rotate(0deg); } 
  100% { transform: rotate(360deg); } 
}

h2 { 
  margin-bottom: clamp(0.6rem, 1.2vw, 1.1rem); 
  color: #333;
  font-size: clamp(1.2rem, 1.8vw, 1.6rem);
}

p { 
  color: #666; 
  margin-bottom: clamp(0.3rem, 0.6vw, 0.5rem);
  font-size: clamp(0.85rem, 1.1vw, 1.05rem);
}

.warning { 
  color: #888; 
  font-size: clamp(0.75rem, 1vw, 0.95rem); 
  margin-bottom: clamp(1.2rem, 2.5vw, 2.2rem); 
}

h3 { 
  margin-bottom: clamp(1.2rem, 2.5vw, 2.2rem); 
  color: #333;
  font-size: clamp(1rem, 1.4vw, 1.3rem);
}

.redirect-box { 
  border: 1px solid #ffcc80; 
  color: #333; 
  padding: clamp(0.5rem, 1vw, 0.9rem) clamp(1.2rem, 2.5vw, 2.5rem); 
  border-radius: 20px; 
  display: inline-block; 
  font-size: clamp(0.75rem, 1vw, 0.95rem); 
}
</style>