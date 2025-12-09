<script setup>
import { ref, computed, onMounted } from 'vue' 
import { useRouter, useRoute } from 'vue-router'
import axios from 'axios' 
import toast from '@/utils/toast.js'
import gcashImg from '@/assets/gcash.png'
import mayaImg from '@/assets/maya.png'
import HeaderBar from '@/components/HeaderBar.vue'

const router = useRouter()
const route = useRoute()
const stationName = ref('Station --'); 
const selectedMethod = ref('GCash'); 
const isLoading = ref(false); 
const referenceNumber = ref('')

const totalAmount = computed(() => parseFloat(route.query.total || 0))
const gcashQrSrc = computed(() => route.query.gcash || gcashImg)
const mayaQrSrc = computed(() => route.query.maya || mayaImg)

const gcashRecipient = {
  name: 'Compshop Bytes',
  accountNo: '0917-XXX-XXXX'
}
const mayaRecipient = {
  name: 'Compshop Bytes',
  accountNo: '0918-XXX-XXXX'
}

const handlePaymentSent = async () => {
  const refNum = referenceNumber.value.trim()
  if (refNum.length !== 12) { toast.warning('Invalid Reference Number'); return; }
  const userId = localStorage.getItem('userId');
  if (!userId) { toast.error("User session invalid."); return; }

  const storedItems = localStorage.getItem('tempOrderItems');
  const stationNum = localStorage.getItem('tempStationNumber'); 
  const orderItems = storedItems ? JSON.parse(storedItems) : [];

  isLoading.value = true;
  try {
    await axios.post('http://localhost:3000/api/orders', {
      user_id: userId,
      total_amount: totalAmount.value,
      payment_method: selectedMethod.value, 
      payment_reference: refNum,
      station_number: stationNum, 
      items: orderItems 
    });
    localStorage.removeItem(`cart_${userId}`);
    localStorage.removeItem('tempOrderItems');
    localStorage.removeItem('tempStationNumber');
    router.push({ path: '/payment-success', query: { method: 'qrph', total: totalAmount.value, ref: refNum } })
  } catch (error) { alert("Failed to submit order."); } finally { isLoading.value = false; }
}
const goBackToCheckout = () => router.push('/checkout') 
</script>

<template>
  <div class="qr-container">
      <HeaderBar />
    <div class="back-btn-wrapper"><button @click="goBackToCheckout" class="top-back-btn">← Back to Checkout</button></div>
    <div class="content-wrapper">
      <h2 class="page-title">Scan QR to Pay</h2>
      <p class="instruction-text">Please scan the <strong>{{ selectedMethod }}</strong> QR code.</p>
      <div class="tabs-wrapper" style="display:flex; justify-content:center; gap:10px; margin-bottom:20px;">
         <button :class="['tab-btn', {active: selectedMethod === 'GCash'}]" @click="selectedMethod = 'GCash'">GCash</button>
         <button :class="['tab-btn', {active: selectedMethod === 'Maya'}]" @click="selectedMethod = 'Maya'">Maya</button>
      </div>
      <div class="qr-grid">
        <div v-if="selectedMethod === 'GCash'" class="qr-card gcash-card">
          <h3 class="qr-title">GCash</h3>
          <div class="qr-placeholder-box"><img :src="gcashQrSrc" alt="GCash QR" class="qr-image" /></div>
          <div class="recipient-info">
            <p class="recipient-name">Recipient: <strong>{{ gcashRecipient.name }}</strong></p>
            <p class="recipient-account">Account No.: <strong>{{ gcashRecipient.accountNo }}</strong></p>
          </div>
        </div>
        <div v-if="selectedMethod === 'Maya'" class="qr-card maya-card">
          <h3 class="qr-title">Maya</h3>
          <div class="qr-placeholder-box"><img :src="mayaQrSrc" alt="Maya QR" class="qr-image" /></div>
          <div class="recipient-info">
            <p class="recipient-name">Recipient: <strong>{{ mayaRecipient.name }}</strong></p>
            <p class="recipient-account">Account No.: <strong>{{ mayaRecipient.accountNo }}</strong></p>
          </div>
        </div>
      </div>
      <div class="confirmation-section">
        <h3>Confirm Transaction</h3>
        <div class="form-group">
          <label>Transaction Reference Number</label>
          <input v-model="referenceNumber" type="text" placeholder="Enter 12-digit ref number" class="ref-input" maxlength="12" />
        </div>
      </div>
    </div>
    <div class="bottom-bar">
      <div class="bar-total">Total Payment: <strong>₱ {{ totalAmount.toFixed(2) }}</strong></div>
      <button class="confirm-btn" @click="handlePaymentSent" :disabled="!referenceNumber.trim() || isLoading">{{ isLoading ? 'PROCESSING...' : 'CONFIRM PAYMENT' }}</button>
    </div>
  </div>
</template>

<style scoped>
.qr-container { min-height: 100vh; background-color: #f5f5f5; padding-bottom: 100px; font-family: sans-serif; }
.back-btn-wrapper { display: flex; justify-content: flex-start; padding-top: 2rem; max-width: 800px; margin: 0 auto; padding-left: 2rem; }
.top-back-btn { background: none; border: none; color: #555; font-weight: 600; cursor: pointer; }
.content-wrapper { max-width: 800px; margin: 0 auto; padding: 2rem; text-align: center; }
.qr-grid { display: flex; justify-content: center; margin-bottom: 2rem; }
.qr-card { background: white; padding: 2rem; border-radius: 10px; box-shadow: 0 4px 15px rgba(0,0,0,0.1); }
.qr-image { max-width: 200px; }
.recipient-info { margin-top: 1rem; padding-top: 1rem; border-top: 1px solid #eee; text-align: center; }
.recipient-name, .recipient-account { margin: 5px 0; color: #555; font-size: 0.9rem; }
.confirmation-section { max-width: 500px; margin: 0 auto; background: white; padding: 2rem; border-radius: 10px; }
.ref-input { width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 6px; margin-top: 10px; }
.bottom-bar { position: fixed; bottom: 0; left: 0; width: 100%; background: #2d3446; padding: 1.5rem; display: flex; justify-content: space-between; align-items: center; color: white; }
.confirm-btn { background-color: #00A950; color: white; border: none; padding: 10px 30px; font-weight: bold; border-radius: 20px; cursor: pointer; }
.confirm-btn:disabled { background-color: #999; cursor: not-allowed; }
.tab-btn { padding: 10px 20px; border: 1px solid #ddd; background: white; border-radius: 5px; cursor: pointer; font-weight: bold; }
.tab-btn.active { background-color: #2d3446; color: white; border-color: #2d3446; }
</style>