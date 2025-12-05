<script setup>
import { onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import HeaderBar from '@/components/HeaderBar.vue'

const router = useRouter()
const route = useRoute()

// Check if method is COD
const isCod = computed(() => route.query.method === 'cod')
// 🟢 Get total from query
const totalAmount = computed(() => parseFloat(route.query.total || 0).toFixed(2))

onMounted(() => {
  // Clear the cart on success
  const userId = localStorage.getItem('userId')
  const cartKey = userId ? `cart_${userId}` : 'myCart'
  localStorage.removeItem(cartKey)

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
      <HeaderBar />

      <div class="card">
        <div class="check-circle">✔</div>

      <h2 v-if="isCod">Order Placed Successfully!</h2>
      <h2 v-else>Payment Successful!</h2>

      <div v-if="isCod" class="cod-details">
        <p><strong>Payment Method:</strong><br/>Cash on Delivery</p>
        <p><strong>Total:</strong><br/>₱ {{ totalAmount }}</p>
      </div>

      <p v-else class="sub-title">Your order is now confirmed.</p>

      <h3>Order #A12-4391</h3>

      <p v-if="!isCod" class="description">We've received your payment and started preparing your order.</p>

      <div class="redirect-box">Redirecting to Dashboard...</div>
    </div>
  </div>
</template>

<style scoped>
/* Responsive Payment Success Page */
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
  background-color: #ffcc66; 
  color: white; 
  border-radius: 50%; 
  display: flex; 
  justify-content: center; 
  align-items: center; 
  font-size: clamp(2rem, 3.5vw, 3.5rem); 
  margin: 0 auto clamp(1rem, 2vw, 1.8rem); 
}

h2 { 
  margin-bottom: clamp(1rem, 2vw, 1.8rem); 
  color: #000; 
  font-weight: 700; 
  font-size: clamp(1.3rem, 2vw, 1.9rem); 
}

h3 { 
  margin-bottom: clamp(1.2rem, 2.5vw, 2.2rem); 
  font-size: clamp(1.1rem, 1.6vw, 1.5rem); 
  color: #000; 
  font-weight: 600; 
}

.cod-details p { 
  margin-bottom: clamp(0.6rem, 1.2vw, 1.1rem); 
  color: #000; 
  font-size: clamp(0.85rem, 1.1vw, 1.05rem); 
}

.sub-title { 
  color: #333; 
  margin-bottom: clamp(1.2rem, 2.5vw, 2.2rem);
  font-size: clamp(0.9rem, 1.1vw, 1.05rem);
}

.description { 
  color: #666; 
  font-size: clamp(0.8rem, 1vw, 1rem); 
  margin-bottom: clamp(1.8rem, 4vw, 3.5rem); 
}

.redirect-box { 
  border: 1px solid #ffcc80; 
  color: #333; 
  padding: clamp(0.5rem, 1vw, 0.9rem) clamp(1.2rem, 2.5vw, 2.5rem); 
  border-radius: 20px; 
  display: inline-block; 
  font-size: clamp(0.75rem, 1vw, 0.95rem); 
  margin-top: clamp(0.6rem, 1.2vw, 1.1rem); 
}
</style>