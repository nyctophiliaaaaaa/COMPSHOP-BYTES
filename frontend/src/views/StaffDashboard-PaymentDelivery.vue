<template>
  <div class="staff-wrapper">
    <h2 class="page-title">Ready for Serving & Payment</h2>

    <div v-if="orders.length === 0" class="empty-state">
      <p>No orders waiting for service.</p>
    </div>

    <div v-else class="orders-grid">
      <div v-for="order in orders" :key="order.order_id" class="order-card">
        
        <div class="card-header" :class="order.payment_method === 'Cash' ? 'bg-orange' : 'bg-green'">
          <div class="header-left">
             <span class="header-title">
                Order #{{ order.order_id }} - {{ order.payment_method.toUpperCase() }}
             </span>
             <span class="station-badge" v-if="order.station_number">
                📍 {{ order.station_number }}
             </span>
          </div>
        </div>

        <div class="card-body">
          <div class="customer-info">
              <p><strong>Customer:</strong> {{ order.users?.username }}</p>
              <p><strong>Time:</strong> {{ formatDate(order.created_at) }}</p>
          </div>

          <div class="items-list-container">
             <div v-for="(item, idx) in order.order_items" :key="idx" class="item-row">
                <span class="item-qty">{{ item.quantity }}x</span>
                <span class="item-name">{{ item.name }}</span>
             </div>
          </div>

          <div class="total-row">
              <span>TOTAL DUE:</span>
              <span>₱ {{ order.total_amount }}</span>
          </div>

          <hr class="divider">

          <div v-if="order.payment_method === 'Cash'" class="cash-section">
              <p class="instruction">Ask customer for payment:</p>
              
              <div class="input-row">
                  <label>Received:</label>
                  <input 
                    type="number" 
                    v-model.number="order.cashReceived" 
                    class="cash-input" 
                    placeholder="0.00"
                  />
              </div>

              <div class="change-display" :class="{ 'valid': calculateChange(order) >= 0 }">
                  Change: ₱ {{ calculateChange(order) }}
              </div>

              <button 
                  class="action-btn btn-cash" 
                  @click="openModal(order)"
                  :disabled="(order.cashReceived || 0) < order.total_amount"
              >
                  💵 Pay & Serve
              </button>
          </div>

          <div v-else class="cashless-section">
              <div class="paid-badge">ALREADY PAID</div>
              <p>Ref: {{ order.payment_reference }}</p>
              
              <button 
                  class="action-btn btn-serve" 
                  @click="openModal(order)"
              >
                  ✅ Serve Order
              </button>
          </div>

        </div>
      </div>
    </div>

    <div v-if="showModal" class="modal-overlay">
      <div class="modal-content">
        
        <h3>{{ selectedOrder?.payment_method === 'Cash' ? 'Confirm Payment' : 'Confirm Serving' }}</h3>

        <div class="modal-body">
          
          <div v-if="selectedOrder?.payment_method === 'Cash'">
            <p>Confirm payment for Order #{{ selectedOrder.order_id }}?</p>
            
            <div class="summary-box">
              <div class="row">
                <span>Total Due:</span>
                <strong>₱ {{ selectedOrder.total_amount }}</strong>
              </div>
              <div class="row received">
                <span>Cash Received:</span>
                <strong>₱ {{ selectedOrder.cashReceived }}</strong>
              </div>
              <div class="row change">
                <span>Change:</span>
                <strong>₱ {{ calculateChange(selectedOrder) }}</strong>
              </div>
            </div>
          </div>

          <div v-else>
             <p>Mark <strong>Order #{{ selectedOrder?.order_id }}</strong> as served?</p>
             <p class="sub-text">Customer has already paid via {{ selectedOrder?.payment_method }}.</p>
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
    const res = await axios.get('http://localhost:3000/api/staff/orders/Ready');
    
    const mergedOrders = res.data.map(newOrder => {
      const existingOrder = orders.value.find(o => o.order_id === newOrder.order_id);
      return { 
        ...newOrder, 
        cashReceived: existingOrder ? existingOrder.cashReceived : null 
      };
    });

    orders.value = mergedOrders;

  } catch (e) { 
    console.error(e); 
  } finally {
    isLoading.value = false;
  }
};

const calculateChange = (order) => {
    if (!order.cashReceived) return '0.00';
    const change = order.cashReceived - order.total_amount;
    return change > 0 ? change.toFixed(2) : '0.00';
};


