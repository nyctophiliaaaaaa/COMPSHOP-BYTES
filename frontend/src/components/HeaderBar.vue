<script setup>
import { ref, computed } from 'vue' 
import { useRouter } from 'vue-router'
import axios from 'axios' // Keep axios imported for network calls if needed elsewhere
import appLogo from '@/assets/logo.png'
import OrderStatusPopup from '@/components/OrderStatus.vue'
import ReviewModal from '@/components/ReviewModal.vue' 

const router = useRouter()
const showOrderStatus = ref(false)
const showReviewModal = ref(false)
const reviewOrderId = ref(null) // We set this to null

// Variables related to the ORDER STATUS POPUP (Kept for compatibility)
const triggerReview = ref(0) 

const toggleOrderStatus = () => { 
    triggerReview.value = 0;
    showOrderStatus.value = !showOrderStatus.value 
}

const toggleReviewModal = async () => {
    const userId = localStorage.getItem('userId');

    if (!userId) {
        alert("Please log in to submit a review.");
        return;
    }

    // Now that we confirmed the user is logged in, open the modal
    reviewOrderId.value = null; 
    showReviewModal.value = true;
}

const goToCart = () => { router.push('/cart') }

const handleLogout = () => {
  if(confirm('Are you sure you want to logout?')) {
    localStorage.removeItem('userRole')
    localStorage.removeItem('userId')
    localStorage.removeItem('username')
    router.push('/')
  }
}

const stationName = computed(() => { 
  const currentUser = localStorage.getItem('username')
  return currentUser ? `Hi, ${currentUser}` : 'Guest'
})

// Handle successful submission from the ReviewModal
const handleReviewDone = () => {
    showReviewModal.value = false;
    // We don't need to refresh OrderStatus now since reviews are general
}
</script>

<template>
  <div>
    <OrderStatusPopup 
        v-if="showOrderStatus" 
        :isOpen="showOrderStatus"
        @close="showOrderStatus = false"
        :triggerReview="triggerReview" 
        @reset-trigger="triggerReview = 0" 
    />

    <ReviewModal
        :isOpen="showReviewModal"
        :orderId="reviewOrderId"
        @close="showReviewModal = false"
        @reviewSubmitted="handleReviewDone"
    />

    <header class="top-bar">
      <div class="logo">
        <img :src="appLogo" alt="Logo" class="logo-img" />
        CompShop Bytes
      </div>
      <div class="user-actions">
        <span class="station-id">{{ stationName }}</span>

        <button class="review-btn" @click="toggleReviewModal" title="Leave a Review!">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 20h9"/><path d="M16.5 3.5l-2.5 2.5 6 6 2.5-2.5 2.5-2.5-6-6Z"/><path d="M3 17v4h4L17 11.5 13.5 8 3 17Z"/>
            </svg>
        </button>

        <button class="icon-btn" @click="goToCart" title="Cart">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
        </button>

        <button class="icon-btn" @click="toggleOrderStatus" title="Order Status">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line>
          </svg>
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
.top-bar { display: flex; justify-content: space-between; align-items: center; padding: 0.6rem 1.5rem; border-bottom: 1px solid #eee; background-color: #fff; }
.logo { display: flex; align-items: center; gap: 10px; font-size: 1.2rem; font-weight: bold; color: #2d3446; }
.logo-img { height: 35px; width: auto; }
.user-actions { display: flex; align-items: center; gap: 10px; }
.station-id { font-weight: bold; color: #666; margin-right: 8px; font-size: 0.9rem; }
.icon-btn { background: none; border: none; cursor: pointer; padding: 6px; border-radius: 6px; transition: background 0.15s ease; display: flex; align-items: center; justify-content: center; }
.icon-btn:hover { background-color: #f0f0f0; }

.review-btn {
    background: #ff724c; 
    color: white;
    border: none;
    cursor: pointer;
    padding: 6px 10px;
    border-radius: 6px;
    transition: opacity 0.15s ease;
    display: flex; 
    align-items: center; 
    justify-content: center;
    gap: 4px;
}
.review-btn svg {
    stroke: white; 
}
.review-btn:hover {
    opacity: 0.85;
}

.logout-btn { color: #d9534f; }
.logout-btn:hover { background-color: #ffe6e6; }
@media (max-width: 768px) { .station-id { display: none; } .logo { font-size: 1rem; } }
</style>