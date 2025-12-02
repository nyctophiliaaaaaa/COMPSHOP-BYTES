<script setup>
import { onMounted, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const method = ref(route.query.method === 'maya' ? 'Maya' : 'GCash')

onMounted(() => {
  setTimeout(() => {
    // 🟢 FORWARD TOTAL TO SUCCESS PAGE
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
    <div class="navbar">
        <div class="brand">🥡 CompShop Bytes</div>
        <div class="nav-right">Station A12 🛒 👤</div>
    </div>
    
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
.process-container { min-height: 100vh; background-color: #f5f5f5; display: flex; flex-direction: column; }
.navbar { background: white; padding: 1rem 2rem; display: flex; justify-content: space-between; box-shadow: 0 2px 5px rgba(0,0,0,0.05); }
.brand { font-weight: 700; font-size: 1.2rem; color: #2d3446; }
.card { background: white; margin: 3rem auto; padding: 4rem 2rem; text-align: center; max-width: 600px; width: 90%; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.05); }
.spinner { width: 60px; height: 60px; border: 6px solid #e0e0e0; border-top: 6px solid #888; border-radius: 50%; margin: 0 auto 2rem; animation: spin 1s linear infinite; }
@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
h2 { margin-bottom: 1rem; color: #333; }
p { color: #666; margin-bottom: 0.5rem; }
.warning { color: #888; font-size: 0.9rem; margin-bottom: 2rem; }
h3 { margin-bottom: 2rem; color: #333; }
.redirect-box { border: 1px solid #ffcc80; color: #333; padding: 0.8rem 2rem; border-radius: 20px; display: inline-block; font-size: 0.9rem; }
</style>