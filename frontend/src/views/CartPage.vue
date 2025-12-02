<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';

import appLogo from '@/assets/logo.png';

const router = useRouter();

const cartItems = ref([]);
const stationName = ref('Station --'); 

onMounted(() => {
  const storedCart = localStorage.getItem('myCart');
  if (storedCart) {
    cartItems.value = JSON.parse(storedCart);
  }

  const randomStation = Math.floor(Math.random() * 50) + 1;
  stationName.value = `Station ${randomStation}`;
});

const totalItems = computed(() => {
  return cartItems.value.reduce((acc, item) => acc + item.quantity, 0);
});

const subtotal = computed(() => {
  return cartItems.value.reduce((acc, item) => acc + (item.price * item.quantity), 0);
});

const saveCart = () => {
  localStorage.setItem('myCart', JSON.stringify(cartItems.value));
};

const increaseQty = (item) => {
  item.quantity++;
  saveCart();
};

const decreaseQty = (item) => {
  if (item.quantity > 1) {
    item.quantity--;
    saveCart();
  }
};

const removeItem = (id) => {
  cartItems.value = cartItems.value.filter(item => item.id !== id);
  saveCart();
};

const goBack = () => {
  router.push('/dashboard'); 
};

const handleCheckout = () => {
  if (cartItems.value.length === 0) {
    alert('Your cart is empty.');
    return;
  }

  router.push('/checkout');
};
</script>

<template>
  <div class="cart-container">
    
    <header class="top-bar">
      <div class="logo">
        <img :src="appLogo" alt="Logo" class="logo-img" />
        CompShop Bytes
      </div>
      <div class="user-info">
        <span class="station-id">{{ stationName }}</span>
        
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-shopping-cart">
          <circle cx="9" cy="21" r="1"></circle>
          <circle cx="20" cy="21" r="1"></circle>
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
        </svg>

        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-user">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
          <circle cx="12" cy="7" r="4"></circle>
        </svg>
      </div>
    </header>

    <main class="main-content">
      <div class="cart-wrapper">
        
        <div class="top-nav-row">
           <a href="#" @click.prevent="goBack" class="back-link">
             <span class="arrow">←</span> CONTINUE SHOPPING
           </a>
        </div>

        <div class="main-cart-card">

           <div class="cart-header-row">
              <h2>Shopping Cart</h2>
              <div class="header-right">
                 <span class="item-count-label">{{ totalItems }} Items</span>
              </div>
           </div>
           
           <div class="divider"></div>

           <div v-if="cartItems.length > 0" class="cart-list">
             
             <div v-for="item in cartItems" :key="item.id" class="cart-item-card">
               <div class="item-left">
                 <div class="img-wrapper">
                   <img :src="item.image" :alt="item.name" />
                 </div>
                 <div class="details">
                   <h3>{{ item.name }}</h3>
                   <span class="cat-text">{{ item.category }}</span>
                 </div>
               </div>

               <div class="item-right">
                 <div class="qty-control">
                   <button @click="decreaseQty(item)">-</button>
                   <input type="text" readonly :value="item.quantity" />
                   <button @click="increaseQty(item)">+</button>
                 </div>

                 <div class="price">₱ {{ item.price * item.quantity }}</div>

                 <button class="remove-btn" @click="removeItem(item.id)">
                   ✕
                 </button>
               </div>
             </div>

             <div class="cart-footer">
                <div class="total-row-display">
                   <span class="total-label">Cart Total</span>
                   <span class="total-amount">₱ {{ subtotal.toFixed(2) }}</span>
                </div>
                <button class="checkout-btn" @click="handleCheckout">CHECKOUT</button>
             </div>
           </div>

           <div v-else class="empty-cart">
             <p>Your cart is empty.</p>
           </div>
        </div>

      </div>
    </main>
  </div>
</template>

<style scoped>

.cart-container {
  min-height: 100vh;
  background-color: #f0f2f5;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.top-bar {
  background-color: white;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

.logo {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 1.5rem;
  font-weight: 700;
  color: #2c3e50;
}

.logo-img {
  height: 40px;
  width: auto;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 15px;
  font-weight: 600;
  color: #555;
}

.user-info svg {
  color: #333;
  width: 24px;
  height: 24px;
}

.main-content {
  padding: 2rem;
  display: flex;
  justify-content: center;
}

.cart-wrapper {
  width: 100%;
  max-width: 900px; 
}

.top-nav-row {
  margin-bottom: 1.5rem;
}

.back-link {
  color: #333;
  text-decoration: none;
  font-weight: 800; 
  font-size: 0.9rem;
  letter-spacing: 0.5px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px; 
  background-color: white;
  border-radius: 30px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.05); 
  transition: all 0.2s ease;
}

