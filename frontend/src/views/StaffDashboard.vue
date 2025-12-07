<template>
  <div class="kds-container">
    
    <HeaderStaff class="staff-header-component" />

    <main class="kds-main-content">
      <div class="tabs-container" style="max-width: 650px;"> 
        
        <div 
          class="tab"
          :class="{ 'tab-active': currentTab === 'Orders' }"
          @click="currentTab = 'Orders'"
        >
          New Orders
        </div>
        
        <div 
          class="tab"
          :class="{ 'tab-active': currentTab === 'Preparing' }"
          @click="currentTab = 'Preparing'"
        >
          Preparing
        </div>
        
        <div 
          class="tab"
          :class="{ 'tab-active': currentTab === 'Ready' }"
          @click="currentTab = 'Ready'"
        >
          Ready for Delivery
        </div>
      </div>

      <h2 class="section-title">
          {{ currentTab === 'Orders' ? 'New Orders' : currentTab === 'Preparing' ? 'Preparing' : 'Ready for Delivery' }}
      </h2>

      <StaffDashboardOrders 
        v-if="currentTab === 'Orders'" 
        :orders="newOrders" 
        @prepare-order="handlePrepare"
      />
      <StaffDashboardPreparing 
        v-else-if="currentTab === 'Preparing'" 
        :orders="preparingOrders" 
        @done-order="handleDone"
      />
      <StaffDashboardReady 
        v-else-if="currentTab === 'Ready'" 
        :orders="readyOrders" 
      />

    </main>
  </div>
</template>

<script>
import HeaderStaff from '@/components/HeaderStaff.vue' 
import StaffDashboardOrders from './StaffDashboard-Orders.vue' 
import StaffDashboardPreparing from './StaffDashboard-Preparing.vue' 
import StaffDashboardReady from './StaffDashboard-Ready.vue' 

export default {
  name: 'StaffDashboard',
  components: {
    HeaderStaff,
    StaffDashboardOrders,
    StaffDashboardPreparing,
    StaffDashboardReady 
  },
  data() {
    return {
      currentTab: 'Orders',
      newOrders: [
        { id: '1009', time: '12:40 PM', name: 'James', station: 'PC15', items: ['Buldak Ramen Carbonara', 'Buldak Ramen Cheese', 'Tapsilog'], paymentStatus: 'PAID' },
        { id: '1010', time: '12:41 PM', name: 'Shiene', station: 'PC13', items: ['Buldak Ramen Carbonara', 'Buldak Ramen 2x', 'Tapsilog'], paymentStatus: 'Cash On Delivery' },
        { id: '1011', time: '12:42 PM', name: 'Joren', station: 'PC16', items: ['Pancit Canton - Calamansi', 'Buldak Ramen Cheese', 'Tapsilog'], paymentStatus: 'PAID' },
        { id: '1012', time: '12:43 PM', name: 'George', station: 'PC9', items: ['Buldak Ramen Carbonara', 'Pancit Canton - Calamansi', 'Tapsilog'], paymentStatus: 'PAID' },
      ],
      preparingOrders: [
        { id: '1001', time: '11:25 AM', name: 'Alex', station: 'PC1', items: ['Buldak Ramen Carbonara', 'Buldak Ramen Cheese', 'Tapsilog'], paymentStatus: 'PAID' },
        { id: '1002', time: '12:01 PM', name: 'Pauline', station: 'PC2', items: ['Buldak Ramen Carbonara', 'Buldak Ramen 2x', 'Tapsilog'], paymentStatus: 'Cash On Delivery' },
        { id: '1003', time: '12:05 PM', name: 'Candice', station: 'PC3', items: ['Pancit Canton - Calamansi', 'Buldak Ramen Cheese', 'Tapsilog'], paymentStatus: 'PAID' },
        { id: '1004', time: '12:08 PM', name: 'Maxene', station: 'PC4', items: ['Buldak Ramen Carbonara', 'Pancit Canton - Calamansi', 'Tapsilog'], paymentStatus: 'Cash On Delivery' },
        { id: '1005', time: '12:10 PM', name: 'Kristine', station: 'PC5', items: ['Buldak Ramen Carbonara', 'Jin Ramen Mild', 'Tapsilog'], paymentStatus: 'Cash On Delivery' },
        { id: '1006', time: '12:25 PM', name: 'Francis', station: 'PC6', items: ['Shin Ramyun Black', 'Buldak Ramen Carbonara', 'Tapsilog'], paymentStatus: 'PAID' },
        { id: '1007', time: '12:30 PM', name: 'Anthony', station: 'PC7', items: ['Pancit Canton - Sweet and spicy', 'Shin Ramyun Black', 'Tapsilog'], paymentStatus: 'Cash On Delivery' },
        { id: '1008', time: '12:32 PM', name: 'Mariel', station: 'PC8', items: ['Pancit Canton - Chilimansi', 'Buldak Ramen Carbonara', 'Tapsilog'], paymentStatus: 'PAID' },
      ],
      readyOrders: [ 
         { id: '1000', time: '12:15 PM', name: 'Renz', station: 'PC10', items: ['Buldak Ramen Carbonara', 'Buldak Ramen Cheese', 'Tapsilog'], paymentStatus: 'Cash On Delivery' },
         { id: '999', time: '12:10 PM', name: 'Ken', station: 'PC12', items: ['Buldak Ramen Carbonara', 'Buldak Ramen 2x', 'Tapsilog'], paymentStatus: 'PAID' },
      ],
    };
  },
  
  mounted() {
    if (this.$socket) {
      this.$socket.on('NEW_ORDER_RECEIVED', this.handleNewOrder);
    }
  },
  
  beforeUnmount() {
    if (this.$socket) {
      this.$socket.off('NEW_ORDER_RECEIVED', this.handleNewOrder);
    }
  },
  
  methods: {
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
        const orderToMove = this.preparingOrders.splice(index, 1)[0];
        this.readyOrders.unshift(orderToMove);
      }
    }
  }
};
</script>

