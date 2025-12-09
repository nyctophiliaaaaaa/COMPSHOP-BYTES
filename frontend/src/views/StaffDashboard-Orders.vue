<template>
  <div class="staff-wrapper">
    <h2 class="page-title">Pending Orders</h2>

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

          <div class="station-info" v-if="order.station_number">
              <span class="station-icon">📍</span>
              <span><strong>Station:</strong> {{ order.station_number }}</span>
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
          <button class="prepare-btn" @click="openConfirmModal(order)">
            {{ order.payment_method === 'Cash' ? '✅ Confirm & Cook' : '🔍 Verify & Cook' }}
          </button>
        </div>

      </div>
    </div>

    <div v-if="showModal" class="modal-overlay">
      <div class="modal-content">
        
        <h3>Confirm Order #{{ selectedOrder?.order_id }}?</h3>

        <div class="modal-body">
          <p>Are you sure you want to send this order to the kitchen?</p>
          
          <div v-if="selectedOrder?.payment_method !== 'Cash'" class="ref-verify-box">
            <p class="label">Please verify Reference Number:</p>
            <h2 class="ref-highlight">{{ selectedOrder?.payment_reference }}</h2>
          </div>

          <div v-else class="cash-verify-box">
            <p>⚠️ Payment status will remain <strong>Unpaid</strong> until settled at the table.</p>
          </div>
        </div>
        
        <div class="modal-actions">
          <button class="btn-cancel" @click="closeModal">Cancel</button>
          <button class="btn-confirm-action" @click="processOrder">
            Confirm
          </button>
        </div>

      </div>
    </div>
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import axios from 'axios';

const emit = defineEmits(['notify']);

const orders = ref([]);
const isLoading = ref(true);
let pollingInterval = null;

const showModal = ref(false);
const selectedOrder = ref(null);

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

const openConfirmModal = (order) => {
  selectedOrder.value = order;
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
  selectedOrder.value = null;
};

const processOrder = async () => {
  if (!selectedOrder.value) return;
  const order = selectedOrder.value;

  try {
    let refCode = order.payment_reference;

    if (order.payment_method === 'Cash') {
       refCode = `${Math.floor(1000 + Math.random() * 9000)}`;
    }

    const updates = { 
        status: 'Preparing',
        payment_status: order.payment_method === 'Cash' ? 'Unpaid' : 'Paid',
        payment_reference: refCode 
    };

    await axios.patch(`http://localhost:3000/api/staff/orders/${order.order_id}/status`, updates);
    
    orders.value = orders.value.filter(o => o.order_id !== order.order_id);

    emit('notify', { 
      message: `Order #${order.order_id} confirmed! (Ref: ${refCode})`, 
      type: 'success' 
    });

    closeModal();

  } catch (error) {
    console.error(error); 
    emit('notify', { 
      message: "Failed to update order status.", 
      type: 'error' 
    });
    closeModal();
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

.card-header { padding: 0.8rem 1rem; color: white; display: flex; justify-content: space-between; align-items: center; }
.bg-orange { background-color: #FF724C; }
.bg-blue { background-color: #3b82f6; }   

.header-left { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.header-title { font-weight: 800; font-size: 1.1rem; }
.header-method { font-size: 0.8rem; font-weight: 600; opacity: 0.9; border: 1px solid white; padding: 2px 6px; border-radius: 4px; }
.station-badge { background: rgba(255,255,255,0.25); padding: 2px 8px; border-radius: 12px; font-size: 0.85rem; font-weight: 700; white-space: nowrap; }

.card-body { padding: 1rem; flex-grow: 1; }
.customer-info { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; font-size: 0.95rem; }
.time-text { color: #888; font-size: 0.85rem; }

.station-info { display: flex; align-items: center; gap: 6px; background: #fff7ed; border: 1px solid #fed7aa; padding: 8px 12px; border-radius: 6px; margin-bottom: 10px; font-size: 0.95rem; color: #c2410c; }
.station-icon { font-size: 1.1rem; }

.items-list-container { background-color: #f9fafb; padding: 8px; border-radius: 6px; border: 1px solid #eee; margin-bottom: 10px; }
.item-row { display: flex; font-size: 0.9rem; margin-bottom: 3px; color: #444; }
.item-qty { font-weight: bold; width: 30px; color: #2d3446; }

.total-row { display: flex; justify-content: space-between; font-weight: 800; font-size: 1.1rem; color: #2d3446; }
.divider { border: 0; border-top: 1px solid #eee; margin: 12px 0; }

.ref-box { background: #eef2ff; border: 1px solid #c7d2fe; padding: 8px; border-radius: 4px; margin-bottom: 8px; display: flex; flex-direction: column; }
.ref-label { font-size: 0.75rem; color: #4f46e5; font-weight: bold; text-transform: uppercase; }
.ref-value { font-family: monospace; font-size: 1.1rem; color: #312e81; letter-spacing: 1px; }

.info-alert { font-size: 0.85rem; color: #d97706; background: #fffbeb; padding: 6px; border-radius: 4px; border-left: 3px solid #f59e0b; }
.blue-alert { color: #1d4ed8; background: #eff6ff; border-left-color: #3b82f6; }

.card-action { padding: 1rem; border-top: 1px solid #eee; background-color: #fafafa; }
.prepare-btn { width: 100%; padding: 12px; font-weight: 700; border-radius: 6px; color: white; background-color: #2d3446; border: none; cursor: pointer; transition: background 0.2s; font-size: 1rem; }
.prepare-btn:hover { background-color: #1f2937; }

.modal-overlay {
  position: fixed; top: 0; left: 0; width: 100%; height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex; justify-content: center; align-items: center;
  z-index: 10000;
}

.modal-content {
  background: white; padding: 2rem; border-radius: 12px;
  width: 90%; max-width: 420px; text-align: center;
  box-shadow: 0 4px 20px rgba(0,0,0,0.2);
  animation: popIn 0.2s ease-out;
}

.modal-content h3 { margin-top: 0; color: #1f2937; font-size: 1.4rem; }
.modal-body { margin: 1.5rem 0; color: #4b5563; }

.ref-verify-box { background: #eef2ff; padding: 1rem; border-radius: 8px; margin-top: 10px; border: 1px dashed #6366f1; }
.ref-verify-box .label { font-size: 0.9rem; margin-bottom: 5px; color: #4338ca; }
.ref-highlight { font-family: monospace; font-size: 1.8rem; color: #312e81; margin: 0; letter-spacing: 2px; }

.cash-verify-box { background: #fffbeb; padding: 1rem; border-radius: 8px; margin-top: 10px; border: 1px dashed #f59e0b; color: #92400e; font-size: 0.9rem; }

.modal-actions { display: flex; gap: 1rem; justify-content: center; margin-top: 2rem; }

.btn-cancel { padding: 0.75rem 1.5rem; background: #e5e7eb; border: none; border-radius: 6px; cursor: pointer; font-weight: 600; color: #374151; transition: background 0.2s; }
.btn-cancel:hover { background: #d1d5db; }

.btn-confirm-action { padding: 0.75rem 1.5rem; background: #2d3446; border: none; border-radius: 6px; cursor: pointer; font-weight: 600; color: white; transition: background 0.2s; }
.btn-confirm-action:hover { background: #1f2937; transform: scale(1.02); }

@keyframes popIn {
  from { transform: scale(0.9); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}
</style>