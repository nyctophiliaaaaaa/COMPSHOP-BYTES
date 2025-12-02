<script setup>
import { onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

// Check if method is COD
const isCod = computed(() => route.query.method === 'cod')
// 🟢 Get total from query
const totalAmount = computed(() => parseFloat(route.query.total || 0).toFixed(2))

onMounted(() => {
  setTimeout(() => {
    // 🟢 FORWARD TOTAL TO DASHBOARD
    router.push({ 
        path: '/dashboard', 
        query: { 
            orderPlaced: 'true', 
            method: route.query.method,
            total: route.query.total
        } 
    })
  }, 4000)
})
</script>

<template>
  <div class="success-container">
    <div class="navbar">
        <div class="brand">🥡 CompShop Bytes</div>
        <div class="nav-right">Station A12 🛒 👤</div>
    </div>
    
    <div class="card">
      <div class="check-circle">✔</div>
      
      <h2 v-if="isCod">Order Placed Successfully!</h2>
      <h2 v-else>Payment Successful!</h2>

      <div v-if="isCod" class="cod-details">
        <p><strong>Payment Method:</strong><br>Cash on Delivery</p>
        <p><strong>Total:</strong><br>₱ {{ totalAmount }}</p>
      </div>
      
      <p v-else class="sub-title">Your order is now confirmed.</p>
      
      <h3>Order #A12-4391</h3>

      <p v-if="!isCod" class="description">We've received your payment and started preparing your order.</p>
      
      <div class="redirect-box">
        Redirecting to Dashboard...
      </div>
    </div>
  </div>
</template>

<style scoped>
.success-container { min-height: 100vh; background-color: #f5f5f5; display: flex; flex-direction: column; }
.navbar { background: white; padding: 1rem 2rem; display: flex; justify-content: space-between; box-shadow: 0 2px 5px rgba(0,0,0,0.05); }
.card { background: white; margin: 3rem auto; padding: 4rem 2rem; text-align: center; max-width: 600px; width: 90%; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.05); border: 1px solid #ddd; }
.check-circle { width: 80px; height: 80px; background-color: #ffcc66; color: white; border-radius: 50%; display: flex; justify-content: center; align-items: center; font-size: 3rem; margin: 0 auto 1.5rem; }
h2 { margin-bottom: 1.5rem; color: #000; font-weight: 700; font-size: 1.8rem; }
h3 { margin-bottom: 2rem; font-size: 1.4rem; color: #000; font-weight: 600; }
.cod-details p { margin-bottom: 1rem; color: #000; font-size: 1rem; }
.sub-title { color: #333; margin-bottom: 2rem; }
.description { color: #666; font-size: 0.95rem; margin-bottom: 3rem; }
.redirect-box { border: 1px solid #ffcc80; color: #333; padding: 0.8rem 2rem; border-radius: 20px; display: inline-block; font-size: 0.9rem; margin-top: 1rem; }
</style>