<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';

import HeaderBar from '@/components/HeaderBar.vue'

const router = useRouter();

const cartItems = ref([]);
const stationName = ref('Guest'); 

onMounted(() => {
  const userId = localStorage.getItem('userId');
  const cartKey = userId ? `cart_${userId}` : 'myCart';

  const storedCart = localStorage.getItem(cartKey);
  if (storedCart) {
    cartItems.value = JSON.parse(storedCart);
  }

  // Get the username from localStorage (saved during login)
  const currentUser = localStorage.getItem('username');
  
  if (currentUser) {
    stationName.value = `Hi, ${currentUser}`;
  } else {
    stationName.value = 'Guest';
  }
});

const totalItems = computed(() => {
  return cartItems.value.reduce((acc, item) => acc + item.quantity, 0);
});

const subtotal = computed(() => {
  return cartItems.value.reduce((acc, item) => acc + (item.price * item.quantity), 0);
});

const saveCart = () => {
  const userId = localStorage.getItem('userId');
  const cartKey = userId ? `cart_${userId}` : 'myCart';
  localStorage.setItem(cartKey, JSON.stringify(cartItems.value));
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
    
    <HeaderBar />

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
/* Responsive Cart Page */
.cart-container {
  min-height: 100vh;
  background-color: #f0f2f5;
  font-family: var(--font-primary);
  font-size: var(--text-base);
}

/* header styles provided by HeaderBar component */

.main-content {
  padding: clamp(1rem, 2.5vw, 2.5rem);
  display: flex;
  justify-content: center;
}

.cart-wrapper {
  width: 100%;
  max-width: clamp(600px, 70vw, 950px); 
}

.top-nav-row {
  margin-bottom: clamp(1rem, 2vw, 1.8rem);
}

.back-link {
  color: var(--color-text-primary);
  text-decoration: none;
  font-weight: var(--weight-bold); 
  font-size: var(--text-sm);
  letter-spacing: var(--tracking-wide);
  display: inline-flex;
  align-items: center;
  gap: clamp(5px, 0.8vw, 10px);
  padding: clamp(8px, 1vw, 12px) clamp(14px, 2vw, 22px); 
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
  font-size: var(--text-md);
  font-weight: var(--weight-bold);
}

.main-cart-card {
  background-color: white;
  border-radius: clamp(4px, 0.5vw, 6px); 
  box-shadow: 0 4px 20px rgba(0,0,0,0.05);
  padding: clamp(1.5rem, 3vw, 3rem);
  min-height: clamp(350px, 45vw, 520px);
}

.cart-header-row {
  display: flex;
  justify-content: space-between; 
  align-items: center;
  margin-bottom: clamp(0.6rem, 1.2vw, 1.1rem);
  width: 100%; 
}

.cart-header-row h2 {
  font-size: var(--text-2xl);
  color: var(--color-text-primary);
  margin: 0;
  font-weight: var(--weight-bold);
}

.header-right {
  display: flex;
  justify-content: flex-end; 
  flex: 1; 
}

.item-count-label {
  font-size: var(--text-lg); 
  font-weight: var(--weight-bold);  
  color: var(--color-text-primary);
}

.divider {
  height: 1px;
  background-color: #eee;
  margin-bottom: clamp(1.2rem, 2.5vw, 2.2rem);
  width: 100%;
}

.cart-item-card {
  background-color: white;
  border-radius: clamp(4px, 0.5vw, 6px);        
  padding: clamp(1rem, 2vw, 1.8rem) clamp(1.2rem, 2.5vw, 2.2rem);      
  margin-bottom: clamp(1rem, 2vw, 1.6rem);     
  box-shadow: 0 4px 15px rgba(0,0,0,0.05); 
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: 1px solid #f0f0f0; 
}

.item-left {
  display: flex;
  align-items: center;
  gap: clamp(12px, 2vw, 22px);
  flex: 1;
}

.item-right {
  display: flex;
  align-items: center;
  gap: clamp(20px, 4vw, 45px); 
}

.img-wrapper {
  width: clamp(50px, 6vw, 80px);
  height: clamp(50px, 6vw, 80px);
  background-color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: clamp(4px, 0.5vw, 6px); 
  border: 1px solid #eee;
}

.img-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.details h3 {
  font-size: var(--text-md);
  margin: 0 0 clamp(3px, 0.5vw, 6px) 0;
  color: var(--color-text-primary);
  font-weight: var(--weight-bold);
}

.cat-text {
  font-size: var(--text-sm);
  color: var(--color-text-muted);
}

.qty-control {
  display: flex;
  align-items: center;
  background-color: #f9f9f9; 
  border-radius: clamp(4px, 0.5vw, 6px); 
  padding: clamp(3px, 0.5vw, 6px);
}

.qty-control button {
  background: none;
  border: none;
  font-size: clamp(1rem, 1.3vw, 1.3rem);
  color: #555;
  cursor: pointer;
  padding: 0 clamp(8px, 1.2vw, 14px);
  font-weight: bold;
}

.qty-control input {
  width: clamp(24px, 3vw, 35px);
  text-align: center;
  border: none;
  background: transparent;
  padding: 0;
  color: var(--color-text-primary);
  font-weight: var(--weight-semibold);
  font-size: var(--text-base);
  font-family: var(--font-primary);
}

.price {
  font-weight: var(--weight-bold);
  color: var(--color-text-primary);
  font-size: var(--text-lg);
  min-width: clamp(65px, 8vw, 100px);
  text-align: right;
}

.remove-btn {
  background: none;
  border: none;
  color: #aaa;
  cursor: pointer;
  font-size: clamp(1rem, 1.3vw, 1.25rem);
  transition: color 0.2s;
}

.remove-btn:hover {
  color: #ff4d4d;
}

.empty-cart {
  padding: clamp(2.5rem, 5vw, 4.5rem) 0;
  text-align: center;
  color: #888;
  font-size: clamp(1rem, 1.5vw, 1.35rem);
}

.cart-footer {
  display: flex;
  flex-direction: column; 
  align-items: flex-end;
  margin-top: clamp(1.2rem, 2.5vw, 2.2rem);
  padding-top: clamp(0.6rem, 1.2vw, 1.1rem);
  border-top: 1px solid #eee; 
}

.total-row-display {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: clamp(220px, 28vw, 320px);
  margin-bottom: clamp(0.6rem, 1.2vw, 1.1rem);
}

.total-label {
  font-size: var(--text-lg);
  color: var(--color-text-secondary);
  font-weight: var(--weight-semibold);
  text-align: left;
}

.total-amount {
  font-size: var(--text-xl);
  font-weight: var(--weight-bold);
  color: var(--color-text-primary);
  text-align: right;
}

.checkout-btn {
  padding: clamp(10px, 1.5vw, 16px) clamp(28px, 4vw, 45px);
  background-color: #2d3446;
  color: var(--color-text-inverse);
  border: none;
  border-radius: clamp(4px, 0.6vw, 8px); 
  font-weight: var(--weight-bold);
  font-family: var(--font-primary);
  letter-spacing: var(--tracking-wide);
  cursor: pointer;
  transition: all 0.2s ease; 
  font-size: var(--text-base);
  box-shadow: 0 4px 10px rgba(45, 52, 70, 0.3);
}

.checkout-btn:hover {
  background-color: #FDBF50; 
  color: #333; 
}

/* Responsive breakpoints */
@media (max-width: 768px) {
  .cart-item-card {
    flex-direction: column;
    align-items: flex-start;
    padding: clamp(1rem, 2vw, 1.5rem);
  }
  .item-right {
    width: 100%;
    justify-content: space-between;
    margin-top: clamp(1rem, 2vw, 1.5rem);
  }
  .cart-footer {
    align-items: center;
  }
  .total-row-display {
    width: 100%; 
  }
}

@media (max-width: 480px) {
  .main-content {
    padding: 1rem;
  }
  
  .main-cart-card {
    padding: 1.2rem;
  }
  
  .item-right {
    gap: 15px;
  }
  
  .price {
    min-width: 50px;
  }
}
</style>