<style scoped>
:root { 
  --color-text-dark: #1f2937; 
}

.kds-container { 
  min-height: 100vh; 
  background-color: #f3f4f6; 
  padding: 0; 
  font-family: Arial, sans-serif; 
}

.staff-header-component { 
  margin-bottom: 1.5rem;
}

.kds-main-content { 
  max-width: 1200px; 
  padding: 0 1rem 1rem 1rem; 
  margin: 0 auto; 
}

.tabs-container {
  display: flex; 
  justify-content: center; 
  margin-bottom: 2.5rem; 
  background-color: #e6e6e6; 
  border-radius: 0.5rem; 
  max-width: 650px; 
  margin-left: auto; 
  margin-right: auto; 
  padding: 0; 
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05); 
}

.tab {
  padding: 0.5rem 1.5rem; 
  font-weight: 400; 
  cursor: pointer; 
  transition: all 0.15s ease-in-out;
  flex: 1; 
  text-align: center; 
  font-size: 1.1rem; 
  color: #6b7280; 
  white-space: nowrap; 
}

.tab-active {
  background-color: white; 
  color: var(--color-text-dark); 
  font-weight: 700; 
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1); 
  position: relative; z-index: 10;
}

.tab:nth-child(1).tab-active { 
  border-radius: 0.5rem 0 0 0.5rem; 
}

.tab:nth-child(2).tab-active { 
  border-radius: 0; 
}

.tab:nth-child(3).tab-active { 
  border-radius: 0 0.5rem 0.5rem 0; 
}

.tab:not(.tab-active):hover { 
  color: var(--color-text-dark); 
  background-color: #dbdbdb; 
}

.section-title {
  font-size: 1.5rem; 
  font-weight: 700; 
  color: var(--color-text-dark); 
  margin-bottom: 1.5rem; 
  margin-top: 1rem; 
  text-align: center;
}

</style>