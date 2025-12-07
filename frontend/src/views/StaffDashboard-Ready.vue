<template>
  <div class="orders-grid">
    <div 
      v-for="order in orders" 
      :key="order.id" 
      class="order-card"
    >
      <div class="card-header">
        <div class="header-id-station">
          <span class="order-id">#{{ order.id }}</span>
          <span class="order-station">{{ order.station }}</span>
        </div>
        <div class="header-time-name">
          <span class="order-time">{{ order.time }}</span>
          <span class="order-name">{{ order.name }}</span>
        </div>
      </div>

      <div class="card-items">
        <div v-for="item in order.items" :key="item" class="item-row">
          <span class="item-qty">1x</span>
          <span>{{ item }}</span>
        </div>
        
        <hr class="divider">
        
        <div class="status-row">
            <span class="status-label">Status:</span>
            <span class="status-value ready-text">Completed</span>
        </div>
        <div class="status-row">
            <span class="status-label">Payment:</span>
            <span class="status-value" :class="{ 'cash-on-delivery': order.paymentStatus === 'Cash On Delivery' }">
                {{ order.paymentStatus || 'PAID' }}
            </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'StaffDashboardReady',
  props: {
    orders: { type: Array, required: true }
  }
}
</script>

<style scoped>
.orders-grid { 
    display: grid; 
    grid-template-columns: repeat(4, 1fr); 
    gap: 1.5rem; 
    padding: 0; 
}

.order-card { 
    background-color: white; 
    border-radius: 0.5rem; 
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); 
    overflow: hidden; 
}

.card-header { 
    display: flex; 
    justify-content: space-between; 
    align-items: center; 
    padding: 0.5rem 0.75rem; 
    color: #FFFFFF; 
    font-weight: 600; 
    background-color: #FF724C; 
}

.header-id-station { 
    display: flex; 
    align-items: center; 
    gap: 0.75rem; 
    font-weight: 700; 
    font-size: 1rem; 
}

.order-station { 
    font-size: 0.85rem; 
    font-weight: 400; 
    opacity: 0.9; 
}

.header-time-name { 
    display: flex; 
    flex-direction: column;
    align-items: flex-end; 
    line-height: 1.2; 
}

.order-time { 
    font-size: 0.75rem; 
    font-weight: 400; 
    opacity: 0.8; 
}

.order-name { 
    font-size: 0.85rem; 
    font-weight: 500; 
}

.card-items { 
    padding: 1rem; 
    font-size: 0.9rem; 
    display: flex; 
    flex-direction: column; 
    gap: 0.75rem; 
}

.item-row { 
    display: flex; 
    margin: 0.1rem 0; 
}

.item-qty { 
    width: 2rem; 
    min-width: 2rem; 
    font-weight: 600; 
}

.divider { 
    border: none; 
    border-top: 1px solid #e5e7eb; 
    margin: 0.5rem 0; 
}

.status-row { 
    display: flex; 
    justify-content: space-between; 
    font-size: 0.85rem; 
    padding: 0.1rem 0; 
}

.status-label { 
    font-weight: 600; 
    color: #4b5563; 
}

.status-value { 
    font-weight: 700; 
}

.ready-text { 
    color: #10b981; 
}

.cash-on-delivery { 
    color: #f59e0b; 
}

@media (max-width: 1250px) { 
    .orders-grid { 
        grid-template-columns: repeat(4, 1fr); 
        } 
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