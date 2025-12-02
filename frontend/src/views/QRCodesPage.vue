<script setup>
import { ref, computed, onMounted } from 'vue' // 🟢 ADDED: onMounted for stationName
import { useRouter, useRoute } from 'vue-router'

// 🟢 NEW: Import logo and setup stationName for the header
// appLogo not needed here; HeaderBar renders the logo
import gcashImg from '@/assets/gcash.png'
import mayaImg from '@/assets/maya.png'
import HeaderBar from '@/components/HeaderBar.vue'
const stationName = ref('Station --'); 

const router = useRouter()
const route = useRoute()

// HeaderBar component provides order-status, cart and logout

// 1. Get the total amount from the route query
// Use a default value of 0 if the query is missing or invalid
const totalAmount = computed(() => {
  const total = parseFloat(route.query.total)
  return isNaN(total) ? 0.00 : total
})

// 2. State for the user-entered reference number
const referenceNumber = ref('')

// 3. Simulated account details for the QR codes
const gcashAccount = {
  name: 'Juan De** **uz',
  number: '0917-XXX-XXXX'
}

const mayaAccount = {
  name: 'Maria *****s',
  number: '0918-XXX-XXXX'
}

// Image sources: allow override via query params (e.g. ?gcash=/path/to.png&maya=/path/to.png)
const gcashQrSrc = computed(() => route.query.gcash || gcashImg)
const mayaQrSrc = computed(() => route.query.maya || mayaImg)

// 🟢 NEW: Set up the station name on mount for the header
onMounted(() => {
  const randomStation = Math.floor(Math.random() * 50) + 1;
  stationName.value = `Station ${randomStation}`;
})


// 4. Handle "Payment Sent" button click
const handlePaymentSent = () => {
  const ref = referenceNumber.value.trim()

  // 🟢 CHANGE: Validation for exactly 12 characters (alphanumeric or any character)
  if (ref.length !== 12) {
    alert('The Transaction Reference Number must be exactly 12 characters long.')
    return
  }

  // For demonstration, we route to a success page
  router.push({ 
    path: '/payment-success', 
    query: { 
      method: 'cashless', 
      total: totalAmount.value,
      ref: ref 
    } 
  })
}

// 5. Navigation
const goBackToCheckout = () => {
  router.push('/checkout') 
}
</script>

<template>
  <div class="qr-container">
    
    <HeaderBar />

    <div class="back-btn-wrapper">
      <button @click="goBackToCheckout" class="top-back-btn">
        ← Back to Checkout
      </button>
    </div>

    <div class="content-wrapper">
      <h2 class="page-title">Scan QR to Pay</h2>
      
      <p class="instruction-text">
        Please scan the <strong>GCash</strong> or <strong>Maya</strong> QR code below to transfer <strong>₱ {{ totalAmount.toFixed(2) }}</strong>.
        Once the transfer is complete, enter the <strong>reference number</strong> below to confirm your order.
      </p>

      <div class="qr-grid">
        <div class="qr-card gcash-card">
          <h3 class="qr-title">GCash</h3>
          <div class="qr-placeholder-box">
            <img :src="gcashQrSrc" alt="GCash QR" class="qr-image" />
          </div>
          <div class="account-details">
            <p>Recipient: <strong>{{ gcashAccount.name }}</strong></p>
            <p>Account No.: <strong>{{ gcashAccount.number }}</strong></p>
          </div>
        </div>

        <div class="qr-card maya-card">
          <h3 class="qr-title">Maya</h3>
          <div class="qr-placeholder-box">
            <img :src="mayaQrSrc" alt="Maya QR" class="qr-image" />
          </div>
          <div class="account-details">
            <p>Recipient: <strong>{{ mayaAccount.name }}</strong></p>
            <p>Account No.: <strong>{{ mayaAccount.number }}</strong></p>
          </div>
        </div>
      </div>

      <div class="confirmation-section">
        <h3>Confirm Transaction</h3>
        <div class="form-group">
          <label for="ref-number">Transaction Reference Number</label>
          <input 
            id="ref-number" 
            v-model="referenceNumber" 
            type="text" 
            placeholder="Enter the 12-character reference number" 
            class="ref-input"
            maxlength="12"
            minlength="12"
            />
          <p class="ref-note">This is a required field to verify your payment. Must be **12 characters**.</p>
        </div>
      </div>
    </div>

    <div class="bottom-bar">
      <div class="bar-total">Total Payment: <strong>₱ {{ totalAmount.toFixed(2) }}</strong></div>
      <button class="confirm-btn" @click="handlePaymentSent" :disabled="!referenceNumber.trim()">
        CONFIRM PAYMENT
      </button>
    </div>
  </div>
