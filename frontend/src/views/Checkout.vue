<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 🟢 REAL CART LOGIC
const cartItems = ref([])

onMounted(() => {
  const userId = localStorage.getItem('userId')
  const cartKey = userId ? `cart_${userId}` : 'myCart'

  const storedCart = localStorage.getItem(cartKey)
  if (storedCart) {
    cartItems.value = JSON.parse(storedCart)
  }
})

const serviceFee = 10.00
const tax = 12.00

const form = ref({
  name: '',
  stationNumber: 'A12',
  paymentMethod: 'cod', // Default selection
  notes: ''
})

// Calculate Subtotal (Uses item.quantity from your CartPage)
const subtotal = computed(() => {
  return cartItems.value.reduce((acc, item) => acc + (item.price * item.quantity), 0)
})

// Calculate Grand Total
const total = computed(() => subtotal.value + serviceFee + tax)

const handlePlaceOrder = () => {
  // 1. Validation
  if (!form.value.name || !form.value.stationNumber) {
    alert('Please fill in your name and station number.')
    return
  }

  // 2. Empty Cart Check
  if (cartItems.value.length === 0) {
    alert('Your cart is empty.')
    router.push('/cart')
    return
  }

  // 3. Routing Logic (Pass 'total' to next page)
  if (form.value.paymentMethod === 'cod') {
    // COD -> Skip processing, go straight to Success
    router.push({ 
      path: '/payment-success', 
      query: { method: 'cod', total: total.value } 
    })
  } else {
    // GCash/Maya -> Go to Processing first
    router.push({ 
      name: 'payment-processing', 
      query: { method: form.value.paymentMethod, total: total.value } 
    })
  }
}

const goBackToCart = () => {
  router.push('/cart') 
}
</script>

<template>
  <div class="checkout-container">
    <div class="navbar">
        <div class="brand">🥡 CompShop Bytes</div>
        <div class="nav-right">Station {{ form.stationNumber || '...' }} 🛒 👤</div>
    </div>

    <!-- MOVED BACK BUTTON HERE (Small & Upper Left) -->
    <div class="back-btn-wrapper">
      <button @click="goBackToCart" class="top-back-btn">
        ← Back to Cart / Edit
      </button>
    </div>

    <div class="content-wrapper">
      <h2 class="page-title">Checkout</h2>

      <div class="grid-layout">
        
        <!-- LEFT COLUMN: Order Summary -->
        <div class="section order-summary">
          <h3>Order Summary</h3>
          
          <div class="table-header">
            <span>ITEM</span>
            <span>UNIT PRICE</span>
            <span>QTY</span>
            <span>ITEM SUBTOTAL</span>
          </div>

          <div class="item-list">
            <!-- Handle Empty Cart Display -->
            <div v-if="cartItems.length === 0" style="padding: 20px; text-align:center; color:#888;">
                No items in cart.
            </div>

            <div v-else v-for="item in cartItems" :key="item.id" class="item-row">
              <div class="item-info">
                <span class="item-img">
                    <img v-if="item.image" :src="item.image" alt="item" style="width:100%; height:100%; object-fit:contain;" />
                    <span v-else>🍲</span>
                </span>
                <span>{{ item.name }}</span>
              </div>
              <div class="centered">₱ {{ item.price.toFixed(2) }}</div>
              <div class="centered">{{ item.quantity }}</div>
              <div class="centered">₱ {{ (item.price * item.quantity).toFixed(2) }}</div>
            </div>
          </div>

          <div class="totals">
            <div class="total-row"><span>Subtotal:</span> <span>₱ {{ subtotal.toFixed(2) }}</span></div>
            <div class="total-row"><span>Service Fee:</span> <span>₱ {{ serviceFee.toFixed(2) }}</span></div>
            <div class="total-row"><span>Tax:</span> <span>₱ {{ tax.toFixed(2) }}</span></div>
            <div class="total-row grand-total"><span>Total:</span> <span>₱ {{ total.toFixed(2) }}</span></div>
          </div>
        </div>

        <!-- RIGHT COLUMN: Customer Details -->
        <div class="section customer-details">
          <h3>Customer Details</h3>
          
          <div class="form-group">
            <label>Name</label>
            <input v-model="form.name" type="text" placeholder="Enter your name" />
          </div>

          <div class="form-group">
            <label>Station Number</label>
            <input v-model="form.stationNumber" type="text" />
          </div>

          <div class="form-group">
            <label>Payment Method</label>
            
            <!-- COD -->
            <div class="radio-option">
              <input type="radio" id="cod" value="cod" v-model="form.paymentMethod" />
              <label for="cod">Cash On Delivery</label>
            </div>

            <!-- GCASH -->
            <div class="radio-option">
              <input type="radio" id="gcash" value="gcash" v-model="form.paymentMethod" />
              <label for="gcash">GCash (QR)</label>
            </div>
            <!-- GCash QR Popup -->
            <div v-if="form.paymentMethod === 'gcash'" class="qr-box">
               <div class="qr-code">
                 <div class="qr-placeholder">🔳</div> 
               </div>
               <div class="qr-text">
                 <strong>Scan this QR using GCash</strong><br>
                 Open your GCash app → Scan QR → Confirm payment
               </div>
            </div>

            <!-- MAYA -->
            <div class="radio-option">
              <input type="radio" id="maya" value="maya" v-model="form.paymentMethod" />
              <label for="maya">Maya (QR)</label>
            </div>
            <!-- Maya QR Popup -->
            <div v-if="form.paymentMethod === 'maya'" class="qr-box">
               <div class="qr-code">
                 <div class="qr-placeholder">🔳</div>
               </div>
               <div class="qr-text">
                 <strong>Scan this QR using Maya</strong><br>
                 Open your Maya app → Scan QR → Confirm payment
               </div>
            </div>

          </div>

          <div class="form-group">
            <label>Notes (Optional)</label>
            <textarea v-model="form.notes" rows="3" placeholder="Any special requests?"></textarea>
          </div>

        </div>
      </div>
    </div>

    <!-- Sticky Bottom Bar -->
    <div class="bottom-bar">
        <div class="bar-total">Total ({{ cartItems.length }} Items): <strong>₱ {{ total.toFixed(2) }}</strong></div>
        <button class="place-order-btn" @click="handlePlaceOrder">PLACE ORDER</button>
    </div>
  </div>
