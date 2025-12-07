<template>
  <div class="kds-container">
    
    <HeaderStaff class="staff-header-component" />

    <main class="kds-main-content">
      
      <!-- 🟢 ROLE SWITCHER (Kitchen vs Cashier) -->
      <div class="role-selector">
        <button 
          :class="{ 'role-active': staffRole === 'Kitchen' }" 
          @click="switchRole('Kitchen')"
        >
          👨‍🍳 Kitchen Staff
        </button>
        <button 
          :class="{ 'role-active': staffRole === 'Cashier' }" 
          @click="switchRole('Cashier')"
        >
          💰 Cashier
        </button>
      </div>

      <!-- Tabs Navigation -->
      <div class="tabs-container"> 
        
        <!-- Kitchen Tabs -->
        <div 
          v-if="staffRole === 'Kitchen'"
          class="tab" 
          :class="{ 'tab-active': currentTab === 'Orders' }" 
          @click="currentTab = 'Orders'"
        >
          New Orders
        </div>
        
        <div 
          v-if="staffRole === 'Kitchen'"
          class="tab" 
          :class="{ 'tab-active': currentTab === 'Preparing' }" 
          @click="currentTab = 'Preparing'"
        >
          Preparing
        </div>
        
        <!-- Cashier Tabs -->
        <div 
          v-if="staffRole === 'Cashier'"
          class="tab" 
          :class="{ 'tab-active': currentTab === 'Ready' }" 
          @click="currentTab = 'Ready'"
        >
          Payment & Delivery
        </div>

        <div 
          v-if="staffRole === 'Cashier'"
          class="tab" 
          :class="{ 'tab-active': currentTab === 'Completed' }" 
          @click="currentTab = 'Completed'"
        >
          Completed
        </div>

      </div>

      <h2 class="section-title">
          {{ getTitle() }}
      </h2>

      <!-- TAB 1: NEW ORDERS -->
      <StaffDashboardOrders 
        v-if="currentTab === 'Orders'" 
        :orders="newOrders" 
        @prepare-order="handlePrepare"
      />

      <!-- TAB 2: PREPARING -->
      <StaffDashboardPreparing 
        v-else-if="currentTab === 'Preparing'" 
        :orders="preparingOrders" 
        @done-order="handleDone"
      />

      <!-- TAB 3: PAYMENT & DELIVERY -->
      <StaffDashboardPaymentDelivery 
        v-else-if="currentTab === 'Ready'" 
        :orders="readyOrders" 
        @order-completed="handleOrderCompleted"
      />

      <!-- TAB 4: COMPLETED -->
      <StaffDashboardCompleted 
        v-else-if="currentTab === 'Completed'" 
        :orders="completedOrders" 
      />

    </main>
  </div>
</template>

<script>
import HeaderStaff from '@/components/HeaderStaff.vue' 
import StaffDashboardOrders from './StaffDashboard-Orders.vue' 
import StaffDashboardPreparing from './StaffDashboard-Preparing.vue' 
import StaffDashboardPaymentDelivery from './StaffDashboard-PaymentDelivery.vue' 
import StaffDashboardCompleted from './StaffDashboard-Completed.vue'