</template>

<style scoped>
/* Header styles (match MenuPage) */
/* header styles are provided by the shared HeaderBar component */

/* 🔴 Removed original .header, .brand, and .nav-right styles */


/* 🔴 CHANGE: Removed numeric-specific CSS rules (not needed for type="text") */

.qr-container {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding-bottom: 100px;
}
/* .header { ... } - REMOVED */

/* Back Button */
.back-btn-wrapper {
  display: flex;
  justify-content: flex-start; 
  padding-top: 1.5rem;
  max-width: 1000px; 
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

.content-wrapper { 
  max-width: 1000px; 
  margin: 0 auto; 
  padding: 2rem; 
}
.page-title { 
  margin-bottom: 1rem; 
  color: #333; 
  text-align: center;
}
.instruction-text {
  text-align: center;
  color: #555;
  margin-bottom: 2rem;
  font-size: 1rem;
}

/* QR Grid Layout */
.qr-grid {
  display: flex;
  justify-content: center;
  gap: 3rem;
  margin-bottom: 3rem;
}
@media (max-width: 768px) {
  .qr-grid { 
    flex-direction: column; 
    align-items: center; 
    gap: 2rem;
  }
}

.qr-card {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
  width: 100%;
  max-width: 350px;
  text-align: center;
}
.gcash-card { border-top: 5px solid #00A950; } /* GCash color */
.maya-card { border-top: 5px solid #20A69A; } /* Maya color */

.qr-title {
  margin-top: 0;
  color: #444;
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
}

.qr-placeholder-box {
  background: #eee;
  border: 1px dashed #ccc;
  width: 200px;
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
  border-radius: 6px;
}

.qr-image {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.account-details p {
  margin: 0.5rem 0;
  font-size: 0.95rem;
  color: #666;
}

/* Confirmation Section (Reference Number Input) */
.confirmation-section {
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
}
.confirmation-section h3 {
    text-align: center;
    color: #2d3446;
    margin-bottom: 1.5rem;
}
.form-group { margin-bottom: 1rem; }
label { display: block; margin-bottom: 0.5rem; font-size: 0.9rem; color: #666; }
.ref-input { 
  width: 100%; 
  padding: 0.8rem; 
  border: 1px solid #ddd; 
  border-radius: 6px; 
  font-size: 1rem; 
  outline: none; 
}
.ref-input:focus { border-color: #ffb84d; }
.ref-note {
    font-size: 0.8rem;
    color: #b73225;
    margin-top: 0.5rem;
    text-align: center;
}

/* Sticky Footer */
.bottom-bar {
  position: fixed;
  bottom: 0; left: 0; width: 100%;
  background: #2d3446; /* Dark background for bottom bar */
  padding: 1.5rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 -2px 10px rgba(0,0,0,0.2);
}
.bar-total { 
  font-size: 1.2rem; 
  color: white; 
}
.confirm-btn {
  background-color: #00A950; /* GCash/Success inspired color */
  color: white;
  border: none;
  padding: 0.8rem 2rem;
  font-weight: 700;
  border-radius: 25px;
  cursor: pointer;
  font-size: 1rem;
  transition: background 0.2s;
}
.confirm-btn:hover:not(:disabled) { background-color: #008f44; }
.confirm-btn:disabled {
  background-color: #999;
  cursor: not-allowed;
}
</style>