const openModal = (order) => {
  if (order.payment_method === 'Cash') {
    const received = order.cashReceived || 0;
    if (received < order.total_amount) {
      emit('notify', { message: 'Insufficient payment amount!', type: 'error' });
      return;
    }
  }
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
        const updates = { status: 'Completed' };
        
        if (order.payment_method === 'Cash') {
            updates.payment_status = 'Paid';
        }

        await axios.patch(`http://localhost:3000/api/staff/orders/${order.order_id}/status`, updates);

        orders.value = orders.value.filter(o => o.order_id !== order.order_id);

        emit('notify', { 
          message: `Order #${order.order_id} served!`, 
          type: 'success' 
        });

        closeModal();

    } catch (e) { 
        emit('notify', { 
          message: "Error updating order.", 
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
.orders-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1.5rem; }
.order-card { background: white; border-radius: 8px; box-shadow: 0 4px 10px rgba(0,0,0,0.1); overflow: hidden; display: flex; flex-direction: column; }

.card-header { padding: 1rem; color: white; font-weight: bold; display: flex; align-items: center; justify-content: center; position: relative; }
.header-left { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; justify-content: center; }
.bg-orange { background-color: #FF724C; }
.bg-green { background-color: #10b981; }

.station-badge { 
    background-color: rgba(255, 255, 255, 0.25); 
    padding: 3px 8px; 
    border-radius: 12px; 
    font-size: 0.9rem; 
    font-weight: 800; 
    display: inline-block;
    white-space: nowrap;
}

.card-body { padding: 1.5rem; flex-grow: 1; }
.customer-info p { margin: 5px 0; color: #444; }

.items-list-container { background-color: #f9fafb; padding: 10px; border-radius: 6px; margin: 10px 0; border: 1px solid #eee; }
.item-row { display: flex; font-size: 0.9rem; margin-bottom: 4px; }
.item-qty { font-weight: bold; width: 30px; color: #2d3446; }
.item-name { color: #555; }

.total-row { display: flex; justify-content: space-between; font-weight: 800; margin-top: 1rem; color: #2d3446; font-size: 1.1rem; }
.divider { border: 0; border-top: 1px solid #eee; margin: 15px 0; }

.input-row { display: flex; align-items: center; gap: 10px; margin-bottom: 10px; }
.cash-input { width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px; font-size: 1.1rem; font-weight: bold; text-align: right; }
.change-display { text-align: right; font-weight: bold; color: #888; margin-bottom: 15px; }
.change-display.valid { color: #10b981; }

.paid-badge { background: #d1fae5; color: #065f46; padding: 5px; text-align: center; font-weight: bold; border-radius: 4px; margin-bottom: 10px; }

.action-btn { width: 100%; padding: 12px; border: none; border-radius: 6px; font-weight: bold; cursor: pointer; color: white; font-size: 1rem; transition: background 0.2s; }
.btn-cash { background-color: #2d3446; }
.btn-cash:disabled { background-color: #ccc; cursor: not-allowed; }
.btn-cash:hover:not(:disabled) { background-color: #1f2937; }
.btn-serve { background-color: #10b981; }
.btn-serve:hover { background-color: #059669; }

.modal-overlay {
  position: fixed; top: 0; left: 0; width: 100%; height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex; justify-content: center; align-items: center;
  z-index: 10000;
}
.modal-content {
  background: white; padding: 2rem; border-radius: 12px;
  width: 90%; max-width: 400px; text-align: center;
  box-shadow: 0 4px 20px rgba(0,0,0,0.2);
  animation: popIn 0.2s ease-out;
}
.modal-content h3 { margin-top: 0; color: #2d3748; }
.modal-body { margin: 1.5rem 0; color: #4a5568; }

.summary-box { background: #edf2f7; padding: 1rem; border-radius: 8px; margin-top: 1rem; }
.summary-box .row { display: flex; justify-content: space-between; margin-bottom: 0.5rem; }
.summary-box .change { color: #38a169; border-top: 1px solid #cbd5e0; padding-top: 0.5rem; margin-top: 0.5rem; font-size: 1.1rem; }

.modal-actions { display: flex; gap: 1rem; justify-content: center; margin-top: 1.5rem; }

.btn-cancel { padding: 0.75rem 1.5rem; background: #e2e8f0; border: none; border-radius: 6px; cursor: pointer; font-weight: 600; color: #4a5568; }
.btn-confirm-action { padding: 0.75rem 1.5rem; background: #2d3446; border: none; border-radius: 6px; cursor: pointer; font-weight: 600; color: white; }
.btn-confirm-action:hover { background: #1f2937; transform: scale(1.02); }

@keyframes popIn {
  from { transform: scale(0.9); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}
</style>