<script setup>
import { ref, onMounted, provide } from 'vue';
import { RouterView } from 'vue-router';
// 🟢 FIX 1: Import the correct file name
import HeaderBar from './components/HeaderBar.vue'; 
import OrderStatus from './components/OrderStatus.vue';

const isOrderPopupOpen = ref(false);
const isCustomer = ref(false);

const openOrders = () => {
  isOrderPopupOpen.value = true;
};

onMounted(() => {
  const role = localStorage.getItem('role'); 
  if (role === 'customer') {
    isCustomer.value = true;
  }
});

provide('openOrders', openOrders); 
</script>

<template>
  <div class="app-container">
    
    <HeaderBar 
      v-if="isCustomer" 
      @open-orders="openOrders" 
    />

    <RouterView />

    <OrderStatus 
      v-if="isCustomer"
      :isOpen="isOrderPopupOpen" 
      @close="isOrderPopupOpen = false" 
    />

  </div>
</template>

<style>
/* Global styles */
body { margin: 0; font-family: 'Poppins', sans-serif; background-color: #f8f9fa; }
</style>