.back-link:hover {
  background-color: #f0f0f0;
  transform: translateX(-2px);
}

.arrow {
  font-size: 1.1rem;
  font-weight: bold;
}

.main-cart-card {
  background-color: white;
  border-radius: 4px; 
  box-shadow: 0 4px 20px rgba(0,0,0,0.05);
  padding: 2.5rem;
  min-height: 500px;
}

.cart-header-row {
  display: flex;
  justify-content: space-between; 
  align-items: center;
  margin-bottom: 1rem;
  width: 100%; 
}

.cart-header-row h2 {
  font-size: 1.8rem;
  color: #333;
  margin: 0;
  font-weight: 700;
}

.header-right {
  display: flex;
  justify-content: flex-end; 
  flex: 1; 
}

.item-count-label {
  font-size: 1.3rem; 
  font-weight: 700;  
  color: #333;
}

.divider {
  height: 1px;
  background-color: #eee;
  margin-bottom: 2rem;
  width: 100%;
}

.cart-item-card {
  background-color: white;
  border-radius: 4px;        
  padding: 1.5rem 2rem;      
  margin-bottom: 1.5rem;     
  box-shadow: 0 4px 15px rgba(0,0,0,0.05); 
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: 1px solid #f0f0f0; 
}

.item-left {
  display: flex;
  align-items: center;
  gap: 20px;
  flex: 1;
}

.item-right {
  display: flex;
  align-items: center;
  gap: 40px; 
}

.img-wrapper {
  width: 70px;
  height: 70px;
  background-color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px; 
  border: 1px solid #eee;
}

.img-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.details h3 {
  font-size: 1.1rem;
  margin: 0 0 5px 0;
  color: #333;
  font-weight: 700;
}

.cat-text {
  font-size: 0.9rem;
  color: #888;
}

.qty-control {
  display: flex;
  align-items: center;
  background-color: #f9f9f9; 
  border-radius: 4px; 
  padding: 5px;
}

.qty-control button {
  background: none;
  border: none;
  font-size: 1.2rem;
  color: #555;
  cursor: pointer;
  padding: 0 12px;
  font-weight: bold;
}

.qty-control input {
  width: 30px;
  text-align: center;
  border: none;
  background: transparent;
  padding: 0;
  color: #333;
  font-weight: 600;
}

.price {
  font-weight: 700;
  color: #333;
  font-size: 1.2rem;
  min-width: 90px;
  text-align: right;
}

.remove-btn {
  background: none;
  border: none;
  color: #aaa;
  cursor: pointer;
  font-size: 1.2rem;
  transition: color 0.2s;
}

.remove-btn:hover {
  color: #ff4d4d;
}

.empty-cart {
  padding: 4rem 0;
  text-align: center;
  color: #888;
  font-size: 1.3rem;
}

.cart-footer {
  display: flex;
  flex-direction: column; 
  align-items: flex-end;
  margin-top: 2rem;
  padding-top: 1rem;
  border-top: 1px solid #eee; 
}

.total-row-display {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 300px;
  margin-bottom: 1rem;
}

.total-label {
  font-size: 1.2rem;
  color: #555;
  font-weight: 600;
  text-align: left;
}

.total-amount {
  font-size: 1.5rem;
  font-weight: 800;
  color: #333;
  text-align: right;
}

.checkout-btn {
  padding: 14px 40px;
  background-color: #2d3446;
  color: white;
  border: none;
  border-radius: 6px; 
  font-weight: 700;
  letter-spacing: 1px;
  cursor: pointer;
  transition: all 0.2s ease; 
  font-size: 1rem;
  box-shadow: 0 4px 10px rgba(45, 52, 70, 0.3);
}

.checkout-btn:hover {
  background-color: #FDBF50; 
  color: #333; 
}

@media (max-width: 768px) {
  .cart-item-card {
    flex-direction: column;
    align-items: flex-start;
    padding: 1.5rem;
  }
  .item-right {
    width: 100%;
    justify-content: space-between;
    margin-top: 1.5rem;
  }
  .cart-footer {
    align-items: center;
  }
  .total-row-display {
    width: 100%; 
  }
}
</style>