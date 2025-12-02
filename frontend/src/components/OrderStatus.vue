<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const isCod = computed(() => route.query.method === 'cod')
const totalAmount = computed(() => parseFloat(route.query.total || 0).toFixed(2))

// State for minimization
const isMinimized = ref(false)

const toggleMinimize = () => {
  isMinimized.value = !isMinimized.value
}
</script>

<template>
  <div class="popup-wrapper">
    <!-- Backdrop (Only visible when NOT minimized) -->
    <div class="backdrop" v-if="!isMinimized"></div>

    <!-- Dynamic Card Class -->
    <div class="card" :class="{ 'minimized': isMinimized }">
      
      <!-- MINIMIZED HEADER -->
      <div v-if="isMinimized" class="minimized-header">
        <span class="min-title">Order Status</span>
        <button @click="toggleMinimize" class="icon-btn">⤢</button>
      </div>

      <!-- FULL HEADER -->
      <template v-else>
        <button @click="toggleMinimize" class="minimize-top-btn" title="Minimize">–</button>
        <div class="status-header">Order Status</div>
      </template>
      
      <h3>Order #A12-4391</h3>
      
      <!-- FULL CONTENT -->
      <div v-if="!isMinimized" class="full-content">
        <div v-if="isCod" class="info-row">
            <div class="info-item left"><span>Payment Method:</span><br><strong>Cash on Delivery</strong></div>
            <div class="info-item right"><span>Total:</span><br><strong>₱ {{ totalAmount }}</strong></div>
        </div>

        <div class="timeline" :class="{ 'with-top-margin': isCod }">
            <div class="step active"><div class="marker">✔</div><div class="text">Order has been received</div></div>
            <div class="step pending"><div class="marker"></div><div class="text">Order is being prepared</div></div>
            <div class="step pending"><div class="marker"></div><div class="text">Order is ready and will be served shortly</div></div>
            <div class="step pending"><div class="marker"></div><div class="text">Order completed!</div></div>
        </div>
      </div>

      <!-- MINIMIZED SUMMARY -->
      <div v-else class="minimized-summary">
        <div class="status-badge"><span class="dot"></span> Preparing...</div>
      </div>

    </div>
  </div>
</template>

<style scoped>
/* POPUP STYLES */
.popup-wrapper {
    position: relative;
    z-index: 9999;
}

.backdrop {
    position: fixed;
    top: 0; left: 0; width: 100%; height: 100%;
    background-color: rgba(0,0,0,0.5);
    z-index: 9998;
}

/* Default State: Centered Popup */
.card {
    background: white;
    padding: 2.5rem;
    text-align: center;
    width: 90%;
    max-width: 450px;
    border-radius: 16px;
    border: 1px solid #eee;
    
    /* Centering */
    position: fixed;
    top: 50%; left: 50%;
    transform: translate(-50%, -50%);
    z-index: 9999;
    box-shadow: 0 10px 40px rgba(0,0,0,0.2);
    
    transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

/* Minimized State: Bottom Right */
.card.minimized {
    top: auto; left: auto;
    bottom: 20px; right: 20px;
    transform: none;
    width: 300px;
    padding: 1.2rem;
    box-shadow: 0 8px 30px rgba(0,0,0,0.15);
    border-color: #ffb84d;
}

/* --- Content Styles --- */
.status-header { 
    background-color: #ff6633; 
    color: white; 
    padding: 0.6rem 2rem; 
    border-radius: 8px; 
    display: inline-block; 
    font-weight: 600; 
    margin-bottom: 1.5rem; 
    width: 70%; 
}

.minimized-header { 
    display: flex; 
    justify-content: space-between; 
    align-items: center; 
    margin-bottom: 0.5rem; 
    border-bottom: 1px solid #eee; 
    padding-bottom: 0.5rem; 
}

.min-title { 
    font-weight: 700; 
    color: #ff6633; 
    font-size: 0.9rem; 
}

.icon-btn { 
    background: none; 
    border: none; 
    font-size: 1.2rem; 
    cursor: pointer; 
    color: #555; 
}

h3 { 
    margin-bottom: 1rem; 
    color: #333; 
    transition: font-size 0.3s; 
}

.card.minimized h3 { 
    font-size: 1rem; 
    margin-bottom: 0.5rem; 
    text-align: left; 
}

.minimized-summary { 
    text-align: left; }

.status-badge { display: inline-flex; align-items: center; background-color: #fff4e6; color: #d97706; padding: 0.4rem 0.8rem; border-radius: 20px; font-size: 0.9rem; font-weight: 600; }
.dot { width: 8px; height: 8px; background-color: #d97706; border-radius: 50%; display: inline-block; margin-right: 8px; animation: pulse 1.5s infinite; }
@keyframes pulse { 0% { opacity: 1; } 50% { opacity: 0.4; } 100% { opacity: 1; } 
}

.info-row { 
    display: flex; 
    justify-content: space-between; 
    margin-bottom: 2rem; 
    text-align: left; 
    padding: 0 5px; 
}

.info-item span { 
    font-size: 0.8rem; 
    font-weight: 700; 
    color: #333; 
}

.info-item strong { 
    font-size: 0.9rem; 
    color: #000; 
    font-weight: 400; 
}

.info-item.right { 
    text-align: right; 
}

/* Timeline */
.timeline { 
    text-align: left; 
    display: flex; 
    flex-direction: column; 
    gap: 0; 
    position: relative; 
    padding-left: 15px; 
}

.step { 
    display: flex; 
    align-items: flex-start; 
    gap: 15px; 
    position: relative; 
    padding-bottom: 25px; 
}

.step:last-child { 
    padding-bottom: 0; 
}

.step::before { 
    content: ''; 
    position: absolute; 
    left: 10px; 
    top: 25px; 
    width: 6px; 
    height: 100%; 
    background-color: #ddd; 
    z-index: 0; 
}

.step:last-child::before { 
    display: none; 
}
@keyframes fillDown { 0% { background-position: 0 100%; } 100% { background-position: 0 0; } }

.step.active::before { 
    background: linear-gradient(to bottom, #ffb84d 50%, #ddd 50%); 
    background-size: 100% 200%; 
    animation: fillDown 1s linear infinite; 
    box-shadow: none; 
}

.marker { 
    width: 26px; 
    height: 26px; 
    border-radius: 50%; 
    background-color: #ccc; 
    z-index: 2; display: flex; 
    justify-content: center; 
    align-items: center; 
    color: white; 
    font-size: 0.8rem; 
    flex-shrink: 0; 
    transition: background-color 0.3s; 
    position: relative; 
}

.active .marker { 
    background-color: #ffb84d; 
}
.text { 
    padding-top: 2px; 
    font-size: 0.9rem; 
    color: #666; 
}

.active .text { 
    color: #333; 
    font-weight: 500; 
}

.minimize-top-btn { 
    position: absolute; 
    top: 15px; 
    right: 15px; 
    background-color: transparent; 
    color: #888; 
    border: 1px solid #eee; 
    width: 30px; 
    height: 30px; 
    font-weight: 700; 
    font-size: 1.2rem; 
    border-radius: 50%; 
    cursor: pointer; 
    display: flex; 
    justify-content: center; 
    align-items: center; 
    transition: all 0.2s; 
    line-height: 1; 
}
.minimize-top-btn:hover { 
   background-color: #f9f9f9; 
   color: #ff6633; 
   border-color: #ff6633; 
   }
   
</style>