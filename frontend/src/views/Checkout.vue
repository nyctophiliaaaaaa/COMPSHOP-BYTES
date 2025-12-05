<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import HeaderBar from '@/components/HeaderBar.vue'
import toast from '@/utils/toast.js'

const router = useRouter()

// 🟢 REAL CART LOGIC
const cartItems = ref([])

onMounted(() => {
  const userId = localStorage.getItem('userId')
  const username = localStorage.getItem('username')
  const cartKey = userId ? `cart_${userId}` : 'myCart'

  // Set the username automatically
  if (username) {
    form.value.name = username
  }

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
    toast.warning('Please fill in your name and station number.')
    return
  }

  // 2. Empty Cart Check
  if (cartItems.value.length === 0) {
    toast.warning('Your cart is empty.')
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
  } else if (form.value.paymentMethod === 'qrph') {
    // QRPH (GCash/Maya) -> route to the QR codes view where user can scan/confirm
    router.push({ 
      path: '/qr-codes', 
      query: { method: 'qrph', total: total.value } 
    })
  } else {
    // Fallback: go to processing (preserves previous behavior for other methods)
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
      <HeaderBar />

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
            <input v-model="form.name" type="text" readonly class="readonly-input" />
          </div>

          <div class="form-group">
            <label>Station Number</label>
            <input v-model="form.stationNumber" type="text" />
          </div>

          <div class="form-group">
            <label>Payment Method</label>
            
            <div class="payment-options">
              <!-- COD -->
              <label class="payment-box" :class="{ selected: form.paymentMethod === 'cod' }">
                <input type="radio" value="cod" v-model="form.paymentMethod" />
                <span class="payment-label">Cash On Delivery</span>
              </label>
              
              <!-- QRPH (combined GCash/Maya) -->
              <label class="payment-box" :class="{ selected: form.paymentMethod === 'qrph' }">
                <input type="radio" value="qrph" v-model="form.paymentMethod" />
                <span class="payment-label">QRPH (GCash / Maya)</span>
              </label>
            </div>
          </div>

          <div class="form-group">
            <label>Notes (Optional)</label>
            <textarea v-model="form.notes" rows="3" placeholder="Any special requests?" class="notes-textarea"></textarea>
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
/* Responsive Checkout Page */
.checkout-container {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding-bottom: clamp(80px, 12vw, 120px);
  font-size: clamp(14px, 1vw + 10px, 16px);
}

/* header styles are provided by the shared HeaderBar component */

/* SMALL TOP BACK BUTTON STYLE */
.back-btn-wrapper {
  display: flex;
  justify-content: flex-start; 
  padding-top: clamp(1rem, 2vw, 1.8rem);
  max-width: clamp(900px, 80vw, 1200px); 
  margin: 0 auto; 
  padding-left: clamp(1rem, 2.5vw, 2.5rem); 
}

.top-back-btn {
  background: none;
  border: none;
  color: #555;
  font-weight: 600;
  font-size: clamp(0.8rem, 1vw, 0.95rem);
  cursor: pointer;
  display: flex;
  align-items: center;
  padding: 0;
}

.top-back-btn:hover {
  color: #2d3446;
  text-decoration: underline;
}

.content-wrapper { 
  max-width: clamp(900px, 80vw, 1200px); 
  margin: 0 auto; 
  padding: clamp(1.2rem, 2.5vw, 2.5rem); 
}

.page-title { 
  margin-bottom: clamp(1rem, 2vw, 1.8rem); 
  color: #333;
  font-size: clamp(1.3rem, 2vw, 1.8rem);
}

.grid-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: clamp(1.2rem, 2.5vw, 2.5rem);
}

@media (max-width: 768px) {
  .grid-layout { grid-template-columns: 1fr; }
}

.section { 
  background: white; 
  padding: clamp(1.2rem, 2.5vw, 2.5rem); 
  border-radius: clamp(6px, 0.8vw, 10px); 
  box-shadow: 0 2px 10px rgba(0,0,0,0.03); 
}

h3 { 
  margin-bottom: clamp(1rem, 2vw, 1.8rem); 
  color: #444;
  font-size: clamp(1rem, 1.3vw, 1.2rem);
}

/* Table */
.table-header { 
  display: grid; 
  grid-template-columns: 2fr 1fr 1fr 1fr; 
  font-size: clamp(0.7rem, 0.9vw, 0.85rem); 
  color: #888; 
  margin-bottom: clamp(0.6rem, 1.2vw, 1.1rem); 
  border-bottom: 1px solid #eee; 
  padding-bottom: clamp(0.3rem, 0.6vw, 0.5rem); 
}

.item-row { 
  display: grid; 
  grid-template-columns: 2fr 1fr 1fr 1fr; 
  align-items: center; 
  padding: clamp(0.6rem, 1.2vw, 1.1rem) 0; 
  border-bottom: 1px solid #f9f9f9; 
}

.item-info { 
  display: flex; 
  align-items: center; 
  gap: clamp(6px, 1vw, 12px); 
  font-weight: 500;
  font-size: clamp(0.8rem, 1vw, 0.95rem);
}

.item-img { 
  font-size: clamp(1.2rem, 1.6vw, 1.6rem); 
  background: #eee; 
  padding: clamp(3px, 0.5vw, 6px); 
  border-radius: 4px; 
  display: flex; 
  align-items: center; 
  justify-content: center; 
  width: clamp(35px, 4.5vw, 55px); 
  height: clamp(35px, 4.5vw, 55px); 
}

.centered { 
  text-align: center; 
  color: #555;
  font-size: clamp(0.8rem, 1vw, 0.95rem);
}

.totals { 
  margin-top: clamp(1rem, 2vw, 1.8rem); 
  text-align: right; 
}

.total-row { 
  display: flex; 
  justify-content: space-between; 
  margin-bottom: clamp(0.3rem, 0.6vw, 0.5rem); 
  color: #666; 
  font-size: clamp(0.8rem, 1vw, 0.95rem); 
}

.grand-total { 
  font-weight: 700; 
  font-size: clamp(0.95rem, 1.2vw, 1.15rem); 
  color: #2d3446; 
  margin-top: clamp(0.6rem, 1.2vw, 1.1rem); 
  border-top: 1px solid #eee; 
  padding-top: clamp(0.6rem, 1.2vw, 1.1rem); 
  background: linear-gradient(90deg, transparent 0%, rgba(255, 184, 77, 0.15) 50%, transparent 100%);
  padding: clamp(0.6rem, 1vw, 0.9rem);
  border-radius: clamp(4px, 0.5vw, 6px);
}

/* Form */
.form-group { margin-bottom: clamp(1rem, 2vw, 1.8rem); }

label { 
  display: block; 
  margin-bottom: clamp(0.3rem, 0.6vw, 0.5rem); 
  font-size: clamp(0.8rem, 1vw, 0.95rem); 
  color: #666; 
}

input, textarea { 
  width: 100%; 
  padding: clamp(0.5rem, 1vw, 0.9rem); 
  border: 1px solid #ddd; 
  border-radius: clamp(4px, 0.6vw, 8px); 
  font-size: clamp(0.85rem, 1vw, 1rem); 
  outline: none; 
}

input:focus, textarea:focus { border-color: #ffb84d; }

/* Readonly input styling */
.readonly-input {
  background-color: #f0f0f0;
  color: #555;
  cursor: not-allowed;
}

.readonly-input:focus {
  border-color: #ddd;
}

/* Notes textarea - scrollable but not resizable */
.notes-textarea {
  resize: none;
  overflow-y: auto;
  max-height: 120px;
}

/* Payment Box Styles */
.payment-options {
  display: flex;
  flex-direction: column;
  gap: clamp(0.5rem, 1vw, 0.75rem);
}

.payment-box {
  display: flex;
  align-items: center;
  gap: clamp(10px, 1.2vw, 14px);
  padding: clamp(0.75rem, 1.2vw, 1rem) clamp(1rem, 1.5vw, 1.25rem);
  border: 2px solid #e0e0e0;
  border-radius: clamp(6px, 0.8vw, 10px);
  cursor: pointer;
  transition: all 0.2s ease;
  background-color: #fff;
}

.payment-box:hover {
  border-color: #ccc;
  background-color: #fafafa;
}

.payment-box.selected {
  border-color: #ffb84d;
  background-color: rgba(255, 184, 77, 0.08);
}

.payment-box input[type="radio"] {
  width: auto;
  margin: 0;
  transform: scale(1.2);
  cursor: pointer;
  accent-color: #ffb84d;
}

.payment-label {
  font-size: clamp(0.85rem, 1vw, 0.95rem);
  font-weight: 500;
  color: #333;
}

/* QR Styles */
.qr-box {
    background-color: #e0e0e0;
    padding: clamp(0.6rem, 1.2vw, 1.1rem);
    border-radius: clamp(6px, 0.8vw, 10px);
    display: flex;
    align-items: center;
    gap: clamp(10px, 1.5vw, 18px);
    margin-top: clamp(3px, 0.5vw, 6px);
    margin-bottom: clamp(10px, 1.5vw, 18px);
    margin-left: clamp(18px, 2.5vw, 28px); 
}

.qr-placeholder { 
  font-size: clamp(1.8rem, 2.8vw, 2.8rem); 
  line-height: 1; 
}

.qr-text { 
  font-size: clamp(0.75rem, 0.95vw, 0.9rem); 
  color: #333; 
}

/* Sticky Footer */
.bottom-bar {
    position: fixed;
    bottom: 0; 
    left: 0; 
    width: 100%;
    background: #d8d8d8;
    padding: clamp(1rem, 2vw, 1.8rem) clamp(1.2rem, 2.5vw, 2.5rem);
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: clamp(1rem, 2.5vw, 2.5rem);
    box-shadow: 0 -2px 10px rgba(0,0,0,0.1);
}

.bar-total { 
  font-size: clamp(0.9rem, 1.2vw, 1.15rem); 
  color: #333; 
}

.place-order-btn {
    background-color: #ffb84d;
    color: #333;
    border: none;
    padding: clamp(0.5rem, 1vw, 0.9rem) clamp(1.2rem, 2.5vw, 2.5rem);
    font-weight: 700;
    border-radius: 25px;
    cursor: pointer;
    font-size: clamp(0.85rem, 1.1vw, 1.05rem);
    transition: background 0.2s;
}

.place-order-btn:hover { background-color: #ffa31a; }

/* Responsive breakpoints */
@media (max-width: 768px) {
  .table-header,
  .item-row {
    grid-template-columns: 2fr 1fr 0.5fr 1fr;
  }
  
  .item-img {
    width: 30px;
    height: 30px;
  }
}

@media (max-width: 480px) {
  .table-header {
    display: none;
  }
  
  .item-row {
    grid-template-columns: 1fr;
    gap: 0.5rem;
    text-align: left;
  }
  
  .centered {
    text-align: left;
  }
  
  .bottom-bar {
    flex-direction: column;
    gap: 0.8rem;
    padding: 1rem;
  }
}
</style>