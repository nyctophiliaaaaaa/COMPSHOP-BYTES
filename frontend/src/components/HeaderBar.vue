<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import appLogo from '@/assets/logo.png'
import OrderStatusPopup from '@/components/OrderStatus.vue'

const router = useRouter()
const showOrderStatus = ref(false)
const toggleOrderStatus = () => { showOrderStatus.value = !showOrderStatus.value }
const goToCart = () => { router.push('/cart') }
const handleLogout = () => {
  if (confirm('Are you sure you want to logout?')) {
    localStorage.removeItem('userRole')
    localStorage.removeItem('userId')
    localStorage.removeItem('username')
    router.push('/')
  }
}

// Display station/user name
const stationName = (() => {
  const currentUser = localStorage.getItem('username')
  return currentUser ? `Hi, ${currentUser}` : 'Guest'
})()
</script>

<template>
  <div>
    <OrderStatusPopup v-if="showOrderStatus" />

    <header class="top-bar">
      <div class="logo">
        <img :src="appLogo" alt="Logo" class="logo-img" />
        CompShop Bytes
      </div>
      <div class="user-actions">
        <span class="station-id">{{ stationName }}</span>

        <button class="icon-btn" @click="goToCart" title="Cart">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
        </button>

        <button class="icon-btn" @click="toggleOrderStatus" title="Order Status">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
        </button>

        <button class="icon-btn logout-btn" @click="handleLogout" title="Logout">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
            <polyline points="16 17 21 12 16 7"></polyline>
            <line x1="21" y1="12" x2="9" y2="12"></line>
          </svg>
        </button>
      </div>
    </header>
  </div>
</template>

<style scoped>
.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 2rem; /* increased size */
  border-bottom: 1px solid #eee;
  flex-shrink: 0;
}

.logo {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 1.4rem; /* slightly larger */
  font-weight: 700;
  color: #2c3e50;
}

.logo-img { height: 40px; width: auto; } /* larger logo */

.user-actions { display: flex; align-items: center; gap: 12px; }
.station-id { font-weight: 700; color: #555; margin-right: 6px; font-size: 1rem }
.icon-btn { background:none; border:none; cursor:pointer; padding:6px; border-radius:6px; transition:background 0.15s }
.icon-btn:hover { background-color:#f0f0f0 }
.logout-btn { color:#d9534f }
.logout-btn:hover { background-color:#ffe6e6 }
</style>
