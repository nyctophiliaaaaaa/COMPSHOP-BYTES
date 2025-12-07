<script setup>
import { ref, computed, onMounted } from 'vue' 
import { useRouter, useRoute } from 'vue-router'
import toast from '@/utils/toast.js'

import gcashImg from '@/assets/gcash.png'
import mayaImg from '@/assets/maya.png'
import HeaderBar from '@/components/HeaderBar.vue'
const stationName = ref('Station --'); 

const router = useRouter()
const route = useRoute()

const totalAmount = computed(() => {
  const total = parseFloat(route.query.total)
  return isNaN(total) ? 0.00 : total
})

const referenceNumber = ref('')


const gcashAccount = {
  name: 'C******p B***s',
  number: '0917-XXX-XXXX'
}

const mayaAccount = {
  name: 'C******p B***s',
  number: '0918-XXX-XXXX'
}

const gcashQrSrc = computed(() => route.query.gcash || gcashImg)
const mayaQrSrc = computed(() => route.query.maya || mayaImg)

onMounted(() => {
  const randomStation = Math.floor(Math.random() * 50) + 1;
  stationName.value = `Station ${randomStation}`;
})


const handlePaymentSent = () => {
  const ref = referenceNumber.value.trim()

  if (ref.length !== 12) {
    toast.warning('The Transaction Reference Number must be exactly 12 characters long.')
    return
  }

  router.push({ 
    path: '/payment-success', 
    query: { 
      method: 'cashless', 
      total: totalAmount.value,
      ref: ref 
    } 
  })
}

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

.qr-container {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding-bottom: clamp(80px, 12vw, 120px);
  font-size: clamp(14px, 1vw + 10px, 16px);
}

.back-btn-wrapper {
  display: flex;
  justify-content: flex-start; 
  padding-top: clamp(1rem, 2vw, 1.8rem);
  max-width: clamp(800px, 75vw, 1050px); 
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
  max-width: clamp(800px, 75vw, 1050px); 
  margin: 0 auto; 
  padding: clamp(1.2rem, 2.5vw, 2.5rem); 
}

.page-title { 
  margin-bottom: clamp(0.6rem, 1.2vw, 1.1rem); 
  color: #333; 
  text-align: center;
  font-size: clamp(1.3rem, 2vw, 1.8rem);
}

.instruction-text {
  text-align: center;
  color: #555;
  margin-bottom: clamp(1.2rem, 2.5vw, 2.2rem);
  font-size: clamp(0.85rem, 1.1vw, 1.05rem);
}

.qr-grid {
  display: flex;
  justify-content: center;
  gap: clamp(1.5rem, 3.5vw, 3.5rem);
  margin-bottom: clamp(1.8rem, 4vw, 3.5rem);
}

@media (max-width: 768px) {
  .qr-grid { 
    flex-direction: column; 
    align-items: center; 
    gap: clamp(1.2rem, 2.5vw, 2.2rem);
  }
}

.qr-card {
  background: white;
  padding: clamp(1.2rem, 2.5vw, 2.5rem);
  border-radius: clamp(6px, 0.8vw, 10px);
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
  width: 100%;
  max-width: clamp(260px, 30vw, 370px);
  text-align: center;
}

.gcash-card { border-top: 5px solid #00A950; }
.maya-card { border-top: 5px solid #20A69A; }

.qr-title {
  margin-top: 0;
  color: #444;
  font-size: clamp(1.1rem, 1.6vw, 1.55rem);
  margin-bottom: clamp(1rem, 2vw, 1.8rem);
}

.qr-placeholder-box {
  background: #eee;
  border: 1px dashed #ccc;
  width: clamp(140px, 18vw, 220px);
  height: clamp(140px, 18vw, 220px);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto clamp(1rem, 2vw, 1.8rem);
  border-radius: 6px;
}

.qr-image {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.account-details p {
  margin: clamp(0.3rem, 0.6vw, 0.5rem) 0;
  font-size: clamp(0.8rem, 1vw, 1rem);
  color: #666;
}

.confirmation-section {
  max-width: clamp(420px, 50vw, 620px);
  margin: 0 auto;
  padding: clamp(1.2rem, 2.5vw, 2.5rem);
  background: white;
  border-radius: clamp(6px, 0.8vw, 10px);
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
}

.confirmation-section h3 {
    text-align: center;
    color: #2d3446;
    margin-bottom: clamp(1rem, 2vw, 1.8rem);
    font-size: clamp(1rem, 1.3vw, 1.2rem);
}

.form-group { margin-bottom: clamp(0.6rem, 1.2vw, 1.1rem); }

label { 
  display: block; 
  margin-bottom: clamp(0.3rem, 0.6vw, 0.5rem); 
  font-size: clamp(0.8rem, 1vw, 0.95rem); 
  color: #666; 
}

.ref-input { 
  width: 100%; 
  padding: clamp(0.5rem, 1vw, 0.9rem); 
  border: 1px solid #ddd; 
  border-radius: clamp(4px, 0.6vw, 8px); 
  font-size: clamp(0.85rem, 1.1vw, 1.05rem); 
  outline: none; 
}

.ref-input:focus { border-color: #ffb84d; }

.ref-note {
    font-size: clamp(0.7rem, 0.85vw, 0.85rem);
    color: #b73225;
    margin-top: clamp(0.3rem, 0.6vw, 0.5rem);
    text-align: center;
}

.bottom-bar {
  position: fixed;
  bottom: 0; 
  left: 0; 
  width: 100%;
  background: #2d3446;
  padding: clamp(1rem, 2vw, 1.8rem) clamp(1.2rem, 2.5vw, 2.5rem);
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 -2px 10px rgba(0,0,0,0.2);
}

.bar-total { 
  font-size: clamp(0.95rem, 1.3vw, 1.25rem); 
  color: white; 
}

.confirm-btn {
  background-color: #00A950;
  color: white;
  border: none;
  padding: clamp(0.5rem, 1vw, 0.9rem) clamp(1.2rem, 2.5vw, 2.5rem);
  font-weight: 700;
  border-radius: 25px;
  cursor: pointer;
  font-size: clamp(0.85rem, 1.1vw, 1.05rem);
  transition: background 0.2s;
}

.confirm-btn:hover:not(:disabled) { 
  background-color: #008f44; 
}

.confirm-btn:disabled {
  background-color: #999;
  cursor: not-allowed;
}

@media (max-width: 480px) {
  .bottom-bar {
    flex-direction: column;
    gap: 0.8rem;
    padding: 1rem;
  }
}
</style>