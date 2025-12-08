<template>
  <div class="kds-container">
    
    <HeaderStaff class="staff-header-component" />

    <main class="kds-main-content">
      
      <div class="role-selector">
        <button 
          :class="{ 'role-active': staffRole === 'Cashier' }" 
          @click="switchRole('Cashier')"
        >
          💰 Cashier (Verify & Serve)
        </button>
        <button 
          :class="{ 'role-active': staffRole === 'Kitchen' }" 
          @click="switchRole('Kitchen')"
        >
          👨‍🍳 Kitchen (Cook)
        </button>
      </div>

      <div class="tabs-container"> 
        
        <div 
          v-if="staffRole === 'Cashier'"
          class="tab" 
          :class="{ 'tab-active': currentTab === 'Orders' }" 
          @click="currentTab = 'Orders'"
        >
          New Orders (Verify)
        </div>

        <div 
          v-if="staffRole === 'Cashier'"
          class="tab" 
          :class="{ 'tab-active': currentTab === 'Ready' }" 
          @click="currentTab = 'Ready'"
        >
          Ready to Serve
        </div>

        <div 
          v-if="staffRole === 'Cashier'"
          class="tab" 
          :class="{ 'tab-active': currentTab === 'Completed' }" 
          @click="currentTab = 'Completed'"
        >
          History
        </div>
        
        <div 
          v-if="staffRole === 'Kitchen'"
          class="tab" 
          :class="{ 'tab-active': currentTab === 'Preparing' }" 
          @click="currentTab = 'Preparing'"
        >
          Kitchen Queue
        </div>

      </div>

      <h2 class="section-title">
          {{ getTitle() }}
      </h2>

      <StaffDashboardOrders 
        v-if="currentTab === 'Orders'" 
      />

      <StaffDashboardPreparing 
        v-if="currentTab === 'Preparing'" 
      />

      <StaffDashboardReady 
        v-if="currentTab === 'Ready'" 
      />

      <StaffDashboardCompleted 
        v-if="currentTab === 'Completed'" 
      />

    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import HeaderStaff from '@/components/HeaderStaff.vue';
import StaffDashboardOrders from './StaffDashboard-Orders.vue';
import StaffDashboardPreparing from './StaffDashboard-Preparing.vue';
import StaffDashboardReady from './StaffDashboard-PaymentDelivery.vue'; // Using your PaymentDelivery file
import StaffDashboardCompleted from './StaffDashboard-Completed.vue';

// State
const staffRole = ref('Cashier'); // Default to Cashier now (Entry point)
const currentTab = ref('Orders'); 

// Logic
const switchRole = (role) => {
  staffRole.value = role;
  
  // Auto-switch to the main tab for that role
  if (role === 'Kitchen') {
      currentTab.value = 'Preparing'; // Kitchen only cares about cooking
  } else {
      currentTab.value = 'Orders'; // Cashier starts by verifying orders
  }
};

const getTitle = () => {
  const titles = { 
    'Orders': 'Incoming Orders (Pending Verification)', 
    'Preparing': 'Kitchen Queue (Cooking)', 
    'Ready': 'Ready for Serving', 
    'Completed': 'Order History' 
  };
  return titles[currentTab.value];
};
</script>

<style scoped>
:root { --color-text-dark: #1f2937; }
.kds-container { min-height: 100vh; background-color: #f3f4f6; padding: 0; font-family: Arial, sans-serif; }
.staff-header-component { margin-bottom: 1.5rem;}
.kds-main-content { max-width: 1200px; padding: 0 1rem 1rem 1rem; margin: 0 auto; }

/* ROLE SWITCHER STYLES */
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
  border-radius: 0.5rem;
}

.tab:not(.tab-active):hover { color: var(--color-text-dark); background-color: #dbdbdb; }

.section-title {
  font-size: 1.5rem; font-weight: 700; color: var(--color-text-dark); 
  margin-bottom: 1.5rem; margin-top: 1rem; text-align: center;
}
</style>