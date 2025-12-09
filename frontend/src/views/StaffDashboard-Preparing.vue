<template>
  <div class="staff-wrapper">
    <h2 class="page-title">Preparing</h2>

    <div v-if="orders.length === 0" class="empty-state">
      <div class="empty-icon">👨‍🍳</div>
      <p>Kitchen is clear!</p>
    </div>

    <div v-else class="orders-grid">
      <div v-for="order in orders" :key="order.order_id" class="order-card">
        
        <div class="card-header">
          <div class="header-id-station">
            <span class="order-id">#{{ order.order_id }}</span>
            <span class="station-badge" v-if="order.station_number">📍 {{ order.station_number }}</span>
          </div>
          <span class="order-time">{{ formatDate(order.created_at) }}</span>
        </div>

        <div class="card-items">
          <p class="section-label">Check items as you cook:</p>
          
          <div 
            v-for="(item, index) in order.order_items" 
            :key="index" 
            class="checklist-item"
            :class="{ 'checked': item.isChecked }"
            @click="toggleItem(item)"
          >
            <div class="checkbox">
              <span v-if="item.isChecked">✔</span>
            </div>
            <div class="item-details">
              <span class="item-name">
                <span class="qty">{{ item.quantity }}x</span> {{ item.name }}
              </span>
            </div>
          </div>
        </div>

        <div v-if="getOrderNote(order)" class="order-note-box">
            <strong>📝 Note:</strong> {{ getOrderNote(order) }}
        </div>

        <div class="card-action">
          <button 
            class="done-btn" 
            :class="{ 'disabled': !isOrderComplete(order) }"
            :disabled="!isOrderComplete(order)"
            @click="markReady(order.order_id)"
          >
            <span v-if="isOrderComplete(order)">✅ Mark Ready</span>
            <span v-else>⚠️ Complete Checklist</span>
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
let pollingInterval = null;

const fetchOrders = async () => {
  try {
    const response = await axios.get('http://localhost:3000/api/staff/orders/Preparing');
    
    const incomingOrders = response.data.map(newOrder => {
      const existingOrder = orders.value.find(o => o.order_id === newOrder.order_id);
      
      const mappedItems = newOrder.order_items ? newOrder.order_items.map((newItem, idx) => {
        let wasChecked = false;
        if (existingOrder && existingOrder.order_items[idx]) {
            wasChecked = existingOrder.order_items[idx].isChecked;
        }
        return { ...newItem, isChecked: wasChecked };
      }) : [];

      return { ...newOrder, order_items: mappedItems };
    });

    orders.value = incomingOrders;

  } catch (error) {
    console.error(error);
  }
};

const toggleItem = (item) => {
  item.isChecked = !item.isChecked;
};

const isOrderComplete = (order) => {
  if (!order.order_items || order.order_items.length === 0) return true; 
  return order.order_items.every(item => item.isChecked);
};

const getOrderNote = (order) => {
    if (order.order_items && order.order_items.length > 0) {
        return order.order_items[0].notes || '';
    }
    return '';
};

const markReady = async (orderId) => {
  try {
    await axios.patch(`http://localhost:3000/api/staff/orders/${orderId}/status`, {
      status: 'Ready'
    });
    orders.value = orders.value.filter(o => o.order_id !== orderId);
  } catch (error) {
    alert("Error updating order.");
  }
};

const formatDate = (dateString) => new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

onMounted(() => {
  fetchOrders();
  pollingInterval = setInterval(fetchOrders, 5000); 
});

onUnmounted(() => clearInterval(pollingInterval));
</script>

<style scoped>
.staff-wrapper { 
  padding: 1.5rem; 
}

.page-title { 
  font-size: 1.5rem; 
  color: #2d3446; 
  margin-bottom: 1rem; 
}

.empty-state { 
  text-align: center; 
  padding: 3rem; 
  color: #888; 
  background: #f9fafb; 
  border-radius: 8px; 
}

.empty-icon { 
  font-size: 3rem; 
  margin-bottom: 10px; 
}

.orders-grid { 
  display: grid; 
  grid-template-columns: repeat(auto-fill, 
  minmax(300px, 1fr)); 
  gap: 1.5rem; 
}

.order-card { 
  background: white; 
  border-radius: 0.5rem; 
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); 
  overflow: hidden; border-left: 5px solid #3b82f6; 
  display: flex; 
  flex-direction: column; 
}

.card-header { 
  display: flex; 
  justify-content: space-between; 
  padding: 0.75rem; 
  background-color: #3b82f6; 
  color: white; 
  font-weight: bold; 
  align-items: center; 
}

.order-id { 
  font-size: 1.1rem; 
}

.station-badge { 
  background: rgba(0,0,0,0.2); 
  padding: 2px 8px; 
  border-radius: 12px; 
  font-size: 0.9rem; 
  margin-left: 8px; 
}

.card-items { 
  padding: 1rem; 
  flex-grow: 1; 
}

.section-label { 
  font-size: 0.8rem; 
  color: #666; 
  margin-bottom: 0.5rem; 
  text-transform: uppercase; 
  letter-spacing: 0.5px; 
  font-weight: bold; 
}

.checklist-item { 
  display: flex; 
  align-items: center; 
  padding: 10px; 
  border-bottom: 1px solid #f0f0f0; 
  cursor: pointer; 
  transition: background 0.1s; 
}

.checklist-item:last-child { 
  border-bottom: none; 
}

.checklist-item:hover { 
  background-color: #f9f9f9; 
}

.checklist-item.checked { 
  background-color: #f0fdf4; 
}

.checklist-item.checked .item-name { 
  text-decoration: line-through; 
  color: #aaa; 
}

.checkbox { 
  width: 24px; 
  height: 24px; 
  border: 2px solid #ddd; 
  border-radius: 4px; 
  margin-right: 12px; 
  display: flex; 
  align-items: center; 
  justify-content: center; 
  background: white; 
  flex-shrink: 0; 
}

.checklist-item.checked .checkbox { 
  background-color: #10b981; 
  border-color: #10b981; 
  color: white; 
  font-size: 14px; 
}

.item-details { 
  display: flex; 
  flex-direction: column; 
}
.qty { 
  font-weight: 800; 
  color: #2d3446; 
  margin-right: 5px; 
}

.order-note-box { 
  background-color: #fffbeb; 
  border: 1px solid #fcd34d; 
  color: #92400e; 
  padding: 10px; 
  margin: 0 1rem 1rem 1rem; 
  border-radius: 6px; 
  font-size: 0.9rem; 
  font-style: italic; 
}

.card-action { 
  padding: 0.75rem; 
  border-top: 1px solid #eee; 
  background: #fafafa; 
}

.done-btn { 
  width: 100%; 
  padding: 0.8rem; 
  font-weight: 700; 
  border-radius: 0.375rem; 
  color: white; 
  background-color: #10b981; 
  border: none; 
  cursor: pointer; 
  transition: 0.2s; 
}

.done-btn:hover { 
  background-color: #059669; 
}

.done-btn.disabled { 
  background-color: #e5e7eb; 
  color: #9ca3af; 
  cursor: not-allowed; 
  }
  
</style>