<template>
  <div class="staff-wrapper">
    <h2 class="page-title">Incoming Orders (Pending)</h2>

    <div v-if="isLoading" class="loading">Loading incoming orders...</div>
    <div v-else-if="orders.length === 0" class="empty-state">No pending orders.</div>

    <div v-else class="orders-grid">
      <div v-for="order in orders" :key="order.order_id" class="order-card">
        
        <div class="card-header" :class="order.payment_method === 'Cash' ? 'bg-orange' : 'bg-blue'">
          <div class="header-left">
             <span class="header-title">Order #{{ order.order_id }}</span>
             <span class="station-badge" v-if="order.station_number">
                📍 {{ order.station_number }}
             </span>
          </div>
          <span class="header-method">{{ order.payment_method.toUpperCase() }}</span>
        </div>

        <div class="card-body">
          
          <div class="customer-info">
              <p><strong>Customer:</strong> {{ order.users?.username }}</p>
              <p class="time-text">{{ formatDate(order.created_at) }}</p>
          </div>

          <div class="items-list-container">
             <div v-for="(item, idx) in order.order_items" :key="idx" class="item-row">
                <span class="item-qty">{{ item.quantity }}x</span>
                <span class="item-name">{{ item.name }}</span>
             </div>
          </div>

          <div class="total-row">
              <span>TOTAL:</span>
              <span>₱ {{ order.total_amount }}</span>
          </div>

          <hr class="divider">

          <div class="payment-info">
             <div v-if="order.payment_method === 'Cash'" class="info-alert">
                ⚠️ Collect payment later at table.
             </div>

             <div v-else>
                <div class="ref-box">
                    <span class="ref-label">Reference No:</span>
                    <strong class="ref-value">{{ order.payment_reference }}</strong>
                </div>
                <div class="info-alert blue-alert">
                    ℹ️ Verify reference number before cooking.
                </div>
             </div>
          </div>

        </div>

        <div class="card-action">
          <button class="prepare-btn" @click="confirmOrder(order)">
            {{ order.payment_method === 'Cash' ? '✅ Confirm & Cook' : '🔍 Verify & Cook' }}
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
    const response = await axios.get('http://localhost:3000/api/staff/orders/Pending');
    orders.value = response.data;
  } catch (error) {
    console.error(error);
  } finally {
    isLoading.value = false;
  }
};

const confirmOrder = async (order) => {
  let message = "Confirm order?";
  
  if (order.payment_method !== 'Cash') {
      message = `Verify Reference Number: ${order.payment_reference}\n\nIs this correct?`;
  }

  if (!confirm(message)) return;

  try {
    // Both Cash and Cashless go to 'Preparing' status here.
    // For Cashless, we mark as 'Paid'. For Cash, we keep 'Unpaid'.
    const updates = { 
        status: 'Preparing',
        payment_status: order.payment_method === 'Cash' ? 'Unpaid' : 'Paid'
    };

    await axios.patch(`http://localhost:3000/api/staff/orders/${order.order_id}/status`, updates);
    
    // Remove from UI
    orders.value = orders.value.filter(o => o.order_id !== order.order_id);
  } catch (error) {
    alert("Failed to update order.");
  }
};

const formatDate = (d) => new Date(d).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

onMounted(() => {
  fetchOrders();
  pollingInterval = setInterval(fetchOrders, 5000);
});
onUnmounted(() => clearInterval(pollingInterval));
</script>

<style scoped>
.staff-wrapper { padding: 1.5rem; }
.loading, .empty-state { text-align: center; padding: 2rem; color: #666; }
.orders-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1.5rem; }
.order-card { background: white; border-radius: 8px; box-shadow: 0 4px 10px rgba(0,0,0,0.1); overflow: hidden; display: flex; flex-direction: column; }

/* Header */
.card-header { padding: 0.8rem 1rem; color: white; display: flex; justify-content: space-between; align-items: center; }
.bg-orange { background-color: #FF724C; } /* Cash */
.bg-blue { background-color: #3b82f6; }   /* Cashless */

.header-left { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.header-title { font-weight: 800; font-size: 1.1rem; }
.header-method { font-size: 0.8rem; font-weight: 600; opacity: 0.9; border: 1px solid white; padding: 2px 6px; border-radius: 4px; }

/* Station Badge */
.station-badge { background: rgba(255,255,255,0.25); padding: 2px 8px; border-radius: 12px; font-size: 0.85rem; font-weight: 700; white-space: nowrap; }

/* Body */
.card-body { padding: 1rem; flex-grow: 1; }
.customer-info { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; font-size: 0.95rem; }
.time-text { color: #888; font-size: 0.85rem; }

/* Items List */
.items-list-container { background-color: #f9fafb; padding: 8px; border-radius: 6px; border: 1px solid #eee; margin-bottom: 10px; }
.item-row { display: flex; font-size: 0.9rem; margin-bottom: 3px; color: #444; }
.item-qty { font-weight: bold; width: 30px; color: #2d3446; }

.total-row { display: flex; justify-content: space-between; font-weight: 800; font-size: 1.1rem; color: #2d3446; }
.divider { border: 0; border-top: 1px solid #eee; margin: 12px 0; }

/* Ref & Info */
.ref-box { background: #eef2ff; border: 1px solid #c7d2fe; padding: 8px; border-radius: 4px; margin-bottom: 8px; display: flex; flex-direction: column; }
.ref-label { font-size: 0.75rem; color: #4f46e5; font-weight: bold; text-transform: uppercase; }
.ref-value { font-family: monospace; font-size: 1.1rem; color: #312e81; letter-spacing: 1px; }

.info-alert { font-size: 0.85rem; color: #d97706; background: #fffbeb; padding: 6px; border-radius: 4px; border-left: 3px solid #f59e0b; }
.blue-alert { color: #1d4ed8; background: #eff6ff; border-left-color: #3b82f6; }

/* Action Footer */
.card-action { padding: 1rem; border-top: 1px solid #eee; background-color: #fafafa; }
.prepare-btn { width: 100%; padding: 12px; font-weight: 700; border-radius: 6px; color: white; background-color: #2d3446; border: none; cursor: pointer; transition: background 0.2s; font-size: 1rem; }
.prepare-btn:hover { background-color: #1f2937; }
</style>