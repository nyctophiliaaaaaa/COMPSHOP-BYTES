<template>
    <div class="orders-grid">
      <div v-for="order in orders" :key="order.id" class="order-card">
        <div class="card-header"><span class="header-title">ORDER COMPLETED</span></div>
        <div class="card-body">
          <div class="customer-info">
              <p><strong>Order #:</strong> {{ order.id }}</p>
              <p><strong>Customer:</strong> {{ order.name }}</p>
              <p><strong>Payment Method:</strong> {{ order.paymentMethod }}</p>
              <p><strong>Date & Time:</strong> {{ order.time }}</p>
          </div>
          <div class="items-table">
              <div class="table-head"><span>ITEMS</span><span>QTY</span><span>SUBTOTAL</span></div>
              <div v-for="(item, index) in order.items" :key="index" class="table-row">
                  <span class="item-name">{{ item.name }}</span>
                  <span class="item-qty">{{ item.qty || 1 }}x</span>
                  <span class="item-price">₱ {{ item.price.toFixed(2) }}</span>
              </div>
          </div>
          <div class="total-row"><span>TOTAL DUE:</span><span>₱ {{ order.total.toFixed(2) }}</span></div>
          <hr class="divider">
          <div class="payment-details">
              <p class="section-head">Payment Details:</p>
              <template v-if="order.paymentMethod === 'Cash'">
                  <p><strong>Amount Paid:</strong> ₱ {{ (order.cashReceived || 0).toFixed(2) }}</p>
                  <p><strong>Change:</strong> ₱ {{ (order.change || 0).toFixed(2) }}</p>
              </template>
              <template v-else>
                  <p><strong>Amount Paid:</strong> ₱ {{ order.total.toFixed(2) }}</p>
                  <p><strong>Ref No.:</strong> {{ order.referenceNo || 'N/A' }}</p>
              </template>
          </div>
          <button class="print-btn" @click="printReceipt(order)">PRINT RECEIPT</button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'StaffDashboardCompleted',
    props: { orders: { type: Array, required: true } },
    methods: {
      printReceipt(order) { alert(`Printing Receipt for Order #${order.id}...`); }
    }
  }
  </script>
  
  <style scoped>
  .orders-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(350px, 1fr)); gap: 1.5rem; }
  .order-card { background: white; border-radius: 0.8rem; box-shadow: 0 4px 15px rgba(0,0,0,0.08); overflow: hidden; border: 1px solid #eee; display: flex; flex-direction: column; }
  .card-header { background: #FF724C; padding: 1rem; text-align: center; color: white; font-weight: 700; font-size: 1rem; text-transform: uppercase; }
  .card-body { padding: 1.5rem; display: flex; flex-direction: column; flex-grow: 1; }
  .customer-info p, .payment-details p { margin: 0.2rem 0; font-size: 0.9rem; color: #333; }
  .items-table { margin-top: 1rem; font-size: 0.85rem; }
  .table-head { display: flex; justify-content: space-between; color: #888; font-weight: 600; margin-bottom: 0.5rem; }
  .table-row { display: flex; justify-content: space-between; margin-bottom: 0.4rem; color: #555; }
  .item-name { flex: 2; }
  .item-qty { flex: 0.5; text-align: center; }
  .item-price { flex: 1; text-align: right; }
  .total-row { display: flex; justify-content: space-between; margin-top: 1rem; font-weight: 800; font-size: 1rem; color: #1f2937; padding-top: 0.5rem; border-top: 1px solid #f3f4f6; }
  .divider { border: none; border-top: 1px solid #e5e7eb; margin: 1rem 0; }
  .section-head { font-weight: 700; margin-bottom: 0.5rem !important; }
  .print-btn { margin-top: 2rem; width: 100%; padding: 0.8rem; background-color: #FDBF50; border: none; border-radius: 8px; font-weight: 700; color: #333; cursor: pointer; font-size: 0.9rem; }
  .print-btn:hover { background-color: #e5ac44; }
  </style>