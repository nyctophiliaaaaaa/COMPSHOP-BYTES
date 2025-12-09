<script setup>
import { onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import HeaderBar from '@/components/HeaderBar.vue'

const router = useRouter()
const route = useRoute()

const isCod = computed(() => route.query.method === 'cod')
const isCashless = computed(() => route.query.method === 'qrph' || route.query.method === 'cashless')

const totalAmount = computed(() => parseFloat(route.query.total || 0).toFixed(2))

onMounted(() => {
  const userId = localStorage.getItem('userId')
  const cartKey = userId ? `cart_${userId}` : 'myCart'
  localStorage.removeItem(cartKey)
  localStorage.removeItem('cartTotal')

  setTimeout(() => {
    router.push('/dashboard')
  }, 5000)
})

const goToDashboard = () => {
  router.push('/dashboard')
}
</script>

<template>
  <div class="success-container">
      <HeaderBar />

      <div class="card">
        <div class="check-circle" :class="{ 'pending-icon': isCashless }">
           <span v-if="isCod">✔</span>
           <span v-else>⏳</span>
        </div>

      <h2 v-if="isCod">Order Placed Successfully!</h2>
      <h2 v-else>Reference Submitted</h2>

      <div v-if="isCod" class="cod-details">
        <p><strong>Payment Method:</strong><br/>Cash on Delivery</p>
        <p><strong>Total:</strong><br/>₱ {{ totalAmount }}</p>
      </div>

      <div v-else class="cashless-details">
        <p class="sub-title">Waiting for Staff Verification</p>
        <p class="description">
          We have received your Reference Number. <br>
          Please wait for our staff to verify the payment before your order begins preparing.
        </p>
      </div>

      <button class="redirect-btn" @click="goToDashboard">
        Back to Menu
      </button>
    </div>
  </div>
</template>

<style scoped>
.success-container { 
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
  border: 1px solid #ddd; 
}

.check-circle { 
  width: clamp(55px, 7vw, 90px); 
  height: clamp(55px, 7vw, 90px); 
  background-color: #28a745; 
  color: white; 
  border-radius: 50%; 
  display: flex; 
  justify-content: center; 
  align-items: center; 
  font-size: clamp(2rem, 3.5vw, 3.5rem); 
  margin: 0 auto clamp(1rem, 2vw, 1.8rem); 
}

.pending-icon {
  background-color: #f59e0b;
}

h2 { 
  margin-bottom: clamp(1rem, 2vw, 1.8rem); 
  color: #000; 
  font-weight: 700; 
  font-size: clamp(1.3rem, 2vw, 1.9rem); 
}

.cod-details p { 
  margin-bottom: clamp(0.6rem, 1.2vw, 1.1rem); 
  color: #000; 
  font-size: clamp(0.85rem, 1.1vw, 1.05rem); 
}

.sub-title { 
  color: #333; 
  font-weight: 600;
  margin-bottom: clamp(0.5rem, 1vw, 1rem);
  font-size: clamp(1rem, 1.2vw, 1.2rem);
}

.description { 
  color: #666; 
  font-size: clamp(0.8rem, 1vw, 1rem); 
  line-height: 1.5;
  margin-bottom: clamp(1.8rem, 4vw, 3.5rem); 
}

.redirect-btn { 
  background-color: #2d3446;
  color: white; 
  border: none;
  padding: clamp(0.8rem, 1.5vw, 1rem) clamp(1.5rem, 3vw, 2rem); 
  border-radius: 20px; 
  font-weight: bold;
  cursor: pointer;
  font-size: clamp(0.8rem, 1vw, 1rem); 
  margin-top: clamp(0.6rem, 1.2vw, 1.1rem); 
}

.redirect-btn:hover {
  background-color: #3b4559;
}
</style>