export default {
  name: 'StaffDashboard',
  components: {
    HeaderStaff,
    StaffDashboardOrders,
    StaffDashboardPreparing,
    StaffDashboardPaymentDelivery,
    StaffDashboardCompleted
  },
  data() {
    return {
      staffRole: 'Kitchen', // Default role
      currentTab: 'Orders', // Default tab matches Kitchen role
      
      newOrders: [
        { id: '1001', time: '11:25 AM', name: 'Alex', station: 'PC1', items: ['Buldak Ramen Carbonara', 'Buldak Ramen Cheese', 'Tapsilog'], paymentStatus: 'PAID' },
        { id: '1002', time: '12:01 PM', name: 'Pauline', station: 'PC2', items: ['Buldak Ramen Carbonara', 'Buldak Ramen 2x', 'Tapsilog'], paymentStatus: 'Cash On Delivery' },
        { id: '1005', time: '10:22 AM', name: 'Kristine', station: 'PC5', items: ['Buldak Ramen Carbonara', 'Jin Ramen Mild', 'Tapsilog'], paymentStatus: 'Cash On Delivery' },
        { id: '1009', time: '12:40 PM', name: 'James', station: 'PC15', items: ['Buldak Ramen Carbonara', 'Buldak Ramen Cheese', 'Tapsilog'], paymentStatus: 'PAID' },
        { id: '1010', time: '12:41 PM', name: 'Shiene', station: 'PC13', items: ['Buldak Ramen Carbonara', 'Buldak Ramen 2x', 'Tapsilog'], paymentStatus: 'Cash On Delivery' },
        { id: '1011', time: '11:23 AM', name: 'Candice', station: 'PC16', items: ['Pancit Canton - Sweet', 'Shin Ramyun Black'], paymentStatus: 'PAID' }
      ],
      
      preparingOrders: [],
      readyOrders: [],
      completedOrders: []
    };
  },
  
  methods: {
    // 🟢 Switch Role Logic
    switchRole(role) {
        this.staffRole = role;
        // Automatically switch to the first available tab for that role
        if (role === 'Kitchen') {
            this.currentTab = 'Orders';
        } else {
            this.currentTab = 'Ready';
        }
    },

    getTitle() {
        const titles = { 'Orders': 'New Orders', 'Preparing': 'Kitchen Preparing', 'Ready': 'Payment & Delivery', 'Completed': 'Completion' };
        return titles[this.currentTab];
    },
    handleNewOrder(newOrderData) {
      this.newOrders.unshift(newOrderData);
    },
    handlePrepare(orderId) {
      const index = this.newOrders.findIndex(order => order.id === orderId);
      if (index !== -1) {
        const orderToMove = this.newOrders.splice(index, 1)[0];
        this.preparingOrders.unshift(orderToMove);
      }
    },
    handleDone(orderId) {
      const index = this.preparingOrders.findIndex(order => order.id === orderId);
      if (index !== -1) {
        const order = this.preparingOrders.splice(index, 1)[0];
        
        // Transform data for Payment & Delivery View
        const detailedOrder = {
            ...order,
            paymentMethod: order.paymentStatus === 'Cash On Delivery' ? 'Cash' : 'GCash', 
            total: 150.00, // Mock Total
            items: order.items.map(i => ({ name: i, qty: 1, price: 50.00 })), 
            isPaid: false, // Always force verification step
            isDelivered: false
        };
        
        this.readyOrders.unshift(detailedOrder);
      }
    },
    handleOrderCompleted(completedOrder) {
        // Move from Ready -> Completed
        const index = this.readyOrders.findIndex(o => o.id === completedOrder.id);
        if (index !== -1) {
            this.readyOrders.splice(index, 1);
            this.completedOrders.unshift(completedOrder);
        }
    }
  }
};
</script>

<style scoped>
:root { --color-text-dark: #1f2937; }
.kds-container { min-height: 100vh; background-color: #f3f4f6; padding: 0; font-family: Arial, sans-serif; }
.staff-header-component { margin-bottom: 1.5rem;}
.kds-main-content { max-width: 1200px; padding: 0 1rem 1rem 1rem; margin: 0 auto; }

/* 🟢 ROLE SWITCHER STYLES */
.role-selector {
    display: flex;
    justify-content: center;
    gap: 1rem;
    margin-bottom: 1.5rem;
}
.role-selector button {
    padding: 0.5rem 1.5rem;
    border: 2px solid #e5e7eb;
    background: white;
    border-radius: 25px;
    font-weight: 600;
    color: #6b7280;
    cursor: pointer;
    transition: all 0.2s;
}
.role-selector button.role-active {
    background-color: #2D3446;
    color: white;
    border-color: #2D3446;
    transform: scale(1.05);
}

.tabs-container {
  display: flex; justify-content: center; margin-bottom: 2.5rem; 
  background-color: #e6e6e6; border-radius: 0.5rem; 
  max-width: 800px; 
  margin-left: auto; margin-right: auto; 
  padding: 0; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05); 
}

.tab {
  padding: 0.5rem 1.5rem; font-weight: 400; cursor: pointer; 
  transition: all 0.15s ease-in-out; flex: 1; text-align: center; 
  font-size: 1.1rem; color: #6b7280; white-space: nowrap; 
}

.tab-active {
  background-color: white; color: var(--color-text-dark); 
  font-weight: 700; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1); 
  position: relative; z-index: 10;
  border-radius: 0.5rem; /* Rounded for active tab */
}

.tab:not(.tab-active):hover { color: var(--color-text-dark); background-color: #dbdbdb; }

.section-title {
  font-size: 1.5rem; font-weight: 700; color: var(--color-text-dark); 
  margin-bottom: 1.5rem; margin-top: 1rem; text-align: center;
}
</style>