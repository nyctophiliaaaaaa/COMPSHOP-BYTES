<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import axios from 'axios';

// Prop to control if the main card is open
const props = defineProps({
  isOpen: {
    type: Boolean,
    default: true
  }
});

const emit = defineEmits(['close']);

// --- STATE ---
const orders = ref([]);
const isLoading = ref(true);
const isMinimized = ref(false); 
const isFirstLoad = ref(true); 
let polling = null;

// Toast Notification State
const showToast = ref(false);
const toastMessage = ref('');
// ADDED BACK: Variable to track the timer
let toastTimeout = null;

// --- ACTIONS ---

const triggerToast = (message) => {
    console.log("🔔 TOAST TRIGGERED:", message); 
    toastMessage.value = message;
    showToast.value = true;
    
    // ADDED BACK: Auto-hide the Toast after 5 seconds
    if (toastTimeout) clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
        showToast.value = false;
    }, 6000);
};

// FETCH ORDERS (Runs in background)
const fetchOrders = async () => {
  const userId = localStorage.getItem('userId');
  if (!userId) {
      console.warn("⚠️ No User ID found in localStorage");
      return;
  }

  try {
    const res = await axios.get(`http://localhost:3000/api/orders/user/${userId}/active`);
    const newOrders = res.data;

    if (!isFirstLoad.value) {
        orders.value.forEach(oldOrder => {
            const matchingNewOrder = newOrders.find(n => n.order_id === oldOrder.order_id);
            const oldStatus = oldOrder.status.toLowerCase();

            // SCENARIO A: Status Changed
            if (matchingNewOrder) {
                const newStatus = matchingNewOrder.status.toLowerCase();
                
                if (oldStatus !== newStatus) {
                    // 1. Confirmed (Pending -> Preparing)
                    if (oldStatus === 'pending' && newStatus === 'preparing') {
                         triggerToast(`Order #${matchingNewOrder.order_id} Confirmed! We are preparing it now. 🍳`);
                    }

                    // 2. Ready
                    if (newStatus === 'ready') {
                        triggerToast(`Order #${matchingNewOrder.order_id} is Ready!`);
                    }

                    // 3. Served
                    if (newStatus === 'served' || newStatus === 'completed') {
                        triggerToast(`Order #${matchingNewOrder.order_id} Served. Enjoy your meal! 😋`);
                    }
                }
            } 
            // SCENARIO B: Order Disappeared
            else {
                if (oldStatus === 'ready' || oldStatus === 'preparing') {
                    triggerToast(`Order #${oldOrder.order_id} Served. Enjoy your meal! 😋`);
                }
            }
        });
    }

    orders.value = newOrders;
    isFirstLoad.value = false;
    
  } catch (e) {
    console.error("Fetch Error:", e);
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  fetchOrders();
  polling = setInterval(fetchOrders, 2000); 
});

onUnmounted(() => {
    clearInterval(polling);
    // Clear toast timer to prevent memory leaks
    if (toastTimeout) clearTimeout(toastTimeout);
});

// UI Actions
const toggleMinimize = () => isMinimized.value = !isMinimized.value;
const closePopup = () => emit('close');
const closeToast = () => showToast.value = false;

