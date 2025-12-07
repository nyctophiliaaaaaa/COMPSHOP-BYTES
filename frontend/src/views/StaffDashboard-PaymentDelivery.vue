<template>
    <div class="orders-grid">
      <div 
        v-for="order in orders" 
        :key="order.id" 
        class="order-card"
      >
        <!-- HEADER -->
        <div class="card-header">
          <span class="header-title">
              Order #{{ order.id }} - {{ order.paymentMethod === 'Cash' ? 'CASH PAYMENT' : 'DIGITAL PAYMENT (QR)' }}
          </span>
        </div>
  
        <div class="card-body">
          <div class="customer-info">
              <p><strong>Customer:</strong> {{ order.name }}</p>
              <p><strong>Time Placed:</strong> {{ order.time }}</p>
              <p><strong>Station:</strong> {{ order.station }}</p>
          </div>
  
          <div class="items-table">
              <div class="table-head">
                  <span>ITEMS</span><span>QTY</span><span>SUBTOTAL</span>
              </div>
              <div v-for="(item, index) in order.items" :key="index" class="table-row">
                  <span class="item-name">{{ item.name }}</span>
                  <span class="item-qty">{{ item.qty || '1' }}x</span>
                  <span class="item-price">₱ {{ item.price ? item.price.toFixed(2) : '0.00' }}</span>
              </div>
          </div>
  
          <div class="total-row">
              <span>TOTAL DUE:</span>
              <span>₱ {{ order.total ? order.total.toFixed(2) : '0.00' }}</span>
          </div>
  
          <hr class="divider">
  
          <!-- CASH FLOW -->
          <div v-if="order.paymentMethod === 'Cash'">
              <div class="payment-input-section">
                  <label>Cash Received: ₱</label>
                  <input type="number" v-model.number="order.cashReceived" placeholder="0.00" class="cash-input" />
              </div>
              <div class="payment-info">
                  <p><strong>Change:</strong> ₱ {{ calculateChange(order) }}</p>
              </div>
          </div>
  
          <!-- DIGITAL FLOW -->
          <div v-else>
              <div class="payment-info">
                  <!-- Dynamic Status based on isPaid -->
                  <p><strong>Payment Status:</strong> 
                      <span :class="order.isPaid ? 'success-text' : 'pending-text'">
                          {{ order.isPaid ? 'Successful' : 'To be verified' }}
                      </span>
                  </p>
                  <p><strong>Reference No.:</strong> {{ order.referenceNo || 'N/A' }}</p>
                  <p><strong>Amount Paid:</strong> ₱ {{ order.total ? order.total.toFixed(2) : '0.00' }}</p>
              </div>
          </div>
  
          <!-- BUTTONS -->
          <div class="action-buttons">
              <button 
                  class="action-btn" 
                  :class="getPaidBtnClass(order)" 
                  @click="markAsPaid(order)" 
                  :disabled="isPaidDisabled(order)"
              >
                  {{ order.isPaid ? 'PAID' : (order.paymentMethod === 'Cash' ? 'MARK AS PAID' : 'VERIFY PAYMENT') }}
              </button>
  
              <button 
                  class="action-btn" 
                  :class="getDeliveredBtnClass(order)" 
                  @click="markAsDelivered(order)" 
                  :disabled="!order.isPaid"
              >
                  DELIVERED
              </button>
          </div>
  
          <div class="status-footer">
              Status: <span :class="getStatusClass(order)">{{ getStatusText(order) }}</span>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'StaffDashboardPaymentDelivery',
    props: { orders: { type: Array, required: true } },
    emits: ['order-completed'],
    watch: {
      orders: {
        handler(newVal) {
          newVal.forEach(order => {
            if (order.paymentMethod === 'Cash' && order.cashReceived === 0) {
              order.cashReceived = null;
            }
          });
        },
        deep: true,
        immediate: true
      }
    },
    methods: {
      calculateChange(order) {
          if (!order.cashReceived) return '0.00';
          const change = order.cashReceived - order.total;
          return change > 0 ? change.toFixed(2) : '0.00';
      },
      isPaidDisabled(order) {
          if (order.isPaid) return true;
          if (order.paymentMethod === 'Cash') return (order.cashReceived || 0) < order.total;
          return false; 
      },
      getPaidBtnClass(order) {
          if (order.isPaid) return 'btn-completed';
          if (order.paymentMethod === 'Cash') return (order.cashReceived || 0) >= order.total ? 'btn-active-primary' : 'btn-disabled';
          return 'btn-active-primary';
      },
      getDeliveredBtnClass(order) {
          if (!order.isPaid) return 'btn-disabled';
          return 'btn-active-primary';
      },
      markAsPaid(order) { order.isPaid = true; },
      markAsDelivered(order) {
          if (!order.isPaid) return;
          order.isDelivered = true;
          this.$emit('order-completed', order);
      },
      getStatusText(order) {
          if (order.isDelivered) return 'Delivered';
          if (order.isPaid) return 'Ready for Delivery';
          return 'Pending Payment';
      },
      getStatusClass(order) {
          if (order.isDelivered) return 'text-green';
          if (order.isPaid) return 'text-orange';
          return 'text-red';
      }
    }
  }
  </script>
  
  <style scoped>
  .orders-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(350px, 1fr)); gap: 1.5rem; }
  .order-card { background: white; border-radius: 0.8rem; box-shadow: 0 4px 15px rgba(0,0,0,0.08); overflow: hidden; border: 1px solid #eee; display: flex; flex-direction: column; }
  .card-header { background: #FF724C; padding: 1rem; text-align: center; color: white; font-weight: 700; font-size: 1rem; text-transform: uppercase; }
  .card-body { padding: 1.5rem; display: flex; flex-direction: column; flex-grow: 1; }
  .customer-info p { margin: 0.3rem 0; font-size: 0.9rem; color: #333; }
  .items-table { margin-top: 1rem; font-size: 0.85rem; }
  .table-head { display: flex; justify-content: space-between; color: #888; font-weight: 600; margin-bottom: 0.5rem; font-size: 0.75rem; letter-spacing: 0.5px; }
  .table-row { display: flex; justify-content: space-between; margin-bottom: 0.4rem; color: #555; }
  .item-name { flex: 2; }
  .item-qty { flex: 0.5; text-align: center; }
  .item-price { flex: 1; text-align: right; }
  .total-row { display: flex; justify-content: space-between; margin-top: 1rem; font-weight: 800; font-size: 1rem; color: #1f2937; padding-top: 0.5rem; border-top: 1px solid #f3f4f6; }
  .divider { border: none; border-top: 1px solid #e5e7eb; margin: 1.5rem 0; }
  .payment-input-section { display: flex; align-items: center; gap: 10px; margin-bottom: 0.5rem; }
  .payment-input-section label { font-weight: 700; font-size: 0.95rem; }
  
  .cash-input { 
      border: 1px solid #d1d5db; 
      border-radius: 4px; 
      padding: 8px; 
      width: 100px; 
      font-weight: 700; 
      text-align: right; 
      -moz-appearance: textfield; 
  }
  .cash-input::-webkit-outer-spin-button,
  .cash-input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  
  .payment-info p { margin: 0.3rem 0; font-size: 0.95rem; color: #374151; }
  .success-text { color: #10b981; font-weight: 700; }
  .pending-text { color: #f59e0b; font-weight: 700; }
  
  .action-buttons { display: flex; gap: 1rem; margin-top: 2rem; }
  .action-btn { flex: 1; padding: 0.8rem; border: none; border-radius: 8px; font-weight: 700; font-size: 0.9rem; cursor: pointer; transition: all 0.2s; color: white; }
  
  /* 🟢 UPDATED: Hover Effects added here */
  .btn-active-primary { 
      background-color: #FDBF50; 
      color: #333; 
      box-shadow: 0 2px 5px rgba(0,0,0,0.1);
  }
  .btn-active-primary:hover {
      background-color: #e5ac44; /* Darker yellow/orange */
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(253, 191, 80, 0.4);
  }
  
  .btn-completed { background-color: #2D3446; cursor: default; }
  .btn-disabled { background-color: #e5e7eb; color: #9ca3af; cursor: not-allowed; }
  
  .status-footer { margin-top: 1.5rem; text-align: center; font-size: 0.9rem; font-weight: 600; color: #4b5563; }
  .text-orange { color: #f59e0b; }
  .text-green { color: #10b981; }
  .text-red { color: #ef4444; }
  </style>