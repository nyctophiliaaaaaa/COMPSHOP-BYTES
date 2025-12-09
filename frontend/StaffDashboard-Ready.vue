<template>
  <div class="staff-wrapper">
    <h2 class="page-title">Ready for Serving</h2>

    <div v-if="isLoading" class="loading-state">
      <div class="spinner"></div>
      <p>Loading ready orders...</p>
    </div>

    <div v-else-if="orders.length === 0" class="empty-state">
      <div class="empty-icon">🍽️</div>
      <p>No orders ready to serve.</p>
    </div>

    <div v-else class="orders-grid">
      <div v-for="order in orders" :key="order.order_id" class="order-card ready-card">
        
        <div class="card-header">
          <div class="header-id-station">
            <span class="order-id">#{{ order.order_id }}</span>
            <span class="order-station">{{ order.users?.username || 'Guest' }}</span>
          </div>
          <div class="header-time-name">
            <span class="order-time">{{ formatDate(order.created_at) }}</span>
            <span class="order-total">₱{{ order.total_amount }}</span>
          </div>
        </div>

        <div class="card-items">
          
          <div class="item-row">
            <span class="item-qty">1x</span>
            <span>Order Bundle ({{ order.payment_method }})</span>
          </div>
          
          <hr class="divider">
          
          <div class="status-row">
            <span class="status-label">Status:</span>
            <span class="status-value ready-text">READY TO SERVE</span>
          </div>
          <div class="status-row">
            <span class="status-label">Payment:</span>
            <span class="status-value" :class="{ 'unpaid-text': order.payment_status === 'Unpaid' }">
                {{ order.payment_status || 'PAID' }}
            </span>
          </div>
        </div>

        <div class="card-action">
          <button class="serve-btn" @click="markServed(order.order_id)">
            ✅ Mark Served
          </button>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import axios from 'axios';

const orders = ref([]);
const isLoading = ref(true);
let pollingInterval = null;

const fetchOrders = async () => {
  try {
    const response = await axios.get('http://localhost:3000/api/staff/orders/Ready');
    orders.value = response.data;
  } catch (error) {
    console.error("Error fetching ready orders:", error);
  } finally {
    isLoading.value = false;
  }
};

const markServed = async (orderId) => {
  if(!confirm("Has the customer received the food? This will complete the order.")) return;

  try {
    await axios.patch(`http://localhost:3000/api/staff/orders/${orderId}/status`, {
      status: 'Completed'
    });

    orders.value = orders.value.filter(o => o.order_id !== orderId);
    
  } catch (error) {
    alert("Error updating order status.");
  }
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

onMounted(() => {
  fetchOrders();
  pollingInterval = setInterval(fetchOrders, 5000); 
});

onUnmounted(() => {
  clearInterval(pollingInterval);
});
</script>

<style scoped>
.staff-wrapper {
    padding: 1.5rem;
}

.page-title {
    font-size: 1.8rem;
    color: #2d3446;
    margin-bottom: 1.5rem;
    font-weight: 700;
}


.empty-state {
    text-align: center;
    padding: 4rem 2rem;
    color: #888;
    background: #f9fafb;
    border-radius: 12px;
    border: 2px dashed #e5e7eb;
}
.empty-icon { 
  font-size: 3rem; 
  margin-bottom: 1rem; 
}


.orders-grid { 
    display: grid; 
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); 
    gap: 1.5rem; 
}


.order-card { 
    background-color: white; 
    border-radius: 0.5rem; 
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); 
    overflow: hidden; 
    border-left: 5px solid #10b981; 
}

.card-header { 
    display: flex; 
    justify-content: space-between; 
    align-items: center; 
    padding: 0.75rem; 
    color: #333; 
    font-weight: 600; 
    background-color: #f3f4f6;
    border-bottom: 1px solid #e5e7eb;
}

.header-id-station { 
  display: flex; 
  align-items: center; 
  gap: 0.5rem; 
}

.order-id { 
  font-size: 1.1rem; 
  font-weight: 800; 
  color: #2d3446; 
}

.order-station { 
  font-size: 0.9rem; 
  font-weight: 500; 
  color: #555; 
}

.header-time-name { 
  text-align: right;
 }

.order-time { 
  font-size: 0.8rem; 
  color: #666; 
  display: block; 
}

.order-total { 
  font-size: 0.9rem; 
  color: #10b981; 
  font-weight: 700; 
}

.card-items { 
    padding: 1rem; 
    font-size: 0.9rem; 
    display: flex; 
    flex-direction: column; 
    gap: 0.5rem; 
}

.item-row { 
  display: flex; 
  gap: 0.5rem; 
  color: #444; 
}

.item-qty { 
  font-weight: 700; 
}

.divider { 
  border: none; 
  border-top: 1px solid #f0f0f0; 
  margin: 0.5rem 0; 
}

.status-row { 
  display: flex; 
  justify-content: space-between; 
  font-size: 0.85rem; 
}

.status-label { 
  font-weight: 600; 
  color: #6b7280; 
}

.status-value { 
  font-weight: 700; 
}

.ready-text { 
  color: #10b981;
 }
.unpaid-text { 
  color: #ef4444; 
} 

.card-action { 
  padding: 0.75rem; 
  border-top: 1px solid #f0f0f0; 
  background-color: #fafafa; 
}

.serve-btn {
    width: 100%; 
    padding: 0.75rem 0; 
    font-size: 0.9rem; 
    font-weight: 700; 
    border-radius: 0.375rem;
    color: white; 
    background-color: #2d3446; 
    border: none; 
    cursor: pointer; 
    transition: background-color 0.15s ease-in-out;
}

.serve-btn:hover { 
  background-color: #1f2937; 
}

@media (max-width: 1024px) { 
  .orders-grid { 
    grid-template-columns: repeat(3, 1fr); 
  } 
}
@media (max-width: 768px) { 
  .orders-grid { 
    grid-template-columns: repeat(2, 1fr); 
  } 
}

@media (max-width: 480px) { 
  .orders-grid { 
    grid-template-columns: 1fr;
  }
}
</style>