const formatDate = (dateString) => {
    return new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const getStatusColor = (status) => {
    if (!status) return 'text-gray';
    const s = status.toLowerCase();
    if (s === 'pending') return 'text-red';
    if (s === 'preparing') return 'text-orange';
    if (['ready', 'served', 'completed'].includes(s)) return 'text-green';
    return 'text-gray';
};
</script>

<template>
  <div class="component-wrapper">
    
    <transition name="slide-down">
        <div v-if="showToast" class="top-toast" @click="closeToast">
            <span class="toast-icon">✅</span>
            <span class="toast-msg">{{ toastMessage }}</span>
            <button class="toast-close">×</button>
        </div>
    </transition>

    <div v-show="isOpen && orders.length > 0" class="popup-container">
        
        <div class="backdrop" v-if="!isMinimized" @click="closePopup"></div>

        <div class="card" :class="{ 'minimized': isMinimized }">
        
        <div v-if="isMinimized" class="minimized-header" @click="toggleMinimize">
            <span class="min-title">Order Status</span>
            <div class="min-controls">
                <span class="badge" v-if="orders.length > 0">{{ orders.length }}</span>
                <button class="icon-btn">⤢</button>
            </div>
        </div>

        <template v-else>
            <div class="header-row">
                <button @click="toggleMinimize" class="control-btn" title="Minimize">–</button>
                <div class="status-header">My Orders</div>
                <button @click="closePopup" class="control-btn close-btn" title="Close">×</button>
            </div>
        </template>
        
        <div v-if="!isMinimized" class="full-content">
            
            <div v-if="isLoading" class="loading">Loading status...</div>

            <div class="orders-list">
                <div v-for="order in orders" :key="order.order_id" class="order-item">
                    <div class="order-top">
                        <span class="order-id">#{{ order.order_id }}</span>
                        <span class="order-time">{{ formatDate(order.created_at) }}</span>
                    </div>
                    
                    <div class="status-row">
                        <span>Status:</span>
                        <span class="status-value" :class="getStatusColor(order.status)">
                            {{ order.status.toUpperCase() }}
                        </span>
                    </div>

                    <div class="progress-bar-container">
                        <div class="progress-bar" 
                            :class="getStatusColor(order.status)"
                            :style="{ width: order.status.toLowerCase() === 'pending' ? '10%' : order.status.toLowerCase() === 'preparing' ? '60%' : '100%' }">
                        </div>
                    </div>
                    
                    <div class="order-note">
                        <span v-if="order.status.toLowerCase() === 'pending'">Waiting for confirmation...</span>
                        <span v-if="order.status.toLowerCase() === 'preparing'">Kitchen is cooking!</span>
                        <span v-if="order.status.toLowerCase() === 'ready'">Ready! The Cashier will serve you shortly!</span>
                        <span v-if="['served', 'completed'].includes(order.status.toLowerCase())" class="text-green fw-bold">
                            Served! Enjoy your order! 😋
                        </span>
                    </div>
                </div>
            </div>
        </div>

        <div v-else class="minimized-summary" @click="toggleMinimize">
            <div class="status-badge">
                <span class="dot"></span> {{ orders.length }} Active Order(s)
            </div>
        </div>

        </div>
    </div>
  </div>
</template>

<style scoped>
/* --- TOAST STYLES --- */
.top-toast {
    position: fixed;
    top: 80px; 
    left: 50%;
    transform: translateX(-50%);
    background-color: #10b981;
    color: white;
    padding: 12px 24px;
    border-radius: 50px;
    box-shadow: 0 4px 15px rgba(16, 185, 129, 0.4);
    z-index: 10000; 
    display: flex;
    align-items: center;
    gap: 12px;
    font-weight: 600;
    cursor: pointer;
    min-width: 300px;
    justify-content: center;
}
.toast-icon { font-size: 1.2rem; }
.toast-msg { font-size: 0.95rem; }
.toast-close { background: none; border: none; color: white; font-size: 1.2rem; cursor: pointer; opacity: 0.8; margin-left: auto;}

.slide-down-enter-active, .slide-down-leave-active { transition: all 0.4s ease; }
.slide-down-enter-from, .slide-down-leave-to { opacity: 0; transform: translate(-50%, -20px); }

/* --- CARD STYLES --- */
.component-wrapper { position: relative; z-index: 9999; }
.backdrop { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0,0,0,0.5); z-index: 9998; }

.card {
    background: white; padding: 1.5rem; text-align: center;
    width: 90%; max-width: 400px; border-radius: 16px; border: 1px solid #eee;
    position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
    z-index: 9999; box-shadow: 0 10px 40px rgba(0,0,0,0.2);
    transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    max-height: 80vh; display: flex; flex-direction: column;
}

.card.minimized {
    top: auto; left: auto; bottom: 20px; right: 20px;
    transform: none; width: 280px; padding: 1rem;
    box-shadow: 0 8px 30px rgba(0,0,0,0.15); border-color: #ffb84d;
    cursor: pointer;
}

/* Header & Content Styles */
.header-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
.status-header { font-weight: 800; font-size: 1.2rem; color: #2d3446; }
.control-btn { background: #f0f0f0; border: none; width: 30px; height: 30px; border-radius: 50%; cursor: pointer; font-weight: bold; color: #555; }
.close-btn:hover { background: #fee2e2; color: #d9534f; }

.minimized-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem; border-bottom: 1px solid #eee; padding-bottom: 0.5rem; }
.min-title { font-weight: 700; color: #ff6633; font-size: 0.9rem; }
.min-controls { display: flex; align-items: center; gap: 8px; }
.badge { background: #ff6633; color: white; font-size: 0.7rem; padding: 2px 6px; border-radius: 10px; font-weight: bold; }
.icon-btn { background: none; border: none; font-size: 1.2rem; cursor: pointer; color: #555; padding: 0; }

.full-content { overflow-y: auto; padding-right: 5px; }
.orders-list { display: flex; flex-direction: column; gap: 10px; }
.order-item { border: 1px solid #eee; padding: 12px; border-radius: 8px; text-align: left; background: #fafafa; }
.order-top { display: flex; justify-content: space-between; margin-bottom: 5px; font-weight: bold; color: #333; font-size: 0.95rem; }
.order-time { font-weight: normal; color: #888; font-size: 0.8rem; }
.status-row { font-size: 0.85rem; margin-bottom: 8px; }
.status-value { font-weight: 800; margin-left: 5px; }

.text-red { color: #dc3545; }
.text-orange { color: #f59e0b; }
.text-green { color: #10b981; }
.text-gray { color: #888; }
.fw-bold { font-weight: bold; }

.progress-bar-container { width: 100%; height: 6px; background: #eee; border-radius: 3px; overflow: hidden; margin-bottom: 8px; }
.progress-bar { height: 100%; transition: width 0.5s ease; }
.progress-bar.text-red { background: #dc3545; }
.progress-bar.text-orange { background: #f59e0b; }
.progress-bar.text-green { background: #10b981; }

.order-note { font-size: 0.8rem; color: #666; font-style: italic; }
.minimized-summary { text-align: left; }
.status-badge { display: inline-flex; align-items: center; font-size: 0.9rem; font-weight: 600; color: #333; }
.dot { width: 8px; height: 8px; background-color: #10b981; border-radius: 50%; display: inline-block; margin-right: 8px; animation: pulse 1.5s infinite; }
@keyframes pulse { 0% { opacity: 1; } 50% { opacity: 0.4; } 100% { opacity: 1; } }
</style>