</template>

<style scoped>
.checkout-container {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding-bottom: 100px;
}
.navbar {
  background: white;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 5px rgba(0,0,0,0.05);
}
.brand { font-weight: 700; font-size: 1.2rem; color: #2d3446; }

/* SMALL TOP BACK BUTTON STYLE */
.back-btn-wrapper {
  display: flex;
  justify-content: flex-start; 
  padding-top: 1.5rem;
  max-width: 1200px; 
  margin: 0 auto; 
  padding-left: 2rem; 
}

.top-back-btn {
  background: none;
  border: none;
  color: #555;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  padding: 0;
}

.top-back-btn:hover {
  color: #2d3446;
  text-decoration: underline;
}

.content-wrapper { max-width: 1200px; margin: 0 auto; padding: 2rem; }
.page-title { margin-bottom: 1.5rem; color: #333; }

.grid-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
}
@media (max-width: 768px) {
  .grid-layout { grid-template-columns: 1fr; }
}

.section { background: white; padding: 2rem; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.03); }
h3 { margin-bottom: 1.5rem; color: #444; }

/* Table */
.table-header { display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; font-size: 0.8rem; color: #888; margin-bottom: 1rem; border-bottom: 1px solid #eee; padding-bottom: 0.5rem; }
.item-row { display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; align-items: center; padding: 1rem 0; border-bottom: 1px solid #f9f9f9; }
.item-info { display: flex; align-items: center; gap: 10px; font-weight: 500; }
.item-img { font-size: 1.5rem; background: #eee; padding: 5px; border-radius: 4px; display: flex; align-items: center; justify-content: center; width: 50px; height: 50px; }
.centered { text-align: center; color: #555; }

.totals { margin-top: 1.5rem; text-align: right; }
.total-row { display: flex; justify-content: space-between; margin-bottom: 0.5rem; color: #666; font-size: 0.9rem; }
.grand-total { font-weight: 700; font-size: 1.1rem; color: #333; margin-top: 1rem; border-top: 1px solid #eee; padding-top: 1rem; }

/* Form */
.form-group { margin-bottom: 1.5rem; }
label { display: block; margin-bottom: 0.5rem; font-size: 0.9rem; color: #666; }
input, textarea { width: 100%; padding: 0.8rem; border: 1px solid #ddd; border-radius: 6px; font-size: 1rem; outline: none; }
input:focus, textarea:focus { border-color: #ffb84d; }

.radio-option { display: flex; align-items: center; gap: 10px; margin-bottom: 0.8rem; cursor: pointer; }
input[type="radio"] { width: auto; transform: scale(1.2); cursor: pointer; accent-color: #2d3446; }

/* QR Styles */
.qr-box {
    background-color: #e0e0e0;
    padding: 1rem;
    border-radius: 8px;
    display: flex;
    align-items: center;
    gap: 15px;
    margin-top: 5px;
    margin-bottom: 15px;
    margin-left: 25px; 
}
.qr-placeholder { font-size: 2.5rem; line-height: 1; }
.qr-text { font-size: 0.85rem; color: #333; }

/* Sticky Footer */
.bottom-bar {
    position: fixed;
    bottom: 0; left: 0; width: 100%;
    background: #d8d8d8;
    padding: 1.5rem 2rem;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 2rem;
    box-shadow: 0 -2px 10px rgba(0,0,0,0.1);
}
.bar-total { font-size: 1.1rem; color: #333; }
.place-order-btn {
    background-color: #ffb84d;
    color: #333;
    border: none;
    padding: 0.8rem 2rem;
    font-weight: 700;
    border-radius: 25px;
    cursor: pointer;
    font-size: 1rem;
    transition: background 0.2s;
}
.place-order-btn:hover { background-color: #ffa31a; }
</style>